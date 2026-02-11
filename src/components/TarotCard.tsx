import type { TarotCardData } from "@/data/cards";

interface Props {
  card: TarotCardData;
  isFlipped?: boolean;
  isSelected?: boolean;
  showGlow?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-20 h-28 text-xs",
  md: "w-32 h-48 text-sm",
  lg: "w-52 h-72 text-base",
};

const emojiSizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

export default function TarotCard({
  card,
  isFlipped = false,
  isSelected = false,
  showGlow = false,
  size = "md",
}: Props) {
  return (
    <div className={`${sizes[size]} perspective-1000 select-none`}>
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-700 ease-out ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Back face */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden flex items-center justify-center ${
            showGlow || isSelected ? "neon-border" : "border border-border"
          } ${isSelected ? "animate-pulse-glow" : ""}`}
          style={{
            background:
              "linear-gradient(135deg, hsl(240 20% 8%), hsl(260 30% 12%), hsl(240 20% 8%))",
          }}
        >
          {/* Decorative borders */}
          <div className="absolute inset-2 rounded-lg border border-primary/20" />
          <div className="absolute inset-3 rounded-md border border-accent/10" />
          <div className="absolute inset-4 rounded border border-secondary/10" />
          {/* Center symbol */}
          <div className="relative flex flex-col items-center gap-1">
            <span className={emojiSizes[size]}>🔮</span>
            {size !== "sm" && (
              <span className="text-primary/60 font-display text-[10px] tracking-widest uppercase">
                Kun Tarot
              </span>
            )}
          </div>
          {/* Corner symbols */}
          <span className="absolute top-2 left-2 text-primary/30 text-xs">✦</span>
          <span className="absolute bottom-2 right-2 text-accent/30 text-xs">✦</span>
        </div>

        {/* Front face */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden ${
            showGlow ? "neon-border-pink" : "border border-border"
          }`}
          style={{ background: card.gradient }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
            <span className={`${emojiSizes[size]} mb-1 drop-shadow-lg`}>
              {card.emoji}
            </span>
            <h3
              className="font-bold drop-shadow-lg"
              style={{ color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              {card.title}
            </h3>
            {size !== "sm" && (
              <p
                className="mt-1 opacity-80"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: size === "lg" ? "0.875rem" : "0.7rem",
                }}
              >
                {card.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
