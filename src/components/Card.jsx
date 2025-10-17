export default function Card({ title, children, onRemove, editing }) {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow p-3 flex flex-col border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-700 truncate">{title}</div>
        {editing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
            className="rounded-lg px-2 py-1 text-xs border border-slate-300 hover:bg-slate-50"
            aria-label="Remove widget"
            title="Remove widget"
          >
            ✕
          </button>
        )}
      </div>
      <div className="text-slate-600 text-xs leading-relaxed flex-1 overflow-auto">{children}</div>
    </div>
  );
}
