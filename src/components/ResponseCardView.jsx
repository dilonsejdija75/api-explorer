export default function ResponseCardView({ data, apiType }) {
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

  if (apiType === 'cards' && data.cards) {
    return (
      <div className="py-6">
        <p className="text-xs text-muted-foreground mb-4 text-center">Deck: <span className="font-mono">{data.deck_id}</span> · {data.remaining} remaining</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {data.cards.map((card, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <img src={card.image} alt={card.code} className="w-20 rounded shadow-md hover:scale-105 transition-transform" onError={e => e.target.style.display='none'} />
              <span className="text-xs text-muted-foreground">{card.value} of {card.suit}</span>
            </div>
          ))}
        </div>
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