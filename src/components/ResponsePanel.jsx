import { useState } from 'react';
import { Copy, Download, X, Code2, LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import JsonViewer from './JsonViewer';
import ResponseCardView from './ResponseCardView';
import ResponseTableView from './ResponseTableView';
import LoadingSkeleton from './LoadingSkeleton';
import { toast } from 'sonner';

function StatusBadge({ code }) {
  if (!code) return null;
  const color = code < 300 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : code < 400 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200';
  return <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${color}`}>{code}</span>;
}

export default function ResponsePanel({ result, status, meta, activeApi, onAbort, mockMode }) {
  const [view, setView] = useState('card');

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success('Copied to clipboard');
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `response-${activeApi}-${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-muted/40 border-b flex-wrap gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Response</span>
          {mockMode && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 bg-amber-50">Mock</Badge>}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {meta?.statusCode && <StatusBadge code={meta.statusCode} />}
          {meta?.latency && <span className="text-xs text-muted-foreground font-mono">{meta.latency}ms</span>}
          {meta?.size && <span className="text-xs text-muted-foreground font-mono">{meta.size}KB · {Math.round(meta.size * 1024)}B</span>}
          {/* View toggle */}
          {result && status === 'success' && (
            <div className="flex rounded-md border overflow-hidden">
              {[['raw', <Code2 className="h-3 w-3" />], ['card', <LayoutGrid className="h-3 w-3" />], ['table', <Table className="h-3 w-3" />]].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-2 py-1 text-xs flex items-center gap-1 transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-accent'}`}>
                  {icon}<span className="hidden sm:inline capitalize">{v}</span>
                </button>
              ))}
            </div>
          )}
          {status === 'loading' && (
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-red-600 border-red-200" onClick={onAbort}>
              <X className="h-3 w-3" />Abort
            </Button>
          )}
          {result && (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copy}><Copy className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={download}><Download className="h-3 w-3" /></Button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 min-h-[200px]">
        {status === 'loading' && <LoadingSkeleton />}

        {status === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-red-700">
              {result?.error === 'Failed to fetch' ? 'Network Error — check your connection or CORS settings' :
               result?.error?.includes('429') ? 'Rate Limit Exceeded (429) — try again in a moment' :
               result?.error?.includes('404') ? 'Not Found (404) — the resource doesn\'t exist' :
               result?.error || 'An unexpected error occurred'}
            </p>
            {result && (
              <details className="text-xs text-red-600">
                <summary className="cursor-pointer">Details</summary>
                <pre className="mt-2 font-mono">{JSON.stringify(result, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        {result && status === 'success' && view === 'raw' && <JsonViewer data={result} />}
        {result && status === 'success' && view === 'card' && <ResponseCardView data={result} apiType={activeApi} />}
        {result && status === 'success' && view === 'table' && <ResponseTableView data={result} />}

        {!result && status !== 'loading' && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Response will appear here
          </div>
        )}
      </div>
    </div>
  );
}