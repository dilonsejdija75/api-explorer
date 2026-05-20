import { useState } from 'react';
import { History, Trash2, ChevronDown, ChevronUp, Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const HISTORY_KEY = 'api_explorer_history';
const PRESETS_KEY = 'api_explorer_presets';

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });

  const addEntry = (entry) => {
    setHistory(prev => {
      const next = [{ ...entry, id: Date.now(), ts: new Date().toISOString() }, ...prev].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]); };
  return { history, addEntry, clearHistory };
}

export function usePresets() {
  const [presets, setPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]'); } catch { return []; }
  });

  const savePreset = (name, request) => {
    if (presets.length >= 3) { toast.error('Max 3 presets — delete one first'); return; }
    const next = [...presets, { id: Date.now(), name, request }];
    localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
    setPresets(next);
    toast.success(`Preset "${name}" saved`);
  };

  const deletePreset = (id) => {
    const next = presets.filter(p => p.id !== id);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
    setPresets(next);
  };

  return { presets, savePreset, deletePreset };
}

export default function RequestHistory({ history, clearHistory, presets, savePreset, deletePreset, onLoad, currentRequest }) {
  const [open, setOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [savingPreset, setSavingPreset] = useState(false);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), currentRequest);
    setPresetName('');
    setSavingPreset(false);
  };

  const methodColor = (m) => m === 'GET' ? 'text-emerald-600' : m === 'POST' ? 'text-sky-600' : 'text-amber-600';

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">History &amp; Presets</span>
          {history.length > 0 && <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5">{history.length}</span>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t">
          {/* History */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Requests</span>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={clearHistory}>
                  <Trash2 className="h-3 w-3 mr-1" />Clear
                </Button>
              )}
            </div>
            {history.length === 0 ? <p className="text-xs text-muted-foreground italic">No history yet</p> : (
              <div className="space-y-1">
                {history.map(h => (
                  <button key={h.id} onClick={() => onLoad(h)} className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-accent text-xs transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-[10px] ${methodColor(h.method)}`}>{h.method}</span>
                      <span className="font-medium capitalize">{h.api}</span>
                      <span className="text-muted-foreground">· {h.option}</span>
                    </div>
                    <span className="text-muted-foreground">{new Date(h.ts).toLocaleTimeString()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Presets ({presets.length}/3)</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => setSavingPreset(s => !s)}>
                <Save className="h-3 w-3 mr-1" />Save Current
              </Button>
            </div>
            {savingPreset && (
              <div className="flex gap-2 mb-2">
                <Input className="h-7 text-xs" placeholder="Preset name…" value={presetName} onChange={e => setPresetName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSavePreset()} />
                <Button size="sm" className="h-7 text-xs" onClick={handleSavePreset}>Save</Button>
              </div>
            )}
            {presets.length === 0 ? <p className="text-xs text-muted-foreground italic">No presets saved</p> : (
              <div className="space-y-1">
                {presets.map(p => (
                  <div key={p.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-accent">
                    <FolderOpen className="h-3 w-3 text-muted-foreground shrink-0" />
                    <button className="flex-1 text-left text-xs font-medium truncate" onClick={() => onLoad(p.request)}>{p.name}</button>
                    <button onClick={() => deletePreset(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}