import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

function ParamRow({ param, onChange, onRemove }) {
  return (
    <div className="flex gap-2">
      <Input className="h-7 text-xs" placeholder="key" value={param.key} onChange={e => onChange({ ...param, key: e.target.value })} />
      <Input className="h-7 text-xs" placeholder="value" value={param.value} onChange={e => onChange({ ...param, value: e.target.value })} />
      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove}><Trash2 className="h-3 w-3" /></Button>
    </div>
  );
}

export default function RequestConfig({ method, setMethod, queryParams, setQueryParams, headers, setHeaders, postBody, setPostBody }) {
  const addParam = (setter) => setter(p => [...p, { id: Date.now(), key: '', value: '' }]);
  const update = (setter, id, val) => setter(p => p.map(x => x.id === id ? val : x));
  const remove = (setter, id) => setter(p => p.filter(x => x.id !== id));
  const bodyIsValid = ['POST', 'PUT'].includes(method)
    ? (() => {
        if (!postBody.trim()) return false;
        try { JSON.parse(postBody); return true; } catch { return false; }
      })()
    : true;

  return (
    <div className="border rounded-xl p-4 space-y-4 bg-card">
      {/* Method */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-16">Method</span>
        <div className="flex gap-1.5">
          {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${method === m
                ? m === 'GET' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : m === 'POST' ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-300' : m === 'PUT' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' : 'bg-red-100 text-red-700 ring-1 ring-red-300'
                : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Query Params */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Query Params</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground" onClick={() => setQueryParams([])} disabled={queryParams.length === 0}>
              Clear
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground" onClick={() => addParam(setQueryParams)}>
              <Plus className="h-3 w-3" />Add
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          {queryParams.length === 0 && <p className="text-xs text-muted-foreground italic">No query params</p>}
          {queryParams.map(p => <ParamRow key={p.id} param={p} onChange={v => update(setQueryParams, p.id, v)} onRemove={() => remove(setQueryParams, p.id)} />)}
        </div>
      </div>

      {/* Headers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Headers</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground" onClick={() => setHeaders([])} disabled={headers.length === 0}>
              Clear
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground" onClick={() => addParam(setHeaders)}>
              <Plus className="h-3 w-3" />Add
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          {headers.length === 0 && <p className="text-xs text-muted-foreground italic">No custom headers</p>}
          {headers.map(h => <ParamRow key={h.id} param={h} onChange={v => update(setHeaders, h.id, v)} onRemove={() => remove(setHeaders, h.id)} />)}
        </div>
      </div>

      {/* Request Body (POST/PUT) */}
      {(method === 'POST' || method === 'PUT') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Request Body</span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">JSON</span>
          </div>
          <textarea
            value={postBody}
            onChange={e => setPostBody(e.target.value)}
            rows={5}
            spellCheck={false}
            className={`w-full font-mono text-xs p-3 rounded-lg border bg-muted/30 resize-y focus:outline-none focus:ring-2 focus:ring-ring ${!bodyIsValid ? 'border-red-300 bg-red-50' : ''}`}
            placeholder='{"key": "value"}'
          />
          {!bodyIsValid && (
            <p className="mt-2 text-xs text-red-600">Invalid JSON body. Please correct the syntax before sending.</p>
          )}
        </div>
      )}
    </div>
  );
}