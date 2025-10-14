export default function KPIWidget() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border p-3 text-center">
        <div className="text-2xl font-bold">128</div>
        <div className="text-[11px] text-slate-500">Open</div>
      </div>
      <div className="rounded-xl border p-3 text-center">
        <div className="text-2xl font-bold">96%</div>
        <div className="text-[11px] text-slate-500">SLA</div>
      </div>
    </div>
  );
}
