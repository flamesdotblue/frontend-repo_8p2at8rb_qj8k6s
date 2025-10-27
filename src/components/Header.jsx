import { Building2, Settings, Printer, Receipt, LogOut, User } from 'lucide-react';

export default function Header({ user, onLogout, onNavigate }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-600 text-white">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Aurora Grand Hotel</h1>
              <p className="-mt-0.5 text-xs text-slate-500">Frontdesk Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 pr-2 text-sm text-slate-700 sm:flex">
              <User size={16} className="text-slate-500" /> {user?.name || 'User'}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{user?.role}</span>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50" onClick={() => onNavigate?.('print')}>
              <Printer size={16} />
              Print
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50" onClick={() => onNavigate?.('bills')}>
              <Receipt size={16} />
              Bills
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50" onClick={() => onNavigate?.('settings')}>
              <Settings size={16} />
              Settings
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
