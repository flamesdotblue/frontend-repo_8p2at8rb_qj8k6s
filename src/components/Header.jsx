import Spline from '@splinetool/react-spline';
import { LogOut, Settings, Receipt, Home } from 'lucide-react';

export default function Header({ user, onLogout, onNavigate }) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <Spline scene="https://prod.spline.design/BJf0pDq1U9cA4dcM/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 bg-gradient-to-b from-slate-900/80 to-slate-900/40 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-4 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Home size={18} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white leading-tight">Aurora Hotel Frontdesk</h1>
                <p className="text-slate-300 text-sm -mt-0.5">Live status, operations, and billing</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('bills')}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10 transition flex items-center gap-2"
              >
                <Receipt size={16} /> Bills
              </button>
              <button
                onClick={() => onNavigate?.('settings')}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10 transition flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              <div className="h-8 w-px bg-white/10 mx-1" />
              <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white">
                <span className="font-medium">{user?.name || 'Guest'}</span>
                <span className="text-slate-300 text-sm ml-2">{user?.role || 'Viewer'}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border border-rose-400/30 transition flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
