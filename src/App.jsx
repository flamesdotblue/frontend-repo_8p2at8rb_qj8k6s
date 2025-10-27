import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import AuthPanel from './components/AuthPanel';
import DashboardOverview from './components/DashboardOverview';
import OperationsHub from './components/OperationsHub';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('home');

  useEffect(() => {
    const raw = localStorage.getItem('hotel.frontdesk.user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const role = useMemo(() => user?.role || 'Viewer', [user]);

  const handleLogout = () => {
    localStorage.removeItem('hotel.frontdesk.user');
    setUser(null);
  };

  if (!user) {
    return <AuthPanel onAuthenticated={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header user={user} onLogout={handleLogout} onNavigate={setActiveView} />

      <main>
        <DashboardOverview role={role} />
        <OperationsHub role={role} />
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-slate-400 text-sm">
        <p>
          Signed in as <span className="text-white font-medium">{user.name}</span> · {user.email} · Role: {user.role}
        </p>
      </footer>
    </div>
  );
}
