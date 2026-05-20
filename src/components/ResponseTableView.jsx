function flattenObject(obj, prefix = '') {
  return Object.entries(obj || {}).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(acc, flattenObject(v, key));
    } else {
      acc[key] = Array.isArray(v) ? `[${v.length} items]` : String(v ?? '');
    }
    return acc;
  }, {});
}

export default function ResponseTableView({ data }) {
  const rows = Array.isArray(data) ? data : [data];
  const flat = rows.map(r => flattenObject(r));
  const allKeys = [...new Set(flat.flatMap(r => Object.keys(r)))].slice(0, 12);

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/50 border-b">
            {allKeys.map(k => (
              <th key={k} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flat.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              {allKeys.map(k => (
                <td key={k} className="px-3 py-2 max-w-[200px] truncate" title={row[k]}>{row[k] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}