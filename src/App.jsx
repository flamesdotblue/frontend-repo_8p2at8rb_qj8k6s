import { useState } from 'react';
import Header from './components/Header';
import RoleSwitcher from './components/RoleSwitcher';
import DashboardOverview from './components/DashboardOverview';
import OperationsHub from './components/OperationsHub';

export default function App() {
  const [role, setRole] = useState('Manager');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="text-sm text-slate-500">Manage rooms, guests, restaurant orders and billing in one place.</p>
          </div>
          <RoleSwitcher role={role} onChange={setRole} />
        </div>

        <DashboardOverview role={role} />
        <OperationsHub role={role} />

        <footer className="pt-6 text-center text-xs text-slate-500">
          Built for speed in a sandbox demo. Connect to your backend to enable persistence, auth and printing to thermal/A4.
        </footer>
      </main>
    </div>
  );
}
