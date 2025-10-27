import { useState } from 'react';

const ROLES = ["Admin", "Manager", "Frontdesk", "Restaurant Cashier"];

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES[2]);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill all required fields.");
      return;
    }

    // Demo-only auth: persist in localStorage
    const user = {
      id: crypto.randomUUID(),
      name: mode === "signup" ? name : email.split("@")[0],
      email,
      role: mode === "signup" ? role : role,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("hotel.frontdesk.user", JSON.stringify(user));
      onAuthenticated?.(user);
    } catch (err) {
      setError("Unable to save session. Please check storage permissions.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-semibold tracking-tight">Hotel Frontdesk</h1>
          <p className="text-slate-300 mt-1">{mode === 'login' ? 'Welcome back' : 'Create your access'}</p>

          <div className="mt-6 flex rounded-lg overflow-hidden text-sm">
            <button
              className={`flex-1 py-2 ${mode === 'login' ? 'bg-white/20' : 'bg-white/5'} transition`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 ${mode === 'signup' ? 'bg-white/20' : 'bg-white/5'} transition`}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400"
                placeholder="jane@hotel.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-slate-800">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg py-2.5 font-medium"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>

            <p className="text-xs text-slate-400 mt-2 text-center">
              Demo authentication only. No passwords are transmitted.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
