import { useEffect, useMemo, useState } from 'react';
import { Calendar, Phone, Hash, Users, CreditCard, Percent, IndianRupee, Search, Utensils, Bed, Printer, Check, X } from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

async function api(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function SectionTitle({ icon: Icon, title, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-indigo-600" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Divider() {
  return <div className="my-4 h-px w-full bg-slate-200" />;
}

export default function OperationsHub({ role }) {
  const [tab, setTab] = useState('checkin');

  const [checkins, setCheckins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ci, ord, bl] = await Promise.all([
          api('/api/checkins'),
          api('/api/orders'),
          api('/api/bills'),
        ]);
        setCheckins(ci.items || []);
        setOrders(ord.items || []);
        setBills(bl.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function refresh(section) {
    if (!section || section === 'checkins') {
      const ci = await api('/api/checkins');
      setCheckins(ci.items || []);
    }
    if (!section || section === 'orders') {
      const ord = await api('/api/orders');
      setOrders(ord.items || []);
    }
    if (!section || section === 'bills') {
      const bl = await api('/api/bills');
      setBills(bl.items || []);
    }
  }

  // Rooms catalog (demo)
  const rooms = useMemo(() => {
    const list = [];
    const types = ['Single', 'Double', 'Deluxe', 'Suite'];
    const rateMap = { Single: 2500, Double: 3200, Deluxe: 4200, Suite: 6500 };
    for (let floor = 1; floor <= 4; floor++) {
      for (let i = 1; i <= 8; i++) {
        const type = types[(i - 1) % types.length];
        list.push({ room: `${floor}0${i}`, type, rate: rateMap[type] });
      }
    }
    return list;
  }, []);

  const [roomFilter, setRoomFilter] = useState('All');

  // Derived views
  const unpaidOrdersByRoom = useMemo(() => {
    const map = new Map();
    (orders || []).filter(o => o.type === 'inhouse' && o.status === 'Unpaid').forEach(o => {
      const key = o.room;
      const list = map.get(key) || [];
      list.push(o);
      map.set(key, list);
    });
    return map;
  }, [orders]);

  const occupiedRoomsSet = useMemo(() => new Set((checkins || []).filter(c => c.status === 'Occupied').map(c => String(c.room))), [checkins]);

  async function handleCheckIn(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    payload.adults = Number(payload.adults || 1);
    payload.children = Number(payload.children || 0);
    payload.rate = Number(payload.rate || 0);
    payload.advance = Number(payload.advance || 0);
    payload.createdAt = payload.createdAt ? new Date(payload.createdAt).toISOString() : new Date().toISOString();
    payload.status = 'Occupied';
    try {
      setLoading(true);
      await api('/api/checkins', { method: 'POST', body: JSON.stringify(payload) });
      await refresh('checkins');
      window.alert('Guest checked in and room marked occupied.');
      e.currentTarget.reset();
    } catch (err) {
      window.alert('Error: ' + (err.message || 'Failed to check-in'));
    } finally {
      setLoading(false);
    }
  }

  async function handleOrder(e, inhouse = true) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      payload.items = JSON.parse(payload.items || '[]');
    } catch {
      window.alert('Items must be valid JSON');
      return;
    }
    payload.total = payload.items.reduce((s, it) => s + it.qty * it.price, 0);
    payload.type = inhouse ? 'inhouse' : 'outside';
    payload.createdAt = new Date().toISOString();
    try {
      setLoading(true);
      await api('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
      await refresh('orders');
      window.alert('Order captured');
      e.currentTarget.reset();
    } catch (err) {
      window.alert('Error: ' + (err.message || 'Failed to save order'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout(checkin) {
    try {
      setLoading(true);
      await api('/api/checkout', { method: 'POST', body: JSON.stringify({ room: checkin.room, phone: checkin.phone }) });
      await Promise.all([refresh('bills'), refresh('checkins'), refresh('orders')]);
      window.alert('Final bill prepared. You can print or mark paid from Bills tab.');
      setTab('bills');
    } catch (err) {
      window.alert('Error: ' + (err.message || 'Failed to checkout'));
    } finally {
      setLoading(false);
    }
  }

  async function markBillPaid(id, mode) {
    try {
      await api(`/api/bills/${id}/pay`, { method: 'POST', body: JSON.stringify({ mode }) });
      await refresh('bills');
    } catch (err) {
      window.alert('Error: ' + (err.message || 'Failed to mark paid'));
    }
  }

  function printBill(id) {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;
    const win = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${bill.id}</title>
          <style>
            body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI; padding:24px}
            h1{font-size:18px;margin:0}
            table{width:100%;border-collapse:collapse;margin-top:12px}
            td,th{border:1px solid #e5e7eb;padding:6px;font-size:12px;text-align:left}
            .muted{color:#64748b}
          </style>
        </head>
        <body>
          <h1>Aurora Grand Hotel</h1>
          <div class="muted">Final Bill • ${new Date(bill.createdAt).toLocaleString()} • ${bill.id}</div>
          <div style="margin-top:8px">Guest: <b>${bill.guest}</b> • Phone: ${bill.phone} • Room: ${bill.room}</div>
          <table>
            <thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>
            <tbody>
              <tr><td>Room Charges</td><td>${bill.nights} night(s)</td><td>₹${Number(bill.roomCharges||0).toLocaleString()}</td></tr>
              <tr><td>Food (Unpaid)</td><td>-</td><td>₹${Number(bill.foodTotal||0).toLocaleString()}</td></tr>
              <tr><td>Advance Adjusted</td><td>-</td><td>-₹${Number(bill.advance||0).toLocaleString()}</td></tr>
              <tr><td>Tax</td><td>12%</td><td>₹${Number(bill.tax||0).toLocaleString()}</td></tr>
              <tr><td><b>Total</b></td><td>-</td><td><b>₹${Number(bill.total||0).toLocaleString()}</b></td></tr>
            </tbody>
          </table>
          <div style="margin-top:16px" class="muted">Status: ${bill.status} • Mode: ${bill.mode}</div>
          <div style="margin-top:40px;display:flex;justify-content:space-between">
            <div>Cashier Signature</div>
            <div>Customer Signature</div>
          </div>
          <div style="margin-top:24px" class="muted">Thank you for choosing us!</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const occupied = occupiedRoomsSet.has(String(r.room));
      if (roomFilter === 'All') return true;
      if (roomFilter === 'Available') return !occupied;
      if (roomFilter === 'Occupied') return occupied;
      return true;
    });
  }, [rooms, roomFilter, occupiedRoomsSet]);

  const counts = useMemo(() => {
    let occ = 0;
    rooms.forEach(r => { if (occupiedRoomsSet.has(String(r.room))) occ++; });
    return {
      total: rooms.length,
      occupied: occ,
      available: rooms.length - occ,
    };
  }, [rooms, occupiedRoomsSet]);

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          { key: 'checkin', label: 'Check-In', icon: Bed },
          { key: 'order', label: 'Restaurant Order', icon: Utensils },
          { key: 'checkout', label: 'Check-Out', icon: Search },
          { key: 'bills', label: 'Bills', icon: CreditCard },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              tab === key ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
        {loading && <span className="text-xs text-slate-500">Syncing…</span>}
      </div>

      {/* Rooms status overview */}
      <div className="mb-6">
        <SectionTitle
          icon={Bed}
          title="Rooms Status"
          action={(
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{counts.occupied} occupied • {counts.available} available • {counts.total} total</span>
              <select value={roomFilter} onChange={(e)=>setRoomFilter(e.target.value)} className="rounded-md border px-3 py-1.5 text-xs">
                <option>All</option>
                <option>Available</option>
                <option>Occupied</option>
              </select>
            </div>
          )}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredRooms.map((r) => {
            const occupied = occupiedRoomsSet.has(String(r.room));
            const unpaidCount = (unpaidOrdersByRoom.get(r.room) || []).length;
            return (
              <div key={r.room} className={`rounded-lg border p-3 text-sm ${occupied ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.room}</div>
                  {occupied ? <X size={16} className="text-amber-600" /> : <Check size={16} className="text-emerald-600" />}
                </div>
                <div className="mt-1 text-xs text-slate-600">{r.type} • ₹{r.rate.toLocaleString()}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${occupied ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{occupied ? 'Occupied' : 'Available'}</span>
                  {unpaidCount > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-700">{unpaidCount} unpaid</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {tab === 'checkin' && (
        <div>
          <SectionTitle icon={Bed} title="Guest Check-In" />
          <form onSubmit={handleCheckIn} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Guest Full Name"><input name="name" required className="w-full rounded-md border px-3 py-2" placeholder="John Doe" /></Field>
            <Field label="Mobile Number"><div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="phone" required className="w-full rounded-md border px-9 py-2" placeholder="98765 43210" /></div></Field>
            <Field label="ID Type & Number"><div className="flex gap-2"><select name="idtype" className="w-2/5 rounded-md border px-3 py-2"><option>Aadhaar</option><option>Passport</option><option>DL</option></select><div className="relative flex-1"><Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="id" className="w-full rounded-md border px-9 py-2" placeholder="XXXX-XXXX-XXXX" /></div></div></Field>
            <Field label="Address"><input name="address" className="w-full rounded-md border px-3 py-2" placeholder="City, Country" /></Field>
            <Field label="Room Number & Type"><div className="flex gap-2"><input name="room" required className="w-1/2 rounded-md border px-3 py-2" placeholder="305" /><select name="roomType" className="flex-1 rounded-md border px-3 py-2"><option>Single</option><option>Double</option><option>Deluxe</option><option>Suite</option></select></div></Field>
            <Field label="Rate per Night (₹)"><div className="relative"><IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="rate" type="number" min="0" className="w-full rounded-md border px-9 py-2" placeholder="3500" /></div></Field>
            <Field label="Adults / Children"><div className="flex gap-2"><div className="relative flex-1"><Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="adults" type="number" min="1" defaultValue={1} className="w-full rounded-md border px-9 py-2" /></div><div className="relative flex-1"><Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="children" type="number" min="0" defaultValue={0} className="w-full rounded-md border px-9 py-2" /></div></div></Field>
            <Field label="Check-In Date & Time"><div className="relative"><Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="createdAt" type="datetime-local" className="w-full rounded-md border px-9 py-2" defaultValue={new Date().toISOString().slice(0,16)} /></div></Field>
            <Field label="Advance (₹) & Payment Mode"><div className="flex gap-2"><div className="relative flex-1"><IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name="advance" type="number" min="0" className="w-full rounded-md border px-9 py-2" placeholder="0" /></div><select name="mode" className="w-2/5 rounded-md border px-3 py-2"><option>Cash</option><option>Card</option><option>UPI</option></select></div></Field>
            <Field label="Remarks"><input name="remarks" className="w-full rounded-md border px-3 py-2" placeholder="Special requests" /></Field>
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <button type="reset" className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50">Clear</button>
              <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Check In</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'order' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <SectionTitle icon={Utensils} title="In-House Order" />
            <form onSubmit={(e)=>handleOrder(e,true)} className="grid grid-cols-1 gap-4">
              <Field label="Room Number & Mobile"><div className="flex gap-2"><input name="room" required className="w-1/3 rounded-md border px-3 py-2" placeholder="305" /><input name="phone" required className="flex-1 rounded-md border px-3 py-2" placeholder="98765 43210" /></div></Field>
              <Field label="Items JSON [name, qty, price]"><textarea name="items" rows={3} className="w-full rounded-md border px-3 py-2" placeholder='[{"name":"Paneer Tikka","qty":1,"price":320}]' /></Field>
              <Field label="Status & Payment Mode"><div className="flex gap-2"><select name="status" className="w-1/3 rounded-md border px-3 py-2"><option>Unpaid</option><option>Paid</option></select><select name="mode" className="flex-1 rounded-md border px-3 py-2"><option>Cash</option><option>Card</option><option>UPI</option></select></div></Field>
              <button type="submit" className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500">Save Order</button>
            </form>
          </div>
          <div>
            <SectionTitle icon={Utensils} title="Outside Order" />
            <form onSubmit={(e)=>handleOrder(e,false)} className="grid grid-cols-1 gap-4">
              <Field label="Customer Name & Mobile"><div className="flex gap-2"><input name="name" required className="flex-1 rounded-md border px-3 py-2" placeholder="Walk-in" /><input name="phone" required className="w-1/2 rounded-md border px-3 py-2" placeholder="98765 43210" /></div></Field>
              <Field label="Items JSON [name, qty, price]"><textarea name="items" rows={3} className="w-full rounded-md border px-3 py-2" placeholder='[{"name":"Masala Dosa","qty":2,"price":120}]' /></Field>
              <Field label="Status & Payment Mode"><div className="flex gap-2"><select name="status" className="w-1/3 rounded-md border px-3 py-2"><option>Paid</option><option>Unpaid</option></select><select name="mode" className="flex-1 rounded-md border px-3 py-2"><option>Cash</option><option>Card</option><option>UPI</option></select></div></Field>
              <button type="submit" className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500">Save Order</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'checkout' && (
        <div>
          <SectionTitle icon={Search} title="Check-Out & Final Bill" />
          <div className="mb-3 text-xs text-slate-500">Select a checked-in guest to prepare final bill. Unpaid food orders will be auto-added.</div>
          <div className="overflow-hidden rounded-xl border">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Guest</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Room</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Rate</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Unpaid Food</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {checkins.filter(c=>c.status==='Occupied').length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">No active check-ins yet.</td></tr>
                )}
                {checkins.filter(c=>c.status==='Occupied').map(c => {
                  const food = (unpaidOrdersByRoom.get(c.room)||[]).reduce((s,o)=>s+o.total,0);
                  return (
                    <tr key={c.room + c.phone}>
                      <td className="px-3 py-2">{c.name}<div className="text-xs text-slate-500">{c.phone}</div></td>
                      <td className="px-3 py-2">{c.room} <span className="text-xs text-slate-500">({c.roomType})</span></td>
                      <td className="px-3 py-2">₹{(c.rate||0).toLocaleString()}</td>
                      <td className="px-3 py-2">₹{food.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right"><button onClick={()=>handleCheckout(c)} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500">Prepare Bill</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'bills' && (
        <div>
          <SectionTitle icon={CreditCard} title="Bills" />
          <div className="overflow-hidden rounded-xl border">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Bill</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Guest</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Room</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Total</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Status</th>
                  <th className="px-3 py-2 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bills.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">No bills yet.</td></tr>
                )}
                {bills.map(b => (
                  <tr key={b.id}>
                    <td className="px-3 py-2">{b.id}<div className="text-xs text-slate-500">{new Date(b.createdAt).toLocaleString()}</div></td>
                    <td className="px-3 py-2">{b.guest}<div className="text-xs text-slate-500">{b.phone}</div></td>
                    <td className="px-3 py-2">{b.room}</td>
                    <td className="px-3 py-2">₹{Number(b.total||0).toLocaleString()}</td>
                    <td className="px-3 py-2"><span className={`rounded-full px-2 py-1 text-xs ${b.status==='Paid'?'bg-emerald-50 text-emerald-600':'bg-amber-50 text-amber-700'}`}>{b.status}</span></td>
                    <td className="px-3 py-2 text-right flex items-center justify-end gap-2">
                      {b.status !== 'Paid' && (
                        <select onChange={(e)=>markBillPaid(b.id, e.target.value)} defaultValue="Mark Paid" className="rounded-md border px-2 py-1 text-xs">
                          <option disabled>Mark Paid</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                        </select>
                      )}
                      <button onClick={()=>printBill(b.id)} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-slate-50"><Printer size={14} /> Print</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Divider />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-3">
          <SectionTitle icon={Utensils} title="Recent Restaurant Orders" />
          <div className="max-h-56 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500"><th className="py-2">Type</th><th>Customer</th><th>Room</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-slate-500">No orders yet.</td></tr>}
                {orders.map((o, i) => (
                  <tr key={i}><td className="py-2">{o.type}</td><td>{o.name || 'In-house'}</td><td>{o.room || '-'}
                  </td><td>₹{Number(o.total||0).toLocaleString()}</td><td>{o.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <SectionTitle icon={Percent} title="Tariff & Taxes (Demo)" />
          <div className="text-sm text-slate-600">Room Tax: 12% • Service Charge: 5% • Restaurant GST: 5%</div>
          <div className="mt-2 rounded-md bg-slate-50 p-3 text-xs text-slate-500">In a live system, these settings are managed by Admin and applied across billing workflows.</div>
        </div>
      </div>
    </section>
  );
}
