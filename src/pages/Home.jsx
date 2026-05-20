import { useState, useRef, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw, Copy } from 'lucide-react';
import ApiCard from '../components/ApiCard';
import JsonViewer from '../components/JsonViewer';
import { toast } from 'sonner';

const API_CONFIG = {
  pokemon: {
    name: 'PokéAPI',
    icon: '⚡',
    description: 'Fetch Pokémon data by name or ID',
    options: [
      { label: 'Pikachu', value: 'pikachu' },
      { label: 'Charizard', value: 'charizard' },
      { label: 'Mewtwo', value: 'mewtwo' },
      { label: 'Eevee', value: 'eevee' },
      { label: 'Snorlax', value: 'snorlax' },
    ],
    buildUrl: (v) => `https://pokeapi.co/api/v2/pokemon/${v}`,
  },
  cards: {
    name: 'Deck of Cards',
    icon: '🃏',
    description: 'Draw cards from a shuffled deck',
    options: [
      { label: 'Draw 1 Card', value: '1' },
      { label: 'Draw 3 Cards', value: '3' },
      { label: 'Draw 5 Cards', value: '5' },
    ],
    buildUrl: (v) => `https://deckofcardsapi.com/api/deck/new/draw/?count=${v}`,
  },
  dogs: {
    name: 'Dog CEO',
    icon: '🐕',
    description: 'Random dog images by breed',
    options: [
      { label: 'Random Dog', value: 'random' },
      { label: 'Husky', value: 'husky' },
      { label: 'Corgi', value: 'corgi' },
      { label: 'Labrador', value: 'labrador' },
      { label: 'Poodle', value: 'poodle' },
    ],
    buildUrl: (v) => v === 'random' ? 'https://dog.ceo/api/breeds/image/random' : `https://dog.ceo/api/breed/${v}/images/random`,
  },
};

export default function Home() {
  const [activeApi, setActiveApi] = useState('pokemon');
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({});
  const [latency, setLatency] = useState({});
  const requestIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!selectedOption) return;
    const config = API_CONFIG[activeApi];
    const currentRequestId = ++requestIdRef.current;
    
    setStatus(s => ({ ...s, [activeApi]: 'loading' }));
    setResult(null);

    const start = performance.now();
    try {
      const res = await fetch(config.buildUrl(selectedOption));
      if (currentRequestId !== requestIdRef.current) return; // race condition guard
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const ms = Math.round(performance.now() - start);
      setResult(data);
      setStatus(s => ({ ...s, [activeApi]: 'success' }));
      setLatency(l => ({ ...l, [activeApi]: ms }));
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setStatus(s => ({ ...s, [activeApi]: 'error' }));
      setResult({ error: err.message });
    }
  }, [activeApi, selectedOption]);

  const config = API_CONFIG[activeApi];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">API Explorer</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-10">Fetch live data from public APIs with real-time response inspection</p>
        </div>

        {/* API Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {Object.entries(API_CONFIG).map(([key, api]) => (
            <ApiCard
              key={key}
              name={api.name}
              description={api.description}
              icon={api.icon}
              status={status[key]}
              latency={latency[key]}
              active={activeApi === key}
              onClick={() => { setActiveApi(key); setSelectedOption(''); setResult(null); }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="sm:w-64">
              <SelectValue placeholder={`Choose a ${config.name} option…`} />
            </SelectTrigger>
            <SelectContent>
              {config.options.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchData} disabled={!selectedOption || status[activeApi] === 'loading'} className="gap-2">
            {status[activeApi] === 'loading' ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Fetch
          </Button>
          {result && (
            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); toast.success('Copied to clipboard'); }}>
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* URL preview */}
        {selectedOption && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-muted/50 border text-xs font-mono text-muted-foreground truncate">
            GET {config.buildUrl(selectedOption)}
          </div>
        )}

        {/* Result */}
        {status[activeApi] === 'loading' && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Fetching from {config.name}…</span>
            </div>
          </div>
        )}

        {result && status[activeApi] !== 'loading' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Response</span>
              {latency[activeApi] && <span className="text-xs text-muted-foreground">{latency[activeApi]}ms</span>}
            </div>
            <JsonViewer data={result} />
          </div>
        )}

        {!result && !status[activeApi] && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <span className="text-4xl mb-3">{config.icon}</span>
            <p className="text-sm">Select an option and hit Fetch to explore the {config.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}