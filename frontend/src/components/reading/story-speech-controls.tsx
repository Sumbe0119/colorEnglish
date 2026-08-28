'use client';

import { Pause, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { VoiceGender } from '@/components/reading/reading-utils';
import { Button } from '@/components/ui/button';

const RATES = [
  { value: 0.7, label: 'Удаан' },
  { value: 0.85, label: 'Энгийн' },
  { value: 1, label: 'Хурдан' },
  { value: 1.15, label: 'Маш хурдан' },
] as const;

export function StorySpeechControls({
  playing,
  canResume,
  gender,
  rate,
  onGenderChange,
  onRateChange,
  onPlay,
  onStop,
  onRestart,
}: {
  playing: boolean;
  canResume?: boolean;
  gender: VoiceGender;
  rate: number;
  onGenderChange: (g: VoiceGender) => void;
  onRateChange: (r: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-ink-700 bg-ink-800/80 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-brand" />
        <span className="text-sm font-medium text-mist-200">Уншигч · ElevenLabs</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onGenderChange('female')}
          disabled={playing}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            gender === 'female'
              ? 'bg-brand/20 text-brand ring-1 ring-brand/40'
              : 'bg-ink-700 text-mist-300 hover:text-mist-50'
          }`}
        >
          Эмэгтэй
        </button>
        <button
          type="button"
          onClick={() => onGenderChange('male')}
          disabled={playing}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            gender === 'male'
              ? 'bg-brand/20 text-brand ring-1 ring-brand/40'
              : 'bg-ink-700 text-mist-300 hover:text-mist-50'
          }`}
        >
          Эрэгтэй
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-mist-300">
        Хурд
        <select
          value={rate}
          disabled={playing}
          onChange={(e) => onRateChange(Number(e.target.value))}
          className="rounded-lg border border-ink-600 bg-ink-900 px-2 py-1.5 text-mist-100"
        >
          {RATES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label} ({r.value}x)
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <Button type="button" onClick={onPlay} variant={playing ? 'secondary' : 'primary'}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Түр зогсоох' : canResume ? 'Үргэлжлүүлэх' : 'Speak — унших'}
        </Button>
        {playing && (
          <Button type="button" variant="ghost" onClick={onStop}>
            <Square className="h-4 w-4" /> Зогсоох
          </Button>
        )}
        {(playing || canResume) && (
          <Button type="button" variant="ghost" onClick={onRestart}>
            <RotateCcw className="h-4 w-4" /> Эхнээс
          </Button>
        )}
      </div>
    </div>
  );
}
