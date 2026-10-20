// frontend/src/components/type-rush/game-ui.tsx
// "Бичих уралдаан" тоглоомын нийтлэг UI: давхарга (overlay), тоглоомын товч, дүрэм, статистик,
// дуу хаах товч, горим солигч (ганцаараа / онлайн), CSS анимацууд. Solo болон онлайн горим хоёулаа ашиглана.
'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Users, Volume2, VolumeX } from 'lucide-react';
import { isMuted, setMuted, sfx, unlockAudio } from '@/lib/type-rush-sfx';

export type Mode = 'solo' | 'online';

export const TR_STYLES = `
@keyframes tr-rise {
  0% { transform: translateY(18px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.tr-rise { animation: tr-rise 0.5s cubic-bezier(.2,.9,.3,1.1) forwards; }
@keyframes tr-pop {
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.tr-pop { animation: tr-pop 0.45s cubic-bezier(.2,.9,.3,1.3) forwards; }
@keyframes tr-caret { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
.tr-caret { animation: tr-caret 0.9s steps(1) infinite; }
@keyframes tr-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.tr-blink { animation: tr-blink 1.1s ease-in-out infinite; }
`;

/** Тоглоомын товч — пиксел маягийн хүрээ, сүүдэртэй (sentence-builder-тэй ижил) */
export function GameButton({
  children,
  onClick,
  tone = 'brand',
  className = '',
  disabled,
  autoFocus,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: 'brand' | 'ghost' | 'warning' | 'danger';
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: 'button' | 'submit';
}) {
  const ref = useRef<HTMLButtonElement>(null);
  // Төрөлх autoFocus гүйлгэх хайрцагтай давхаргыг доош нь гүйлгэдэг (гарчиг нуугдана) — preventScroll-той фокуслоно
  useEffect(() => {
    if (autoFocus) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  const tones = {
    brand: 'bg-brand text-white shadow-[0_4px_0_#2A5BB8] hover:bg-brand-hover active:translate-y-[2px] active:shadow-[0_2px_0_#2A5BB8]',
    ghost: 'border border-ink-500 bg-ink-800 text-mist-200 shadow-[0_4px_0_#0C1220] hover:border-ink-500 hover:bg-ink-700 active:translate-y-[2px] active:shadow-[0_2px_0_#0C1220]',
    warning: 'border border-warning/50 bg-warning/10 text-warning shadow-[0_4px_0_rgba(255,176,32,0.25)] hover:bg-warning/20 active:translate-y-[2px] active:shadow-none',
    danger: 'bg-danger text-ink-950 shadow-[0_4px_0_#B03A48] hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_#B03A48]',
  };
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-default disabled:opacity-50 disabled:active:translate-y-0 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Тоглоомын дэлгэц дээрх давхарга (эхлэх / үр дүн / lobby). Урт агуулга дотроо гүйлгэнэ. */
export function Overlay({
  children,
  tone = 'brand',
  size = 'md',
  align = 'center',
}: {
  children: React.ReactNode;
  tone?: 'brand' | 'danger' | 'success';
  size?: 'md' | 'lg' | 'xl';
  /** 'top' бол давхарга дээр байрлаж, доорх зам (машинууд) харагдана */
  align?: 'center' | 'top';
}) {
  const border = tone === 'danger' ? 'border-danger/50' : tone === 'success' ? 'border-success/50' : 'border-brand/40';
  const glow =
    tone === 'danger'
      ? 'shadow-[0_0_0_4px_rgba(255,107,122,0.12),0_24px_60px_rgba(0,0,0,0.6)]'
      : tone === 'success'
        ? 'shadow-[0_0_0_4px_rgba(61,220,151,0.12),0_24px_60px_rgba(0,0,0,0.6)]'
        : 'shadow-[0_0_0_4px_rgba(79,140,255,0.12),0_24px_60px_rgba(0,0,0,0.6)]';
  const maxW = size === 'xl' ? 'max-w-3xl' : size === 'lg' ? 'max-w-xl' : 'max-w-md';
  // Гүйлгэх хайрцаг + min-h-full flex: агуулга багтахгүй урт үед дээд талаас нь тайрахгүй, богино үед голлоно
  return (
    <div className="ce-scroll absolute inset-0 overflow-y-auto bg-ink-950/45 backdrop-blur-[2px]">
      <div className={`flex min-h-full justify-center p-3 sm:p-6 ${align === 'top' ? 'items-start' : 'items-center'}`}>
        <div className={`tr-rise w-full ${maxW} rounded-2xl border-2 ${border} bg-ink-900/95 p-4 ${glow} sm:p-6`}>{children}</div>
      </div>
    </div>
  );
}

export function Rule({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-ink-600/60 bg-ink-800/60 px-2.5 py-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

export function Stat({ label, value, tone = 'text-mist-50' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-ink-600/70 bg-ink-800/70 px-2 py-2">
      <p className="text-[10px] uppercase tracking-wider text-mist-500">{label}</p>
      <p className={`mt-0.5 font-display text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

/** Хэсгийн жижиг гарчиг (сонголтын дэлгэц) */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-500">{children}</p>;
}

/** Сонголтын чип (түвшин, цаг гэх мэт) */
export function Choice({
  active,
  onClick,
  disabled,
  children,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-xl border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? 'border-brand bg-brand/15 text-mist-50' : 'border-ink-600/80 bg-ink-800/60 text-mist-300 hover:border-ink-500'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function MuteButton({ compact = false }: { compact?: boolean }) {
  const [muted, setMutedState] = useState(false);
  useEffect(() => setMutedState(isMuted()), []);
  return (
    <button
      type="button"
      onClick={() => {
        const next = !muted;
        setMuted(next);
        setMutedState(next);
        if (!next) {
          unlockAudio();
          sfx.ui();
        }
      }}
      className={`inline-flex items-center gap-1 rounded-lg border border-ink-600/80 bg-ink-900/80 text-xs text-mist-400 transition-colors hover:border-ink-500 hover:text-mist-50 ${
        compact ? 'h-9 w-9 justify-center' : 'px-3 py-1.5'
      }`}
      aria-label={muted ? 'Дуу нээх' : 'Дуу хаах'}
      title={muted ? 'Дуу нээх' : 'Дуу хаах'}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {!compact && (muted ? 'Дуугүй' : 'Дуутай')}
    </button>
  );
}

/** Ганцаараа ↔ Онлайн горим солигч */
export function ModeSwitch({ mode, onMode }: { mode: Mode; onMode: (m: Mode) => void }) {
  const item = (m: Mode, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => {
        if (m !== mode) {
          sfx.ui();
          onMode(m);
        }
      }}
      aria-pressed={mode === m}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:px-4 ${
        mode === m ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div className="inline-flex w-full rounded-xl border border-ink-600/80 bg-ink-950/70 p-1 sm:w-auto">
      {item('solo', <Bot className="h-3.5 w-3.5" />, 'Ганцаараа')}
      {item('online', <Users className="h-3.5 w-3.5" />, 'Онлайн')}
    </div>
  );
}
