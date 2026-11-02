// frontend/src/components/tug-of-war/solo-tug.tsx
// Ганцаарчилсан горим: тоглогч vs бот (easy / medium / hard / expert). Бүтэн дэлгэцийн canvas (TugScene) дээр
// сонголт / үр дүнгийн давхарга, доор нь хоёр асуултын карт (зүүн — улаан баг, баруун — цэнхэр баг).
// Бот өөрийн асуултад санамсаргүй хугацааны дараа профайлынхаа магадлалаар хариулна; зөв бол олс өөр тийшээ татна.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Flag, Play, RotateCcw, Timer, Trophy, X } from 'lucide-react';
import {
  BOT_LEVELS,
  botProfile,
  CORRECT_LOCK_MS,
  COUNTDOWN_MS,
  DIFFICULTY_LABELS,
  DURATIONS,
  formatClock,
  loadBest,
  loadPrefs,
  otherTeam,
  pickQuestions,
  planBotAnswer,
  PULL_STEP,
  randomBotName,
  recordBest,
  savePrefs,
  TEAM_INFO,
  teamSign,
  tugScore,
  winnerByLine,
  winnerByTime,
  WRONG_LOCK_MS,
  type BestRecord,
  type Difficulty,
  type Duration,
  type Team,
  type TugQuestion,
} from '@/lib/tug-of-war';
import { sfx, unlockAudio } from '@/lib/type-rush-sfx';
import { submitGameScore, type SubmitScoreResult } from '@/lib/games-services';
import { LeaderboardPanel } from '@/components/games/leaderboard';
import { Choice, GameButton, ModeSwitch, MuteButton, Overlay, Rule, SectionLabel, Stat, type Mode } from '@/components/type-rush/game-ui';
import { QuestionCard, type CardFeedback } from './question-card';
import { TugScene, type TugSceneHandle } from './tug-scene';

type Phase = 'select' | 'countdown' | 'playing' | 'finished';

const RESULTS_DELAY_MS = 1600;

export function SoloTug({
  playerName,
  mode,
  onMode,
  onFinale,
}: {
  playerName: string;
  mode: Mode;
  onMode: (m: Mode) => void;
  onFinale: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('select');
  const [team, setTeam] = useState<Team>('red');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [duration, setDuration] = useState<Duration>(180);
  const [botName, setBotName] = useState('Бот');
  const [myQ, setMyQ] = useState<TugQuestion | null>(null);
  const [botQ, setBotQ] = useState<TugQuestion | null>(null);
  const [myFb, setMyFb] = useState<CardFeedback>(null);
  const [botFb, setBotFb] = useState<CardFeedback>(null);
  const [botThinking, setBotThinking] = useState(false);
  const [myCorrect, setMyCorrect] = useState(0);
  const [botCorrect, setBotCorrect] = useState(0);
  const [myWrong, setMyWrong] = useState(0);
  const [locked, setLocked] = useState(false);
  const [winner, setWinner] = useState<Team | 'draw' | null>(null);
  const [reason, setReason] = useState<'line' | 'time' | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<BestRecord>({ score: 0, wins: 0, plays: 0 });
  const [isNewBest, setIsNewBest] = useState(false);
  const [serverResult, setServerResult] = useState<SubmitScoreResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lbRefresh, setLbRefresh] = useState(0);

  const sceneRef = useRef<TugSceneHandle>(null);
  const posRef = useRef(0);
  const myListRef = useRef<TugQuestion[]>([]);
  const botListRef = useRef<TugQuestion[]>([]);
  const myIdxRef = useRef(0);
  const botIdxRef = useRef(0);
  const myCorrectRef = useRef(0);
  const botCorrectRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const endAtRef = useRef(0);
  const phaseRef = useRef<Phase>('select');
  const teamRef = useRef<Team>('red');
  const lastUrgentSecRef = useRef(-1);
  phaseRef.current = phase;
  teamRef.current = team;

  const botTeam = otherTeam(team);

  useEffect(() => {
    const p = loadPrefs();
    setTeam(p.team);
    setDifficulty(p.difficulty);
    setDuration(p.duration);
    setBest(loadBest());
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  // HUD: нэр, оноо
  useEffect(() => {
    sceneRef.current?.setHud({
      redName: team === 'red' ? playerName : botName,
      blueName: team === 'blue' ? playerName : botName,
      redScore: team === 'red' ? myCorrect : botCorrect,
      blueScore: team === 'blue' ? myCorrect : botCorrect,
      myTeam: team,
    });
  }, [team, playerName, botName, myCorrect, botCorrect]);

  const finishGame = useCallback(
    (w: Team | 'draw', why: 'line' | 'time') => {
      if (phaseRef.current === 'finished') return;
      clearTimers();
      setPhase('finished');
      setWinner(w);
      setReason(why);
      setBotThinking(false);
      sceneRef.current?.finish(w);
      sceneRef.current?.setHud({ urgent: false, fraction: Math.max(0, (endAtRef.current - performance.now()) / (duration * 1000)) });
      const won = w === teamRef.current;
      const s = tugScore(myCorrectRef.current, won, difficulty);
      setScore(s);
      setIsNewBest(recordBest(s, won));
      setBest(loadBest());
      if (won) {
        sfx.win();
        onFinale();
      } else if (w === 'draw') sfx.finish();
      else sfx.timeout();
      submitGameScore('TUG_OF_WAR', s, {
        mode: 'solo',
        difficulty,
        team: teamRef.current,
        won,
        draw: w === 'draw',
        correct: myCorrectRef.current,
        wrong: myWrong,
        durationSec: duration,
        reason: why,
      })
        .then((res) => {
          setServerResult(res);
          setLbRefresh((k) => k + 1);
        })
        .catch(() => undefined);
      later(() => setShowResults(true), RESULTS_DELAY_MS);
    },
    [clearTimers, difficulty, duration, later, myWrong, onFinale],
  );

  /** Олсыг тухайн баг руу татна; шугам давбал тоглоом дуусна. */
  const pullFor = useCallback(
    (t: Team) => {
      posRef.current = Math.max(-1, Math.min(1, posRef.current + teamSign(t) * PULL_STEP));
      sceneRef.current?.setPos(posRef.current);
      sceneRef.current?.pull(t);
      const w = winnerByLine(posRef.current);
      if (w) later(() => finishGame(w, 'line'), 350);
      return !!w;
    },
    [finishGame, later],
  );

  // ── Бот ──
  const scheduleBot = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const q = botListRef.current[botIdxRef.current % botListRef.current.length];
    setBotQ(q);
    setBotFb(null);
    setBotThinking(true);
    const plan = planBotAnswer(botProfile(difficulty), q);
    later(() => {
      if (phaseRef.current !== 'playing') return;
      setBotThinking(false);
      setBotFb({ option: plan.option, correct: plan.correct, answer: q.answer });
      botIdxRef.current += 1;
      let ended = false;
      if (plan.correct) {
        botCorrectRef.current += 1;
        setBotCorrect(botCorrectRef.current);
        sfx.rivalFinish();
        ended = pullFor(otherTeam(teamRef.current));
      } else {
        sceneRef.current?.stumble(otherTeam(teamRef.current));
      }
      if (!ended) later(scheduleBot, plan.correct ? CORRECT_LOCK_MS + 400 : WRONG_LOCK_MS);
    }, plan.delayMs);
  }, [difficulty, later, pullFor]);

  // ── Тоглогч ──
  const nextMine = useCallback(() => {
    const q = myListRef.current[myIdxRef.current % myListRef.current.length];
    setMyQ(q);
    setMyFb(null);
    setLocked(false);
  }, []);

  const onPick = useCallback(
    (option: number) => {
      if (phaseRef.current !== 'playing' || locked || !myQ) return;
      unlockAudio();
      const correct = option === myQ.answer;
      setLocked(true);
      setMyFb({ option, correct, answer: myQ.answer });
      myIdxRef.current += 1;
      let ended = false;
      if (correct) {
        myCorrectRef.current += 1;
        setMyCorrect(myCorrectRef.current);
        sfx.boost();
        ended = pullFor(teamRef.current);
      } else {
        setMyWrong((n) => n + 1);
        sfx.boom();
        sceneRef.current?.stumble(teamRef.current);
      }
      if (!ended) later(nextMine, correct ? CORRECT_LOCK_MS : WRONG_LOCK_MS);
    },
    [later, locked, myQ, nextMine, pullFor],
  );

  // ── Цаг ──
  useEffect(() => {
    if (phase !== 'playing') return;
    const total = duration * 1000;
    const id = window.setInterval(() => {
      const remain = endAtRef.current - performance.now();
      const sec = Math.ceil(remain / 1000);
      const urgent = remain <= 10_000;
      sceneRef.current?.setHud({ timerText: formatClock(remain), fraction: remain / total, urgent });
      if (urgent && sec !== lastUrgentSecRef.current && sec > 0) {
        lastUrgentSecRef.current = sec;
        sfx.urgent();
      }
      if (remain <= 0) finishGame(winnerByTime(posRef.current), 'time');
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, duration, finishGame]);

  const start = useCallback(() => {
    unlockAudio();
    clearTimers();
    savePrefs({ team, difficulty, duration });
    // Нэг жагсаалт: тоглогч эхнээс, бот голоос эхэлнэ (ижил асуулт зэрэг гарахгүй)
    myListRef.current = pickQuestions(difficulty);
    botListRef.current = myListRef.current;
    myIdxRef.current = 0;
    botIdxRef.current = Math.floor(myListRef.current.length / 2);
    myCorrectRef.current = 0;
    botCorrectRef.current = 0;
    posRef.current = 0;
    lastUrgentSecRef.current = -1;
    setMyCorrect(0);
    setBotCorrect(0);
    setMyWrong(0);
    setMyFb(null);
    setBotFb(null);
    setBotThinking(false);
    setWinner(null);
    setReason(null);
    setScore(0);
    setIsNewBest(false);
    setServerResult(null);
    setShowResults(false);
    setBotName(randomBotName());
    setMyQ(myListRef.current[0]);
    setBotQ(botListRef.current[botIdxRef.current]);
    setLocked(true);
    sceneRef.current?.resetPos(0);
    sceneRef.current?.clearFinish();
    sceneRef.current?.setHud({ timerText: formatClock(duration * 1000), fraction: 1, urgent: false });
    setPhase('countdown');
    const steps: (number | 'GO')[] = [3, 2, 1];
    steps.forEach((s, i) =>
      later(() => {
        sceneRef.current?.countdown(s);
        sfx.count();
      }, i * 1000),
    );
    later(() => {
      sceneRef.current?.countdown('GO');
      sfx.go();
    }, 3000);
    later(() => {
      endAtRef.current = performance.now() + duration * 1000;
      phaseRef.current = 'playing';
      setPhase('playing');
      setLocked(false);
      scheduleBot();
    }, COUNTDOWN_MS);
  }, [clearTimers, difficulty, duration, later, scheduleBot, team]);

  const quit = useCallback(() => {
    clearTimers();
    setPhase('select');
    setMyQ(null);
    setBotQ(null);
    setMyFb(null);
    setBotFb(null);
    setShowResults(false);
    sceneRef.current?.resetPos(0);
    sceneRef.current?.clearFinish();
    sceneRef.current?.countdown(null);
  }, [clearTimers]);

  const playing = phase === 'playing';
  const inGame = phase === 'countdown' || phase === 'playing' || phase === 'finished';
  const won = winner === team;
  const myCard = (
    <QuestionCard
      team={team}
      name={playerName}
      tag="ТА"
      question={myQ}
      interactive
      disabled={!playing || locked}
      feedback={myFb}
      correctCount={myCorrect}
      onPick={onPick}
      className={team === 'red' ? 'sm:order-1' : 'sm:order-2'}
    />
  );
  const botCard = (
    <QuestionCard team={botTeam} name={botName} tag="БОТ" question={botQ} interactive={false} feedback={botFb} thinking={playing && botThinking} correctCount={botCorrect} className={team === 'red' ? 'sm:order-2' : 'sm:order-1'} />
  );

  return (
    <>
      <div className="relative min-h-[150px] flex-1">
        <TugScene ref={sceneRef} running={playing} showHud={inGame} />

        {phase === 'select' && (
          <Overlay size="lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Game</p>
              <ModeSwitch mode={mode} onMode={onMode} />
            </div>
            <h1 className="mt-2 text-center font-display text-3xl font-bold tracking-wide text-mist-50 sm:text-4xl">ОЛС ТАТАХ</h1>
            <p className="mt-2 text-center text-sm text-mist-300">
              Бэлэн үү, <span className="font-semibold text-mist-50">{playerName}</span>? Өгүүлбэрийг зөв нөхөж олсыг өөр тийшээ тат!
            </p>

            <div className="mt-4 grid gap-1.5 text-xs text-mist-300 sm:grid-cols-2">
              <Rule icon={<Flag className="h-3.5 w-3.5 text-success" />}>Зөв хариулт бүрт олс таны тал руу татагдана.</Rule>
              <Rule icon={<Timer className="h-3.5 w-3.5 text-modifier" />}>Улаан тууз таны шугамыг давбал хожно; цаг дуусвал тууз аль талд байгаа нь хожно.</Rule>
            </div>

            <div className="mt-4">
              <SectionLabel>Баг</SectionLabel>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(['red', 'blue'] as Team[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sfx.ui();
                      setTeam(t);
                    }}
                    aria-pressed={team === t}
                    className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${team === t ? 'bg-ink-800' : 'border-ink-600/80 bg-ink-800/50 hover:border-ink-500'}`}
                    style={team === t ? { borderColor: TEAM_INFO[t].color, boxShadow: `0 0 0 3px ${TEAM_INFO[t].color}33` } : undefined}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: TEAM_INFO[t].color }} />
                      <span className="text-sm font-semibold text-mist-50">{TEAM_INFO[t].label}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-mist-400">{t === 'red' ? 'Зүүн тал' : 'Баруун тал'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <SectionLabel>Ботын түвшин</SectionLabel>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BOT_LEVELS.map((b) => (
                  <Choice
                    key={b.level}
                    active={difficulty === b.level}
                    onClick={() => {
                      sfx.ui();
                      setDifficulty(b.level);
                    }}
                  >
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <Bot className="h-3.5 w-3.5" /> {b.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-mist-400">{b.hint}</span>
                  </Choice>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <SectionLabel>Хугацаа</SectionLabel>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <Choice
                    key={d.value}
                    active={duration === d.value}
                    onClick={() => {
                      sfx.ui();
                      setDuration(d.value);
                    }}
                    className="text-center"
                  >
                    <span className="text-sm font-semibold">{d.label}</span>
                  </Choice>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <GameButton onClick={start} autoFocus className="px-8 py-3 text-base">
                <Play className="h-5 w-5" /> ТОГЛОХ
              </GameButton>
              <MuteButton />
            </div>
            {best.plays > 0 && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs text-modifier">
                <Trophy className="h-3.5 w-3.5" />
                Шилдэг: {best.score} оноо · {best.wins}/{best.plays} ялалт
              </p>
            )}
            <LeaderboardPanel scope="TUG_OF_WAR" limit={5} compact refreshKey={lbRefresh} className="mt-3" />
          </Overlay>
        )}

        {phase === 'finished' && showResults && (
          <Overlay tone={won ? 'success' : winner === 'draw' ? 'brand' : 'danger'} size="lg">
            <div className="flex items-center justify-center gap-3">
              {won ? <Trophy className="h-7 w-7 text-modifier" /> : <Flag className="h-7 w-7 text-mist-300" />}
              <h2 className={`font-display text-3xl font-bold tracking-[0.12em] sm:text-4xl ${won ? 'text-success' : winner === 'draw' ? 'text-modifier' : 'text-danger'}`}>
                {won ? 'ТА ХОЖЛОО!' : winner === 'draw' ? 'ТЭНЦЭЭ' : 'ХОЖИГДЛОО'}
              </h2>
            </div>
            <p className="mt-2 text-center text-sm text-mist-300">
              {reason === 'line'
                ? won
                  ? `Тууз ${TEAM_INFO[team].label.toLowerCase()}ийн шугамыг давлаа.`
                  : `Тууз ${TEAM_INFO[botTeam].label.toLowerCase()}ийн шугамыг давлаа.`
                : winner === 'draw'
                  ? 'Хугацаа дуусахад тууз яг голд байлаа.'
                  : `Хугацаа дууслаа — тууз ${winner === 'red' ? 'улаан' : 'цэнхэр'} талд байлаа.`}{' '}
              Бот: {DIFFICULTY_LABELS[difficulty]}.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <Stat label="Оноо" value={String(score)} />
              <Stat label="Таны зөв" value={String(myCorrect)} tone="text-success" />
              <Stat label="Таны буруу" value={String(myWrong)} tone="text-danger" />
              <Stat label={`${botName}`} value={String(botCorrect)} tone="text-mist-300" />
            </div>
            {isNewBest && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-modifier">
                <Trophy className="h-3.5 w-3.5" /> Шинэ рекорд!
              </p>
            )}
            {serverResult && (
              <p className="mt-2 text-center text-xs text-mist-300">
                Leaderboard: <span className="font-mono font-semibold text-brand">#{serverResult.rank}</span> · шилдэг {serverResult.best} оноо · {serverResult.plays} тоглолт
              </p>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <GameButton onClick={start} autoFocus>
                <RotateCcw className="h-4 w-4" /> Дахин тоглох
              </GameButton>
              <GameButton onClick={quit} tone="ghost">
                Эхлэл рүү
              </GameButton>
            </div>
            <LeaderboardPanel scope="TUG_OF_WAR" limit={5} compact refreshKey={lbRefresh} className="mt-4" />
          </Overlay>
        )}
      </div>

      {inGame && (
        <div className="ce-scroll max-h-[60%] shrink-0 overflow-y-auto border-t-2 border-ink-600/80 bg-ink-900/95 px-2 py-2 backdrop-blur sm:max-h-none sm:overflow-visible sm:px-4 sm:py-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-mist-400">
            <span>
              Бот: <span className="text-mist-200">{DIFFICULTY_LABELS[difficulty]}</span> · {formatClock(duration * 1000)}
            </span>
            <div className="flex items-center gap-1.5">
              <MuteButton compact />
              <button
                type="button"
                onClick={quit}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600/80 bg-ink-900/80 text-mist-400 transition-colors hover:border-danger/60 hover:text-danger"
                aria-label="Болих"
                title="Болих"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Утсанд: тоглогчийн карт дээр, ботынх доор. Өргөн дэлгэцэд: улаан зүүн, цэнхэр баруун. */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {myCard}
            {botCard}
          </div>
        </div>
      )}
    </>
  );
}
