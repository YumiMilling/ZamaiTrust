import { useState, useEffect } from 'react'
import { useAuth } from '../../core/auth'
import { supabase } from '../../core/supabase'

interface Contract {
  id: string
  item_name: string
  grade: string
  quantity_kg: number
  price_per_kg: number
  delivery_window_start: string
  delivery_window_end: string
  status: string
  seller_name: string | null
}

/**
 * Admin view for processors (Yumi Milling)
 * Post new buy contracts, view existing contracts, see delivery progress
 */
export function AdminContracts() {
  const { user, hasCapability, signOut } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [showForm, setShowForm] = useState(false)
  const canCreate = hasCapability('contracts.create')

  useEffect(() => {
    loadContracts()
  }, [])

  async function loadContracts() {
    const { data } = await supabase
      .from('contracts')
      .select('id, item_id, grade, quantity_kg, price_per_kg, delivery_window_start, delivery_window_end, status, seller_org_id')
      .order('created_at', { ascending: false })
    setContracts(data ?? [])
  }

  async function postContract(form: { itemId: string; grade: string; quantityKg: number; pricePerKg: number; windowStart: string; windowEnd: string }) {
    if (!user) return
    await supabase.from('contracts').insert({
      season_id: '00000000-0000-0000-3000-000000000001',
      buyer_org_id: user.orgIds[0],
      item_id: form.itemId,
      grade: form.grade,
      quantity_kg: form.quantityKg,
      price_per_kg: form.pricePerKg,
      delivery_window_start: form.windowStart,
      delivery_window_end: form.windowEnd,
      discovery_scope: 'district',
      discovery_district: 'Monze',
      status: 'posted',
    })
    setShowForm(false)
    loadContracts()
  }

  const items = [
    { id: '00000000-0000-0000-2000-000000000001', name: 'White Maize' },
    { id: '00000000-0000-0000-2000-000000000002', name: 'Soya Beans' },
    { id: '00000000-0000-0000-2000-000000000003', name: 'Pearl Millet' },
    { id: '00000000-0000-0000-2000-000000000004', name: 'Sorghum' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#073233]">Contracts</h1>
            <p className="text-sm text-stone-400">{user?.name}</p>
          </div>
          <div className="flex gap-3">
            {canCreate && (
              <button onClick={() => setShowForm(true)} className="bg-[#073233] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0A4A4B]">
                + Post buy contract
              </button>
            )}
            <button onClick={signOut} className="text-sm text-stone-400 hover:text-stone-600 px-3">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {showForm && <ContractForm items={items} onSubmit={postContract} onCancel={() => setShowForm(false)} />}

        <div className="space-y-3">
          {contracts.map(c => (
            <div key={c.id} className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-['Cormorant_Garamond'] text-lg font-semibold text-stone-800">
                    {c.quantity_kg.toLocaleString()} kg &middot; Grade {c.grade}
                  </div>
                  <div className="text-sm text-stone-400 mt-1">
                    K{c.price_per_kg.toLocaleString()}/kg &middot; {c.delivery_window_start} to {c.delivery_window_end}
                  </div>
                </div>
                <span className={`text-xs font-medium tracking-wider uppercase px-2 py-1 rounded ${
                  c.status === 'posted' ? 'bg-amber-50 text-amber-700' :
                  c.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                  c.status === 'fulfilled' ? 'bg-green-50 text-green-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
          {contracts.length === 0 && (
            <div className="text-center py-16 text-stone-400">
              No contracts yet. {canCreate ? 'Post your first buy contract.' : ''}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ContractForm({ items, onSubmit, onCancel }: {
  items: { id: string; name: string }[]
  onSubmit: (form: any) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    itemId: items[0]?.id ?? '', grade: 'A', quantityKg: 0, pricePerKg: 0,
    windowStart: '', windowEnd: '',
  })

  return (
    <div className="bg-white rounded-lg border-2 border-[#14A0A3] p-6 shadow-sm mb-6">
      <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#073233] mb-4">Post buy contract</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#A86B2A] mb-1">Commodity</label>
          <select value={form.itemId} onChange={e => setForm(f => ({ ...f, itemId: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm">
            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#A86B2A] mb-1">Grade</label>
          <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm">
            <option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#A86B2A] mb-1">Quantity (kg)</label>
          <input type="number" value={form.quantityKg || ''} onChange={e => setForm(f => ({ ...f, quantityKg: Number(e.target.value) }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm" placeholder="200000" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#A86B2A] mb-1">Price (K/kg)</label>
          <input type="number" value={form.pricePerKg || ''} onChange={e => setForm(f => ({ ...f, pricePerKg: Number(e.target.value) }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm" placeholder="6400" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#A86B2A] mb-1">Delivery from</label>
          <input type="date" value={form.windowStart} onChange={e => setForm(f => ({ ...f, windowStart: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#A86B2A] mb-1">Delivery to</label>
          <input type="date" value={form.windowEnd} onChange={e => setForm(f => ({ ...f, windowEnd: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onCancel} className="flex-1 border border-stone-300 text-stone-600 py-2 rounded text-sm">Cancel</button>
        <button onClick={() => onSubmit(form)} className="flex-1 bg-[#073233] text-white py-2 rounded text-sm font-medium">Post contract</button>
      </div>
    </div>
  )
}
