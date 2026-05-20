import { useState, useRef, useCallback, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Zap, FlaskConical } from 'lucide-react';
import ApiCard from '../components/ApiCard';
import ApiSpecificInput from '../components/ApiSpecificInput';
import RequestConfig from '../components/RequestConfig';
import ResponsePanel from '../components/ResponsePanel';
import RequestHistory, { useHistory, usePresets } from '../components/RequestHistory';
import { MOCK_DATA } from '../lib/mockData';
import { toast } from 'sonner';

const API_CONFIG = {
  pokemon: {
    name: 'PokéAPI',
    icon: '⚡',
    description: 'Fetch Pokémon data by name or ID',
    buildUrl: (v) => `https://pokeapi.co/api/v2/pokemon/${v}`,
  },
  cards: {
    name: 'Deck of Cards',
    icon: '🃏',
    description: 'Draw cards from a shuffled deck',
    buildUrl: (v) => `https://deckofcardsapi.com/api/deck/new/draw/?count=${v}`,
  },
  dogs: {
    name: 'Dog CEO',
    icon: '🐕',
    description: 'Random dog images by breed',
    buildUrl: (v) => v === 'random' ? 'https://dog.ceo/api/breeds/image/random' : `https://dog.ceo/api/breed/${v}/images/random`,
  },
};

export default function Home() {
  const [activeApi, setActiveApi] = useState('pokemon');
  const [selectedOption, setSelectedOption] = useState('');
  const [method, setMethod] = useState('GET');
  const [queryParams, setQueryParams] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({});
  const [meta, setMeta] = useState({});
  const [mockMode, setMockMode] = useState(false);
  const [postBody, setPostBody] = useState('{\n  "key": "value"\n}');
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);
  const { history, addEntry, clearHistory } = useHistory();
  const { presets, savePreset, deletePreset } = usePresets();

  const buildUrl = useCallback(() => {
    const config = API_CONFIG[activeApi];
    let url = config.buildUrl(selectedOption);
    const extraParams = queryParams.filter(p => p.key && p.value);
    if (extraParams.length) {
      const sep = url.includes('?') ? '&' : '?';
      url += sep + extraParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
    }
    return url;
  }, [activeApi, selectedOption, queryParams]);

  const fetchData = useCallback(async () => {
    if (!selectedOption) return;
    const currentId = ++requestIdRef.current;
    setStatus(s => ({ ...s, [activeApi]: 'loading' }));
    setResult(null);

    if (mockMode) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      if (currentId !== requestIdRef.current) return;
      const mockResult = MOCK_DATA[activeApi]?.[selectedOption] || { mock: true, message: 'No mock available' };
      const size = (JSON.stringify(mockResult).length / 1024).toFixed(2);
      setResult(mockResult);
      setStatus(s => ({ ...s, [activeApi]: 'success' }));
      setMeta(m => ({ ...m, [activeApi]: { latency: Math.round(600 + Math.random() * 400), size, statusCode: 200 } }));
      addEntry({ api: activeApi, option: selectedOption, method, url: buildUrl(), queryParams, headers });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const start = performance.now();
    try {
      const fetchHeaders = Object.fromEntries(headers.filter(h => h.key && h.value).map(h => [h.key, h.value]));
      const body = ['POST', 'PUT'].includes(method) ? postBody : undefined;
      const res = await fetch(buildUrl(), { method, signal: controller.signal, headers: fetchHeaders, body });
      if (currentId !== requestIdRef.current) return;
      const latency = Math.round(performance.now() - start);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      const size = (new Blob([text]).size / 1024).toFixed(2);
      setResult(data);
      setStatus(s => ({ ...s, [activeApi]: res.ok ? 'success' : 'error' }));
      setMeta(m => ({ ...m, [activeApi]: { latency, size, statusCode: res.status } }));
      addEntry({ api: activeApi, option: selectedOption, method, url: buildUrl(), queryParams, headers });
    } catch (err) {
      if (currentId !== requestIdRef.current) return;
      if (err.name === 'AbortError') {
        setStatus(s => ({ ...s, [activeApi]: null }));
        toast.info('Request aborted');
      } else {
        setStatus(s => ({ ...s, [activeApi]: 'error' }));
        setResult({ error: err.message });
      }
    }
  }, [activeApi, selectedOption, method, mockMode, queryParams, headers, buildUrl]);

  const handleAbort = () => { abortRef.current?.abort(); };

  const handleLoad = (entry) => {
    if (entry.api) setActiveApi(entry.api);
    if (entry.option) setSelectedOption(entry.option);
    if (entry.method) setMethod(entry.method);
    if (entry.queryParams) setQueryParams(entry.queryParams);
    if (entry.headers) setHeaders(entry.headers);
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); fetchData(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fetchData]);

  const config = API_CONFIG[activeApi];
  const currentStatus = status[activeApi];
  const currentMeta = meta[activeApi];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">API Explorer</h1>
            </div>
            <p className="text-muted-foreground text-sm ml-10">Fetch live data with real-time response inspection · <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">⌘↵</kbd> to send</p>
          </div>
          <button
            onClick={() => setMockMode(m => !m)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${mockMode ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-muted border-border text-muted-foreground hover:bg-accent'}`}>
            <FlaskConical className="h-4 w-4" />
            {mockMode ? 'Mock Mode ON' : 'Mock Mode OFF'}
          </button>
        </div>

        {/* API Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {Object.entries(API_CONFIG).map(([key, api]) => (
            <ApiCard key={key} name={api.name} description={api.description} icon={api.icon}
              status={status[key]} latency={meta[key]?.latency} active={activeApi === key}
              onClick={() => { setActiveApi(key); setSelectedOption(''); setResult(null); }} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Endpoint</label>
              <ApiSpecificInput apiType={activeApi} value={selectedOption} onChange={setSelectedOption} />
            </div>

            <RequestConfig method={method} setMethod={setMethod} queryParams={queryParams} setQueryParams={setQueryParams} headers={headers} setHeaders={setHeaders} postBody={postBody} setPostBody={setPostBody} />

            {/* URL preview */}
            {selectedOption && (
              <div className="px-3 py-2 rounded-lg bg-muted/50 border text-[11px] font-mono text-muted-foreground break-all">
                {method} {buildUrl()}
              </div>
            )}

            <Button onClick={fetchData} disabled={!selectedOption || currentStatus === 'loading'} className="w-full gap-2">
              {currentStatus === 'loading' ? <Zap className="h-4 w-4 animate-pulse" /> : <Zap className="h-4 w-4" />}
              {currentStatus === 'loading' ? 'Fetching…' : 'Send Request'}
            </Button>

            <RequestHistory
              history={history} clearHistory={clearHistory}
              presets={presets} savePreset={savePreset} deletePreset={deletePreset}
              onLoad={handleLoad}
              currentRequest={{ api: activeApi, option: selectedOption, method, queryParams, headers }}
            />
          </div>

          {/* Right: Response */}
          <div className="lg:col-span-2">
            <ResponsePanel result={result} status={currentStatus} meta={currentMeta} activeApi={activeApi} onAbort={handleAbort} mockMode={mockMode} />
          </div>
        </div>
      </div>
    </div>
  );
}