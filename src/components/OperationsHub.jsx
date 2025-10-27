import { useMemo, useState } from 'react';
import { CheckSquare, Soup, CreditCard, FileText, Plus, Trash2 } from 'lucide-react';

const ROOM_TYPES = [
  { type: 'Deluxe', rate: 3200 },
  { type: 'Suite', rate: 5200 },
  { type: 'Standard', rate: 2200 },
];

const MENU = [
  { id: 'm1', name: 'Masala Dosa', price: 180 },
  { id: 'm2', name: 'Paneer Tikka', price: 280 },
  { id: 'm3', name: 'Veg Biryani', price: 320 },
  { id: 'm4', name: 'Iced Tea', price: 120 },
];

export default function OperationsHub({ role }) {
  const [tab, setTab] = useState('checkin');
  const [checkins, setCheckins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);

  const canEdit = role === 'Admin' || role === 'Manager' || role === 'Frontdesk';
  const canBilling = role === 'Admin' || role === 'Manager';
  const canRestaurant = role === 'Admin' || role === 'Restaurant Cashier';

  return (
    <section className="max-w-7xl mx-auto px-6 mt-6 mb-10">
      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="flex overflow-x-auto">
          <TabButton active={tab==='checkin'} onClick={() => setTab('checkin')} icon={<CheckSquare size={16} />} label="Check-in" />
          <TabButton active={tab==='orders'} onClick={() => setTab('orders')} icon={<Soup size={16} />} label="Restaurant" />
          <TabButton active={tab==='checkout'} onClick={() => setTab('checkout')} icon={<CreditCard size={16} />} label="Check-out" />
          <TabButton active={tab==='bills'} onClick={() => setTab('bills')} icon={<FileText size={16} />} label="Bills" />
        </div>
        <div className="p-4">
          {tab === 'checkin' && (
            <CheckIn canEdit={canEdit} onCreate={(ci) => setCheckins((p) => [ci, ...p])} />
          )}
          {tab === 'orders' && (
            <Orders canRestaurant={canRestaurant} checkins={checkins} onCreate={(o) => setOrders((p) => [o, ...p])} />
          )}
          {tab === 'checkout' && (
            <Checkout canBilling={canBilling} checkins={checkins} orders={orders} onBill={(b) => setBills((p) => [b, ...p])} />
          )}
          {tab === 'bills' && (
            <Bills bills={bills} onDelete={(id) => setBills((p) => p.filter(b => b.id !== id))} />
          )}
        </div>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${active ? 'border-blue-400 text-white bg-white/10' : 'border-transparent text-slate-300 hover:text-white'}`}
    >
      {icon} {label}
    </button>
  );
}

function CheckIn({ canEdit, onCreate }) {
  const [guest, setGuest] = useState("");
  const [roomType, setRoomType] = useState(ROOM_TYPES[0].type);
  const [nights, setNights] = useState(1);

  const rate = useMemo(() => ROOM_TYPES.find(r => r.type === roomType)?.rate || 0, [roomType]);
  const total = rate * nights;

  const handleCreate = () => {
    if (!canEdit) return;
    if (!guest) return;
    const ci = { id: crypto.randomUUID(), guest, roomType, nights, rate, total, createdAt: new Date().toISOString() };
    onCreate(ci);
    setGuest("");
    setRoomType(ROOM_TYPES[0].type);
    setNights(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-3">
        <Field label="Guest name">
          <input value={guest} onChange={(e)=>setGuest(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400" placeholder="Jane Doe" />
        </Field>
        <Field label="Room type">
          <select value={roomType} onChange={(e)=>setRoomType(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400">
            {ROOM_TYPES.map(r => <option key={r.type} value={r.type} className="bg-slate-800">{r.type} — ₹{r.rate}</option>)}
          </select>
        </Field>
        <Field label="Nights">
          <input type="number" min={1} value={nights} onChange={(e)=>setNights(parseInt(e.target.value||'1'))} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400" />
        </Field>
        <div className="flex items-center justify-between text-white/90">
          <span>Est. total</span>
          <span className="font-semibold">₹ {total.toLocaleString()}</span>
        </div>
        <button disabled={!canEdit} onClick={handleCreate} className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition ${canEdit ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white/10 text-slate-400 cursor-not-allowed'}`}>
          <Plus size={16}/> Create check-in
        </button>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-white font-medium mb-2">Recent check-ins</h4>
        <EmptyState showIcon={false} text="New check-ins will appear here" />
      </div>
    </div>
  );
}

function Orders({ canRestaurant, checkins, onCreate }) {
  const [item, setItem] = useState(MENU[0].id);
  const [qty, setQty] = useState(1);
  const [forGuest, setForGuest] = useState('');

  const selected = useMemo(() => MENU.find(m => m.id === item), [item]);
  const total = (selected?.price || 0) * qty;

  const handleAdd = () => {
    if (!canRestaurant) return;
    const ord = { id: crypto.randomUUID(), item: selected.name, qty, price: selected.price, total, forGuest, createdAt: new Date().toISOString() };
    onCreate(ord);
    setQty(1); setForGuest(''); setItem(MENU[0].id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-3">
        <Field label="Menu item">
          <select value={item} onChange={(e)=>setItem(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400">
            {MENU.map(m => <option key={m.id} value={m.id} className="bg-slate-800">{m.name} — ₹{m.price}</option>)}
          </select>
        </Field>
        <Field label="Quantity">
          <input type="number" min={1} value={qty} onChange={(e)=>setQty(parseInt(e.target.value||'1'))} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400" />
        </Field>
        <Field label="For guest (optional)">
          <input value={forGuest} onChange={(e)=>setForGuest(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400" placeholder="Room/Name" />
        </Field>
        <div className="flex items-center justify-between text-white/90">
          <span>Line total</span>
          <span className="font-semibold">₹ {total.toLocaleString()}</span>
        </div>
        <button disabled={!canRestaurant} onClick={handleAdd} className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition ${canRestaurant ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white/10 text-slate-400 cursor-not-allowed'}`}>
          <Plus size={16}/> Add order
        </button>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-white font-medium mb-2">Recent orders</h4>
        <EmptyState showIcon={false} text="Orders will appear here" />
      </div>
    </div>
  );
}

function Checkout({ canBilling, checkins, orders, onBill }) {
  const [selectedGuest, setSelectedGuest] = useState('');

  const guestCheckin = useMemo(() => checkins.find(c => c.guest === selectedGuest), [checkins, selectedGuest]);
  const guestOrders = useMemo(() => orders.filter(o => o.forGuest === selectedGuest), [orders, selectedGuest]);

  const roomTotal = guestCheckin ? guestCheckin.total : 0;
  const orderTotal = guestOrders.reduce((sum, o) => sum + o.total, 0);
  const grand = roomTotal + orderTotal;

  const handleBill = () => {
    if (!canBilling || !guestCheckin) return;
    const bill = {
      id: crypto.randomUUID(),
      guest: selectedGuest,
      items: [
        { label: `${guestCheckin.roomType} x ${guestCheckin.nights} nights`, amount: roomTotal },
        ...guestOrders.map(o => ({ label: `${o.item} x ${o.qty}`, amount: o.total })),
      ],
      total: grand,
      paid: false,
      createdAt: new Date().toISOString(),
    };
    onBill(bill);
    setSelectedGuest('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-3">
        <Field label="Select guest">
          <select value={selectedGuest} onChange={(e)=>setSelectedGuest(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400">
            <option value="" className="bg-slate-800">Choose...</option>
            {checkins.map(c => <option key={c.id} value={c.guest} className="bg-slate-800">{c.guest}</option>)}
          </select>
        </Field>
        <div className="flex items-center justify-between text-white/90">
          <span>Grand total</span>
          <span className="font-semibold">₹ {grand.toLocaleString()}</span>
        </div>
        <button disabled={!canBilling || !guestCheckin} onClick={handleBill} className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition ${canBilling && guestCheckin ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-white/10 text-slate-400 cursor-not-allowed'}`}>
          Create bill
        </button>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-white font-medium mb-2">Bill preview</h4>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          {guestCheckin ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white/90">
                <span className="font-medium">{selectedGuest}</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10" />
              <ul className="space-y-1 text-slate-200">
                <li className="flex items-center justify-between"><span>{guestCheckin.roomType} x {guestCheckin.nights} nights</span><span>₹ {roomTotal.toLocaleString()}</span></li>
                {guestOrders.map(o => (
                  <li key={o.id} className="flex items-center justify-between"><span>{o.item} x {o.qty}</span><span>₹ {o.total.toLocaleString()}</span></li>
                ))}
              </ul>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between text-white font-semibold">
                <span>Total</span>
                <span>₹ {grand.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <EmptyState showIcon={false} text="Choose a guest to preview the bill" />
          )}
        </div>
      </div>
    </div>
  );
}

function Bills({ bills, onDelete }) {
  return (
    <div>
      <h4 className="text-white font-medium mb-2">Bills</h4>
      {bills.length === 0 ? (
        <EmptyState showIcon={false} text="No bills yet" />
      ) : (
        <div className="space-y-3">
          {bills.map(b => (
            <div key={b.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{b.guest}</div>
                <div className="text-slate-300 text-sm">{b.items.length} items • ₹ {b.total.toLocaleString()}</div>
              </div>
              <button onClick={() => onDelete(b.id)} className="px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border border-rose-400/30 transition flex items-center gap-2">
                <Trash2 size={16} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-slate-300 text-sm mb-1">{label}</div>
      {children}
    </label>
  );
}

function EmptyState({ showIcon = true, text = 'Nothing here yet' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
      {showIcon && <FileText className="mx-auto mb-2" size={18} />}
      <p className="text-sm">{text}</p>
    </div>
  );
}
