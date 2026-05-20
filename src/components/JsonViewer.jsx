import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function JsonNode({ keyName, value, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const entries = isObject ? Object.entries(value) : [];

  if (!isObject) {
    const color = typeof value === 'string' ? 'text-emerald-600' : typeof value === 'number' ? 'text-amber-600' : typeof value === 'boolean' ? 'text-violet-600' : 'text-muted-foreground';
    return (
      <div className="flex gap-1 py-0.5" style={{ paddingLeft: depth * 20 }}>
        {keyName !== null && <span className="text-sky-700 font-medium">"{keyName}":</span>}
        <span className={color}>{typeof value === 'string' ? `"${value}"` : String(value)}</span>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 py-0.5 hover:bg-accent/50 rounded w-full text-left" style={{ paddingLeft: depth * 20 }}>
        {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        {keyName !== null && <span className="text-sky-700 font-medium">"{keyName}":</span>}
        <span className="text-muted-foreground text-xs">{isArray ? `Array(${entries.length})` : `Object{${entries.length}}`}</span>
      </button>
      {expanded && entries.map(([k, v]) => <JsonNode key={k} keyName={isArray ? null : k} value={v} depth={depth + 1} />)}
    </div>
  );
}

export default function JsonViewer({ data }) {
  return (
    <div className="font-mono text-xs bg-muted/30 border rounded-lg p-4 overflow-auto max-h-[500px]">
      <JsonNode keyName={null} value={data} />
    </div>
  );
}