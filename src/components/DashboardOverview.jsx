import { Bed, Receipt, IndianRupee, CreditCard } from 'lucide-react';

function StatCard({ icon: Icon, title, value, subtitle, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function SimpleBar({ labelLeft, labelRight, leftValue, rightValue, leftColor, rightColor }) {
  const total = leftValue + rightValue || 1;
  const leftPct = Math.round((leftValue / total) * 100);
  const rightPct = 100 - leftPct;
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{labelLeft} vs {labelRight}</p>
        <p className="text-xs text-slate-500">{leftPct}% / {rightPct}%</p>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${leftColor}`} style={{ width: `${leftPct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${leftColor}`} />{labelLeft}: {leftValue}</span>
        <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${rightColor}`} />{labelRight}: {rightValue}</span>
      </div>
    </div>
  );
}

export default function DashboardOverview({ role }) {
  // demo values; in a live system these would come from the backend
  const demo = {
    occupancy: 78,
    totalRooms: 120,
    revenueToday: 68450,
    paid: 52,
    unpaid: 18,
    foodRevenue: 24500,
    stayRevenue: 43950,
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Bed} title="Occupancy" value={`${demo.occupancy}%`} subtitle={`${demo.totalRooms - Math.round((demo.occupancy/100)*demo.totalRooms)} rooms available`} color="indigo" />
        <StatCard icon={IndianRupee} title="Revenue Today" value={`₹${demo.revenueToday.toLocaleString()}`} subtitle="All sources" color="emerald" />
        <StatCard icon={Receipt} title="Bills" value={`${demo.paid} Paid / ${demo.unpaid} Unpaid`} subtitle="Across departments" color="amber" />
        <StatCard icon={CreditCard} title="Avg Ticket" value={`₹${Math.round(demo.revenueToday / (demo.paid + demo.unpaid)).toLocaleString()}`} subtitle="Per bill" color="rose" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SimpleBar labelLeft="Stay" labelRight="Food" leftValue={demo.stayRevenue} rightValue={demo.foodRevenue} leftColor="bg-indigo-500" rightColor="bg-emerald-500" />
        <SimpleBar labelLeft="Paid" labelRight="Unpaid" leftValue={demo.paid} rightValue={demo.unpaid} leftColor="bg-emerald-500" rightColor="bg-rose-500" />
      </div>

      <p className="text-xs text-slate-500">Role: {role}</p>
    </section>
  );
}
