import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ApiCard({ name, description, icon, status, latency, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md w-full ${active ? 'border-primary bg-accent shadow-md' : 'border-border bg-card hover:border-primary/30'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {status === 'success' && <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />{latency}ms</Badge>}
        {status === 'error' && <Badge variant="destructive" className="text-[10px]"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>}
        {status === 'loading' && <Badge variant="secondary" className="text-[10px]"><Clock className="h-3 w-3 mr-1 animate-spin" />Loading</Badge>}
      </div>
      <h3 className="font-semibold text-sm">{name}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  );
}