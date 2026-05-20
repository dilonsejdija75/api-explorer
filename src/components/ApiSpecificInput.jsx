import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DOG_BREEDS = [
  'random', 'affenpinscher', 'african', 'airedale', 'akita', 'appenzeller',
  'australian-shepherd', 'basenji', 'beagle', 'bluetick', 'borzoi',
  'boxer', 'bulldog', 'bullterrier', 'cairn', 'chihuahua', 'chow',
  'clumber', 'cocker', 'collie', 'coonhound', 'corgi-cardigan',
  'dachshund', 'dalmatian', 'dane', 'doberman', 'elkhound', 'entlebucher',
  'eskimo', 'germanshepherd', 'greyhound', 'hound-afghan', 'hound-basset',
  'hound-blood', 'husky', 'labrador', 'malamute', 'malinois', 'maltese',
  'mastiff', 'mexicanhairless', 'mix', 'mountain-bernese', 'newfoundland',
  'papillon', 'pekinese', 'pembroke', 'pinscher', 'pitbull', 'pointer',
  'pomeranian', 'poodle-standard', 'poodle-toy', 'pug', 'puggle',
  'retriever-golden', 'retriever-labrador', 'ridgeback-rhodesian',
  'rottweiler', 'samoyed', 'schnauzer', 'setter-english', 'shiba',
  'shihtzu', 'spaniel-cocker', 'spitz', 'springer', 'terrier-scottish',
  'terrier-yorkshire', 'vizsla', 'weimaraner', 'whippet',
];

const formatBreedLabel = (breed) => {
  if (breed === 'random') return '🎲 Random (any breed)';
  return breed.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function ApiSpecificInput({ apiType, value, onChange }) {
  if (apiType === 'pokemon') {
    return (
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Pokémon name or ID (e.g., pikachu, charizard, 25)</label>
        <Input
          placeholder="e.g. pikachu, mewtwo, 150…"
          value={value}
          onChange={e => onChange(e.target.value.toLowerCase().trim())}
          className="font-mono"
        />
        <div className="flex flex-wrap gap-1 pt-0.5">
          {['pikachu', 'charizard', 'mewtwo', 'eevee', 'snorlax', '1', '25', '150'].map(s => (
            <button key={s} onClick={() => onChange(s)}
              className={`px-2 py-0.5 rounded text-[10px] border transition-colors font-mono ${value === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (apiType === 'cards') {
    const count = parseInt(value) || 1;
    return (
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Number of cards to draw (1–52)</label>
        <div className="flex items-center gap-3">
          <Input
            type="number" min={1} max={52}
            value={value}
            onChange={e => onChange(String(Math.min(52, Math.max(1, parseInt(e.target.value) || 1))))}
            className="w-24 font-mono"
          />
          <input
            type="range" min={1} max={52} value={count}
            onChange={e => onChange(e.target.value)}
            className="flex-1 accent-primary"
          />
          <span className="text-sm font-semibold w-6 text-right">{count}</span>
        </div>
        <div className="flex gap-1 pt-0.5">
          {[1, 3, 5, 10, 13, 26, 52].map(n => (
            <button key={n} onClick={() => onChange(String(n))}
              className={`px-2 py-0.5 rounded text-[10px] border transition-colors font-mono ${value === String(n) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (apiType === 'dogs') {
    return (
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Select breed ({DOG_BREEDS.length - 1} breeds available)</label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a breed…" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {DOG_BREEDS.map(b => (
              <SelectItem key={b} value={b}>{formatBreedLabel(b)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return null;
}