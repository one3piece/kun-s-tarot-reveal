import type { TarotCardData } from "@/data/cards";
import TarotCard from "./TarotCard";

interface Props {
  card: TarotCardData;
  onReset: () => void;
}

export default function ResultOverlay({ card, onReset }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 max-w-4xl mx-auto px-4">
        <div className="animate-float">
          <TarotCard card={card} isFlipped size="lg" showGlow />
        </div>
        <div className="glass neon-border-pink rounded-2xl p-6 md:p-8 max-w-md animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{card.emoji}</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-black neon-text-cyan">
                {card.title}
              </h2>
              <p className="neon-text-pink text-sm">{card.subtitle}</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed mb-4">{card.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">🔮 关键词:</span>
            <span className="px-3 py-1 rounded-full text-sm font-bold neon-border text-primary">
              {card.keyword}
            </span>
          </div>
          <div className="border-t border-border/50 pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              ✋ 张开手掌 / 举双手 重新抽牌
            </p>
            <button
              onClick={onReset}
              className="glass neon-border rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors font-display tracking-wider"
            >
              再来一次
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
