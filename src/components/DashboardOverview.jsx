import { useMemo } from 'react';
import { Users, BedDouble, DollarSign, FileText } from 'lucide-react';

export default function DashboardOverview({ role }) {
  const stats = useMemo(() => ({
    occupancy: 78,
    revenue: 48250,
    bills: 36,
    avgTicket: 1340,
  }), []);

  const bar = (value, color) => (
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={<BedDouble size={18} />} label="Occupancy" value={`${stats.occupancy}%`} footer={bar(stats.occupancy, 'bg-blue-400')} />
        <Card icon={<DollarSign size={18} />} label="Revenue" value={`₹ ${stats.revenue.toLocaleString()}`} footer={bar(62, 'bg-emerald-400')} />
        <Card icon={<FileText size={18} />} label="Open Bills" value={stats.bills} footer={bar(44, 'bg-amber-400')} />
        <Card icon={<Users size={18} />} label="Avg. Ticket" value={`₹ ${stats.avgTicket.toLocaleString()}`} footer={bar(71, 'bg-fuchsia-400')} />
      </div>

      <div className="mt-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Quick glance</h3>
            <span className="text-slate-300 text-sm">Role: {role}</span>
          </div>
          <p className="text-slate-300 text-sm mt-2">Operations at a glance. Values are for demo only.</p>
        </div>
      </div>
    </section>
  );
}

function Card({ icon, label, value, footer }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white">
            {icon}
          </div>
          <span className="text-sm">{label}</span>
        </div>
        <div className="text-white font-semibold">{value}</div>
      </div>
      <div className="mt-3">{footer}</div>
    </div>
  );
}
