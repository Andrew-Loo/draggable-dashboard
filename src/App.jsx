import React, { useEffect, useRef, useState } from "react";
import GridLayout from "react-grid-layout"; // non-responsive default export
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import Card from "./components/Card";
import ChartWidget from "./components/ChartWidget";
import TableWidget from "./components/TableWidget";
import KPIWidget from "./components/KPIWidget";

// ---------- Config ----------
const STORAGE_KEY = "demo_dashboard_layout_v1";
const DROPPING_ID = "__dropping__";
const stripGhost = (layout) => layout.filter((it) => it.i !== DROPPING_ID);

const DEFAULT_STATE = {
  layout: [
    { i: "kpi-1", x: 0, y: 0, w: 3, h: 4 },
    { i: "chart-1", x: 3, y: 0, w: 6, h: 8 },
    { i: "table-1", x: 9, y: 0, w: 3, h: 8 },
  ],
  items: {
    "kpi-1": { type: "KPI", title: "Open Tickets" },
    "chart-1": { type: "Chart", title: "Monthly Revenue" },
    "table-1": { type: "Table", title: "Recent Jobs" },
  },
};

// ---------- Storage helpers ----------
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.layout) || typeof parsed.items !== "object") {
      return DEFAULT_STATE;
    }
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
};
const saveState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

let uid = 0;
const genId = (prefix) => `${prefix}-${Date.now()}-${uid++}`;

// ---------- AutoWidth wrapper to feed width to GridLayout ----------
function AutoWidthGrid({ children, ...gridProps }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setWidth(Math.max(1, Math.floor(cr.width)));
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width || 1);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {width > 0 && (
        <GridLayout width={width} {...gridProps}>
          {children}
        </GridLayout>
      )}
    </div>
  );
}

function renderWidget(type) {
  switch (type) {
    case "Chart":
      return <ChartWidget />;
    case "Table":
      return <TableWidget />;
    case "KPI":
      return <KPIWidget />;
    default:
      return <div>Unknown widget type: {type}</div>;
  }
}

// ---------- Main ----------
export default function App() {
  const [saved, setSaved] = useState(() => loadState());
  const [draft, setDraft] = useState(saved); // { layout, items }
  const [editing, setEditing] = useState(false);
  const dragTypeRef = useRef(null);

  useEffect(() => {
    if (editing) setDraft(JSON.parse(JSON.stringify(saved)));
  }, [editing]);

  const onLayoutCommit = (nextLayout) => setDraft((d) => ({ ...d, layout: stripGhost(nextLayout) }));

  const removeItem = (id) => {
    setDraft((d) => ({
      layout: d.layout.filter((x) => x.i !== id),
      items: Object.fromEntries(Object.entries(d.items).filter(([k]) => k !== id)),
    }));
  };

  const handleSave = () => {
    const cleaned = { ...draft, layout: stripGhost(draft.layout) };
    setSaved(cleaned);
    saveState(cleaned);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...saved, layout: stripGhost(saved.layout) });
    setEditing(false);
  };

  const addItemAt = (type, x, y, w = 3, h = 4) => {
    const id = genId(type.toLowerCase());
    const newItem = { i: id, x, y, w, h };
    setDraft((d) => ({
      layout: [...d.layout, newItem],
      items: { ...d.items, [id]: { type, title: `${type} ${Object.keys(d.items).length + 1}` } },
    }));
  };

  const onDrop = (_layout, layoutItem, ev) => {
    let type = dragTypeRef.current;
    try { const dt = ev?.dataTransfer?.getData("text/plain"); if (dt) type = dt; } catch {}
    if (!type) return;

    // ensure ghost never sticks around
    setDraft((d) => ({ ...d, layout: stripGhost(d.layout) }));
    addItemAt(type, layoutItem.x, layoutItem.y, layoutItem.w, layoutItem.h);
  };

  const itemMap = draft.items;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold">Draggable Dashboard</div>
            {!editing && <span className="text-xs text-slate-500">(view mode — click Edit)</span>}
          </div>
          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
                title="Edit layout"
              >
                <span>✎</span><span className="text-sm">Edit</span>
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">Cancel</button>
                <button onClick={handleSave} className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Save</button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {editing && (
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-2xl shadow border border-slate-200 p-3">
                <div className="text-sm font-semibold mb-2">Widget Palette</div>
                <div className="text-xs text-slate-500 mb-3">Drag a widget into the grid on the right.</div>
                <div className="flex flex-wrap gap-2">
                  {["KPI", "Chart", "Table"].map((type) => (
                    <button
                      key={type}
                      draggable
                      onDragStart={(e) => {
                        dragTypeRef.current = type;
                        try { e.dataTransfer.setData("text/plain", type); } catch {}
                      }}
                      onDragEnd={() => (dragTypeRef.current = null)}
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm"
                    >
                      ➕ {type}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          <main className={`col-span-12 ${editing ? "lg:col-span-9" : "lg:col-span-12"}`}>
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-2">
              <AutoWidthGrid
                className="layout"
                rowHeight={28}
                margin={[8, 8]}
                compactType={null}
                preventCollision={false}
                cols={12}
                isDraggable={editing}
                isResizable={editing}
                isDroppable={editing}
                onDrop={onDrop}
                droppingItem={{ i: "__dropping__", w: 3, h: 4 }}
                onLayoutChange={(nextLayout) => onLayoutCommit(nextLayout)}
              >
                {draft.layout.map((g) => {
                  const isGhost = g.i === DROPPING_ID;
                  return (
                    <div key={g.i} data-grid={g} className="group">
                      {isGhost ? (
                        <div className="h-full w-full rounded-2xl border border-dashed border-slate-300
                                        flex items-center justify-center text-xs text-slate-400">
                          Dropping…
                        </div>
                      ) : (
                        <Card title={itemMap[g.i]?.title || g.i} editing={editing} onRemove={() => removeItem(g.i)}>
                          {renderWidget(itemMap[g.i]?.type)}
                        </Card>
                      )}
                    </div>
                  );
                })}
              </AutoWidthGrid>
            </div>
          </main>
        </div>

        <div className="mt-4 text-[11px] text-slate-500">
          Stored in <code>localStorage["demo_dashboard_layout_v1"]</code>. Resize/drag only in edit mode.
        </div>
      </div>
    </div>
  );
}
