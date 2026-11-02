// frontend/src/components/listening/youtube-player.tsx
// YouTube IFrame API-г ачаалж тоглуулагч үүсгэнэ. Imperative handle: play / pause / restart / seek / currentTime.
// YouTube-ийн өөрийн удирдлагыг нуусан (controls=0) — тоглоомын үед хэрэглэгч гүйлгэж давтахгүй;
// үр дүнгийн үед CC мөр дээр дарж / өөрийн товчоор тоглуулна. Player бэлэн болохоос өмнөх дуудлагыг үл тоомсорлоно.
'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type YTPlayerState = -1 | 0 | 1 | 2 | 3 | 5;

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): YTPlayerState;
  destroy(): void;
  /** 'captions' / 'cc' модулийг буулгавал хадмал харагдахгүй */
  unloadModule(module: string): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: YTPlayerState }) => void;
        onError?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

function loadApi(): Promise<YTNamespace> {
  if (typeof window === 'undefined') return new Promise(() => undefined);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.querySelector('script[src^="https://www.youtube.com/iframe_api"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      document.head.appendChild(s);
    }
  });
  return apiPromise;
}

export type PlayerStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error';

export type YoutubePlayerHandle = {
  play(): void;
  pause(): void;
  /** Клипийн эхлэл рүү буцааж тоглуулна */
  restart(): void;
  seek(sec: number, play?: boolean): void;
  currentTime(): number;
};

export const YoutubePlayer = forwardRef<
  YoutubePlayerHandle,
  {
    videoId: string;
    startSec: number;
    endSec: number;
    onStatus?: (s: PlayerStatus) => void;
    /** Тоглож байх үед ~200мс тутам */
    onTime?: (sec: number) => void;
    className?: string;
  }
>(function YoutubePlayer({ videoId, startSec, endSec, onStatus, onTime, className = '' }, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const statusRef = useRef<PlayerStatus>('loading');
  const cbRef = useRef({ onStatus, onTime });
  cbRef.current = { onStatus, onTime };
  const rangeRef = useRef({ startSec, endSec });
  rangeRef.current = { startSec, endSec };

  const setStatus = (s: PlayerStatus) => {
    statusRef.current = s;
    cbRef.current.onStatus?.(s);
  };
  /** Бэлэн player (API методууд onReady-оос өмнө байхгүй) */
  const ready = () => (readyRef.current ? playerRef.current : null);
  /** Хадмалыг унтраана — тоглогч үгийг сонсож таних ёстой, уншиж биш (cc_load_policy=0 нь хэрэглэгчийн тохиргоог дарахгүй) */
  const hideCaptions = () => {
    const p = ready();
    if (!p) return;
    try {
      p.unloadModule('captions');
      p.unloadModule('cc');
    } catch {
      /* хуучин player */
    }
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const mount = document.createElement('div');
    host.appendChild(mount);
    setStatus('loading');
    readyRef.current = false;
    void loadApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(mount, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          start: startSec,
          end: endSec,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          // 0 = хүчээр асаахгүй; 3 = баримтжаагүй ч олон тоглуулагч дээр хадмалыг бүрмөсөн унтраадаг утга
          cc_load_policy: 3,
          cc_lang_pref: 'zz',
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            hideCaptions();
            setStatus('ready');
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              hideCaptions();
              setStatus('playing');
            } else if (e.data === YT.PlayerState.PAUSED) setStatus('paused');
            else if (e.data === YT.PlayerState.ENDED) setStatus('ended');
          },
          onError: () => setStatus('error'),
        },
      });
    });
    const tick = window.setInterval(() => {
      const p = ready();
      if (!p || statusRef.current !== 'playing') return;
      try {
        const t = p.getCurrentTime();
        cbRef.current.onTime?.(t);
        // end параметр заримдаа ажиллахгүй — өөрсдөө зогсооно
        if (t >= rangeRef.current.endSec - 0.05) {
          p.pauseVideo();
          setStatus('ended');
        }
      } catch {
        /* player устсан */
      }
    }, 200);
    return () => {
      cancelled = true;
      window.clearInterval(tick);
      readyRef.current = false;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      host.innerHTML = '';
    };
    // startSec/endSec зөвхөн анх үүсгэхэд хэрэгтэй (rangeRef-ээр уншина)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useImperativeHandle(
    ref,
    () => ({
      play() {
        const p = ready();
        if (!p) return;
        if (statusRef.current === 'ended') p.seekTo(rangeRef.current.startSec, true);
        p.playVideo();
      },
      pause() {
        ready()?.pauseVideo();
      },
      restart() {
        const p = ready();
        if (!p) return;
        p.seekTo(rangeRef.current.startSec, true);
        p.playVideo();
      },
      seek(sec, play = true) {
        const p = ready();
        if (!p) return;
        p.seekTo(Math.max(rangeRef.current.startSec, Math.min(rangeRef.current.endSec - 0.5, sec)), true);
        if (play) p.playVideo();
      },
      currentTime() {
        try {
          return ready()?.getCurrentTime() ?? 0;
        } catch {
          return 0;
        }
      },
    }),
    [],
  );

  return <div ref={hostRef} className={`relative aspect-video w-full overflow-hidden rounded-xl bg-black [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full ${className}`} />;
});
