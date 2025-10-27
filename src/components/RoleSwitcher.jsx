import { Building2, User, Utensils } from 'lucide-react';

export default function RoleSwitcher({ role, onChange }) {
  const roles = [
    { key: 'Admin', label: 'Admin', icon: Building2 },
    { key: 'Manager', label: 'Manager', icon: User },
    { key: 'Cashier', label: 'Restaurant Cashier', icon: Utensils },
  ];

  return (
    <div className="w-full">
      <div className="inline-flex rounded-lg border bg-white p-1 shadow-sm">
        {roles.map(({ key, label, icon: Icon }) => {
          const active = role === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition ${
                active ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
              aria-pressed={active}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
