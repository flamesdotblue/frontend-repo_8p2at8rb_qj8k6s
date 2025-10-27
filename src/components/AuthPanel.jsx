import { useState, useEffect } from 'react';
import { Hotel, Lock, Mail, User, LogIn, UserPlus } from 'lucide-react';

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hotel.frontdesk.user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user && user.email) onAuthenticated(user);
      } catch {}
    }
  }, [onAuthenticated]);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();
    const role = data.get('role')?.toString() || 'Manager';

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // This is a frontend-only demo auth. In production, call real backend endpoints.
      const user = {
        id: crypto.randomUUID(),
        name: name || 'Guest User',
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('hotel.frontdesk.user', JSON.stringify(user));
      onAuthenticated(user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-6">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Hotel size={22} />
        </div>
        <h1 className="text-2xl font-semibold">Aurora Grand Hotel</h1>
        <p className="mb-6 text-sm text-slate-500">Frontdesk Management Access</p>

        <div className="mb-4 inline-flex rounded-lg border bg-white p-1 shadow-sm">
          <button
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm ${mode==='login' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
            onClick={() => setMode('login')}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm ${mode==='signup' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
            onClick={() => setMode('signup')}
          >
            <UserPlus size={16} /> Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full rounded-xl border bg-white p-4 shadow-sm">
          {mode === 'signup' && (
            <label className="mb-3 flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Full name</span>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="name" className="w-full rounded-md border px-9 py-2" placeholder="Priya Sharma" />
              </div>
            </label>
          )}

          <label className="mb-3 flex flex-col gap-1 text-sm">
            <span className="text-slate-600">Email</span>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="email" type="email" required className="w-full rounded-md border px-9 py-2" placeholder="you@hotel.com" />
            </div>
          </label>

          <label className="mb-4 flex flex-col gap-1 text-sm">
            <span className="text-slate-600">Password</span>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="password" type="password" required className="w-full rounded-md border px-9 py-2" placeholder="••••••••" />
            </div>
          </label>

          <label className="mb-4 flex flex-col gap-1 text-sm">
            <span className="text-slate-600">Role</span>
            <select name="role" className="rounded-md border px-3 py-2">
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Restaurant Cashier</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />} {mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Demo authentication only. In production, this connects to secure backend endpoints.
          </p>
        </form>
      </div>
    </div>
  );
}
