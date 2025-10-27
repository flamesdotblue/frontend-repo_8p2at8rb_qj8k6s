import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import RoleSwitcher from './components/RoleSwitcher';
import DashboardOverview from './components/DashboardOverview';
import OperationsHub from './components/OperationsHub';
import AuthPanel from './components/AuthPanel';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('Manager');

  useEffect(() => {
    const saved = localStorage.getItem('hotel.frontdesk.user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.role) {
          setUser(u);
          setRole(u.role);
        }
      } catch {}
    }
  }, []);

  const handleAuthenticated = useCallback((u) => {
    setUser(u);
    setRole(u.role);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('hotel.frontdesk.user');
    setUser(null);
  }, []);

  const canSwitchRoles = useMemo(() => user?.role === 'Admin', [user]);

  if (!user) {
    return <AuthPanel onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} onLogout={handleLogout} />
      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h2>
            <p className="text-sm text-slate-500">Manage rooms, guests, restaurant orders and billing in one place.</p>
          </div>
          {canSwitchRoles ? (
            <RoleSwitcher role={role} onChange={setRole} />
          ) : (
            <div className="text-sm text-slate-500">Role: <span className="font-medium">{role}</span></div>
          )}
        </div>

        <DashboardOverview role={role} />
        <OperationsHub role={role} />

        <footer className="pt-6 text-center text-xs text-slate-500">
          Signed in as {user.email}. This demo uses local storage for access; connect backend auth to enforce roles server-side.
        </footer>
      </main>
    </div>
  );
}
