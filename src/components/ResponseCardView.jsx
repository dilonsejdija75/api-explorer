import { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SUIT_STYLE = {
  SPADES: 'text-slate-900',
  CLUBS: 'text-slate-900',
  HEARTS: 'text-red-600',
  DIAMONDS: 'text-red-600',
};

function formatCardLabel(card) {
  return `${card.value} of ${card.suit}`;
}

export default function ResponseCardView({ data, apiType, onDrawCard, onRemoveCard, onDiscardCard, discardCount }) {
  const [flipped, setFlipped] = useState(new Set());
  if (apiType === 'pokemon' && data.name) {
    const sprite = data.sprites?.front_default;
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        {sprite && <img src={sprite} alt={data.name} className="w-36 h-36 object-contain" style={{ imageRendering: 'pixelated' }} />}
        <div className="text-center">
          <h2 className="text-xl font-bold capitalize">{data.name}</h2>
          <p className="text-muted-foreground text-sm">#{String(data.id).padStart(3, '0')}</p>
        </div>
        <div className="flex gap-2">
          {data.types?.map(t => (
            <span key={t.type.name} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{t.type.name}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {[{ label: 'Height', value: `${data.height / 10}m` }, { label: 'Weight', value: `${data.weight / 10}kg` }, { label: 'XP', value: data.base_experience }].map(s => (
            <div key={s.label} className="bg-muted rounded-lg p-3 text-center">
              <div className="font-semibold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="w-full max-w-sm space-y-2">
          {data.stats?.slice(0, 4).map(s => (
            <div key={s.stat.name} className="flex items-center gap-2 text-xs">
              <span className="capitalize text-muted-foreground w-20 shrink-0">{s.stat.name}</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%` }} />
              </div>
              <span className="w-8 text-right font-medium">{s.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const toggleFlip = (code) => {
    setFlipped(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleCardClick = (card, event) => {
    if (event.shiftKey && onDrawCard) {
      onDrawCard();
      return;
    }
    toggleFlip(card.code);
  };

  const handleCardDoubleClick = (card, event) => {
    event.stopPropagation();
    if (onRemoveCard) onRemoveCard(card.code);
  };

  if (apiType === 'cards' && data.cards) {
    return (
      <div className="py-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">Deck: <span className="font-mono">{data.deck_id}</span> · {data.remaining} remaining</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-muted px-2 py-1 rounded-full">Discard pile: {discardCount}</span>
            {onDrawCard && (
              <Button size="sm" onClick={onDrawCard} className="h-8">Draw another card</Button>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
          {data.cards.map((card) => {
            const isFlipped = flipped.has(card.code);
            return (
              <div
                key={card.code}
                title={`${formatCardLabel(card)} • ${card.code}`}
                className="relative cursor-pointer select-none"
                onClick={(e) => handleCardClick(card, e)}
                onDoubleClick={(e) => handleCardDoubleClick(card, e)}
              >
                <div className="relative h-52 transition-transform duration-500 ease-out" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  <div className="absolute inset-0 rounded-3xl border border-border bg-white shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="relative h-full w-full">
                      {card.image ? (
                        <img src={card.image} alt={card.code} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-100 p-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold">{card.value}</p>
                            <p className={`text-sm uppercase tracking-[0.25em] ${SUIT_STYLE[card.suit]}`}>{card.suit}</p>
                          </div>
                        </div>
                      )}
                      {card.image && <div className="absolute inset-0 bg-black/20" />}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                        <div className="flex justify-between items-start text-xs font-semibold">
                          <span className={`${SUIT_STYLE[card.suit]} text-lg`}>{card.suit.charAt(0)}</span>
                          <span className="text-white/80 text-[11px]">{card.code}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                          <p className="text-3xl font-bold drop-shadow-sm">{card.value}</p>
                          <p className={`text-sm uppercase tracking-[0.25em] ${SUIT_STYLE[card.suit]} drop-shadow-sm`}>{card.suit}</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/90">
                          <span>Click to flip</span>
                          <span>Shift+click to draw</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-3xl border border-border bg-slate-900 text-white shadow-lg p-4 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3">Card Back</p>
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: 9 }).map((_, idx) => (
                        <span key={idx} className="h-2 w-2 rounded-full bg-white/60" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <span className="truncate">{formatCardLabel(card)}</span>
                  <div className="flex items-center gap-1">
                    {onDiscardCard && (
                      <button type="button" onClick={(e) => { e.stopPropagation(); onDiscardCard(card.code); }} className="rounded-full border border-border p-1 hover:bg-muted">
                        <Play className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); if (onRemoveCard) onRemoveCard(card.code); }} className="rounded-full border border-border p-1 hover:bg-muted">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Double-click a card to remove it from your hand; use the play button to discard.</p>
      </div>
    );
  }

  if (apiType === 'dogs' && data.message) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <img src={data.message} alt="dog" className="max-w-xs w-full rounded-xl shadow-lg object-cover max-h-72" />
        <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">{data.message}</p>
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground text-center py-10">No card view available for this response</p>;
}