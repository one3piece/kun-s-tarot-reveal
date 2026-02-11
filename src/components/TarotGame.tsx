import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { tarotCards, type TarotCardData } from "@/data/cards";
import TarotCard from "./TarotCard";
import ResultOverlay from "./ResultOverlay";
import ParticleCanvas from "./ParticleCanvas";
import { useCamera } from "@/hooks/useCamera";
import { useHandGesture, type Gesture } from "@/hooks/useHandGesture";

type Phase = "intro" | "shuffle" | "select" | "reveal" | "result";

function shuffleArray<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

const GESTURE_LABELS: Record<Gesture, string> = {
  none: "",
  open_palm: "✋ 张开手掌",
  fist: "👊 握拳",
  ok: "👌 OK",
  swipe_left: "👈 左滑",
  swipe_right: "👉 右滑",
  two_hands: "🙌 双手",
};

export default function TarotGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [revealedCard, setRevealedCard] = useState<TarotCardData | null>(null);
  const [deck, setDeck] = useState(() => shuffleArray(tarotCards));
  const [showBurst, setShowBurst] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { isStreaming } = useCamera(videoRef);
  const { gesture, error: gestureError } = useHandGesture(videoRef);

  // Use refs to avoid stale closures
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const selectedIdxRef = useRef(selectedIdx);
  selectedIdxRef.current = selectedIdx;
  const deckRef = useRef(deck);
  deckRef.current = deck;

  const prevGesture = useRef<Gesture>("none");

  const handleAction = useCallback((g: Gesture) => {
    const p = phaseRef.current;
    const idx = selectedIdxRef.current;
    const d = deckRef.current;

    switch (p) {
      case "intro":
        if (g === "open_palm") {
          setDeck(shuffleArray(tarotCards));
          setPhase("shuffle");
        }
        break;
      case "select":
        if (g === "swipe_left") setSelectedIdx(Math.max(0, idx - 1));
        else if (g === "swipe_right") setSelectedIdx(Math.min(d.length - 1, idx + 1));
        else if (g === "fist") {
          setRevealedCard(d[idx]);
          setPhase("reveal");
          setShowBurst(true);
          setTimeout(() => setPhase("result"), 1800);
          setTimeout(() => setShowBurst(false), 2000);
        } else if (g === "two_hands") {
          setDeck(shuffleArray(tarotCards));
          setSelectedIdx(0);
          setPhase("shuffle");
        }
        break;
      case "result":
        if (g === "open_palm" || g === "two_hands") {
          setRevealedCard(null);
          setSelectedIdx(0);
          setDeck(shuffleArray(tarotCards));
          setPhase("shuffle");
        }
        break;
    }
  }, []);

  // Gesture handling
  useEffect(() => {
    if (gesture !== "none" && gesture !== prevGesture.current) {
      prevGesture.current = gesture;
      handleAction(gesture);
      setTimeout(() => {
        prevGesture.current = "none";
      }, 800);
    }
  }, [gesture, handleAction]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Gesture> = {
        " ": "open_palm",
        Enter: "fist",
        ArrowLeft: "swipe_left",
        ArrowRight: "swipe_right",
        o: "ok",
        r: "two_hands",
      };
      const g = map[e.key];
      if (g) {
        e.preventDefault();
        handleAction(g);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAction]);

  // Auto-advance shuffle → select
  useEffect(() => {
    if (phase === "shuffle") {
      const t = setTimeout(() => setPhase("select"), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Random shuffle positions
  const shufflePos = useMemo(
    () =>
      deck.map(() => ({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 300,
        r: Math.random() * 720 - 360,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase === "shuffle" ? phase : null]
  );

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <ParticleCanvas />

      {/* Camera PIP */}
      <div className="absolute top-3 right-3 z-30 w-40 h-30 md:w-48 md:h-36 rounded-lg overflow-hidden glass neon-border opacity-90">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover mirror"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            📷 等待摄像头...
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* INTRO */}
        {phase === "intro" && (
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-8xl font-black neon-text-cyan mb-4 tracking-wider">
              坤式塔罗
            </h1>
            <p className="text-xl md:text-3xl neon-text-pink mb-8 font-display">
              KUN TAROT
            </p>
            <div className="glass neon-border rounded-2xl px-6 py-5 max-w-sm mx-auto animate-slide-up">
              <p className="text-lg text-foreground mb-3">
                ✋ 举起你的手开始抽坤塔罗
              </p>
              <p className="text-sm text-muted-foreground">
                或按{" "}
                <kbd className="px-2 py-0.5 rounded bg-muted text-foreground text-xs font-mono">
                  空格
                </kbd>{" "}
                开始
              </p>
            </div>
            {gestureError && (
              <p className="mt-4 text-xs text-muted-foreground">{gestureError}</p>
            )}
            <div className="mt-6 glass rounded-xl px-4 py-3 max-w-xs mx-auto text-xs text-muted-foreground space-y-1">
              <p>⌨️ 键盘控制：空格=开始 ←→=切牌 Enter=抽牌 R=洗牌</p>
            </div>
          </div>
        )}

        {/* SHUFFLE */}
        {phase === "shuffle" && (
          <div className="relative w-full" style={{ height: 400 }}>
            <h2 className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl neon-text-purple font-bold z-20 animate-pulse-glow">
              🔮 洗牌中...
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              {deck.map((card, i) => (
                <div
                  key={card.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: `translate(${shufflePos[i].x}px, ${shufflePos[i].y}px) rotate(${shufflePos[i].r}deg)`,
                    transitionDelay: `${i * 40}ms`,
                  }}
                >
                  <TarotCard card={card} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SELECT */}
        {phase === "select" && (
          <div className="w-full flex flex-col items-center justify-center">
            <h2 className="text-lg md:text-xl neon-text-cyan font-bold mb-6 z-20 text-center">
              👊 握拳抽牌 &nbsp;|&nbsp; ←→ 切换 &nbsp;|&nbsp; 🙌 举双手洗牌
            </h2>
            <div
              className="relative flex items-center justify-center perspective-1000"
              style={{ height: 260, width: "100%" }}
            >
              {deck.map((card, i) => {
                const offset = i - selectedIdx;
                if (Math.abs(offset) > 4) return null;
                const isCenter = i === selectedIdx;
                return (
                  <div
                    key={card.id}
                    className="absolute transition-all duration-500 ease-out"
                    style={{
                      transform: `translateX(${offset * 120}px) translateZ(${-Math.abs(offset) * 50}px) rotateY(${offset * -5}deg) scale(${isCenter ? 1.15 : Math.max(0.65, 0.88 - Math.abs(offset) * 0.06)})`,
                      opacity: Math.max(0, 1 - Math.abs(offset) * 0.25),
                      zIndex: 10 - Math.abs(offset),
                    }}
                  >
                    <TarotCard
                      card={card}
                      isSelected={isCenter}
                      showGlow={isCenter}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              第 {selectedIdx + 1} / {deck.length} 张
            </div>
          </div>
        )}

        {/* REVEAL */}
        {phase === "reveal" && revealedCard && (
          <div className="flex items-center justify-center animate-scale-in relative">
            <TarotCard card={revealedCard} isFlipped size="lg" showGlow />
            {showBurst && <ParticleBurst />}
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && revealedCard && (
          <ResultOverlay
            card={revealedCard}
            onReset={() => handleAction("two_hands")}
          />
        )}
      </div>

      {/* Gesture indicator */}
      {gesture !== "none" && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass neon-border rounded-full px-5 py-2 text-sm text-primary font-display animate-fade-in">
          {GESTURE_LABELS[gesture]}
        </div>
      )}
    </div>
  );
}

function ParticleBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        angle: (i / 24) * 360,
        distance: 80 + Math.random() * 180,
        size: 4 + Math.random() * 6,
        color: ["hsl(190,100%,50%)", "hsl(330,100%,60%)", "hsl(270,100%,60%)", "hsl(150,100%,50%)"][i % 4],
        delay: Math.random() * 0.3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animation: `burst 1s ${p.delay}s ease-out forwards`,
              "--burst-x": `${Math.cos((p.angle * Math.PI) / 180) * p.distance}px`,
              "--burst-y": `${Math.sin((p.angle * Math.PI) / 180) * p.distance}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
