import { Building2, Settings, Printer, Receipt, LogOut } from 'lucide-react';

export default function Header() {
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
              <p className="text-xs text-slate-500 -mt-0.5">Frontdesk Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
              <Printer size={16} />
              Print
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
              <Receipt size={16} />
              Bills
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
              <Settings size={16} />
              Settings
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
