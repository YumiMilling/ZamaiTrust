import { useState } from 'react'
import { useAuth } from '../core/auth'
import { supabase } from '../core/supabase'
import { KioskReceipt } from './KioskReceipt'

interface DeliveryForm {
  itemId: string
  itemName: string
  quantityKg: number
  bagCount: number
  grade: string
  contractId: string | null
}

/**
 * Kiosk delivery flow — the handshake happens here
 *
 * 1. Operator enters weight, grade, selects commodity
 * 2. Farmer taps NFC card + PIN (already logged in)
 * 3. Screen shows summary: "2,000kg Grade A pearl millet"
 * 4. Farmer confirms → handshake recorded
 * 5. Receipt prints
 */
export function KioskDelivery() {
  const { user, signOut } = useAuth()
  const [step, setStep] = useState<'entry' | 'confirm' | 'receipt'>('entry')
  const [form, setForm] = useState<DeliveryForm>({
    itemId: '', itemName: '', quantityKg: 0, bagCount: 0, grade: 'A', contractId: null,
  })
  const [receiptData, setReceiptData] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Available items (Phase 0 pilot)
  const items = [
    { id: '00000000-0000-0000-2000-000000000001', name: 'White Maize' },
    { id: '00000000-0000-0000-2000-000000000002', name: 'Soya Beans' },
    { id: '00000000-0000-0000-2000-000000000003', name: 'Pearl Millet' },
    { id: '00000000-0000-0000-2000-000000000004', name: 'Sorghum' },
  ]

  async function handleConfirm() {
    if (!user) return
    setSubmitting(true)
    setError('')

    try {
      // 1. Create delivery record
      const { data: delivery, error: delErr } = await supabase
        .from('deliveries')
        .insert({
          season_id: '00000000-0000-0000-3000-000000000001', // active season
          contract_id: form.contractId,
          source_org_id: user.orgIds[0], // farmer's cluster
          destination_org_id: '00000000-0000-0000-0000-000000000021', // Kagezi warehouse
          item_id: form.itemId,
          quantity_kg: form.quantityKg,
          bag_count: form.bagCount,
          grade: form.grade,
          status: 'received',
          received_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (delErr) throw delErr

      // 2. Create handshake — sender (farmer) submitting their claim
      //    In kiosk mode, both parties are present, so we create both sides at once
      const { data: handshake, error: hsErr } = await supabase
        .from('handshakes')
        .insert({
          delivery_id: delivery.id,
          sender_id: user.id, // farmer
          sender_count: form.quantityKg,
          sender_unit: 'kg',
          sender_timestamp: new Date().toISOString(),
          sender_auth_method: 'nfc_pin',
          receiver_id: '00000000-0000-0000-1000-000000000021', // warehouse operator
          receiver_count: form.quantityKg, // same count — confirmed at kiosk
          receiver_unit: 'kg',
          receiver_timestamp: new Date().toISOString(),
          receiver_auth_method: 'oauth',
        })
        .select()
        .single()

      if (hsErr) throw hsErr

      // Receipt data
      setReceiptData({
        deliveryRef: delivery.id.slice(0, 8).toUpperCase(),
        farmerName: user.name,
        itemName: form.itemName,
        quantityKg: form.quantityKg,
        bagCount: form.bagCount,
        grade: form.grade,
        handshakeStatus: handshake.status,
        timestamp: new Date().toISOString(),
        location: 'Monze Warehouse',
      })

      setStep('receipt')
    } catch (e: any) {
      setError(e.message || 'Failed to record delivery')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setStep('entry')
    setForm({ itemId: '', itemName: '', quantityKg: 0, bagCount: 0, grade: 'A', contractId: null })
    setReceiptData(null)
    setError('')
  }

  if (step === 'receipt' && receiptData) {
    return <KioskReceipt data={receiptData} onNewDelivery={reset} onLogout={signOut} />
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#073233]">
              Record Delivery
            </h1>
            <p className="text-sm text-stone-400">
              {user?.name} &middot; Monze Warehouse
            </p>
          </div>
          <button onClick={signOut} className="text-sm text-stone-400 hover:text-stone-600">
            Sign out
          </button>
        </div>

        {step === 'entry' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
            {/* Commodity selection */}
            <label className="block text-xs font-medium tracking-widest uppercase text-[#A86B2A] mb-2">
              Commodity
            </label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setForm(f => ({ ...f, itemId: item.id, itemName: item.name }))}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    form.itemId === item.id
                      ? 'border-[#14A0A3] bg-[#073233]/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-['Cormorant_Garamond'] text-lg font-semibold text-stone-800">{item.name}</div>
                </button>
              ))}
            </div>

            {/* Weight + bags */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase text-[#A86B2A] mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={form.quantityKg || ''}
                  onChange={e => setForm(f => ({ ...f, quantityKg: Number(e.target.value) }))}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 text-2xl font-semibold text-stone-800 focus:border-[#14A0A3] focus:ring-1 focus:ring-[#14A0A3] outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-widest uppercase text-[#A86B2A] mb-2">
                  Bags
                </label>
                <input
                  type="number"
                  value={form.bagCount || ''}
                  onChange={e => setForm(f => ({ ...f, bagCount: Number(e.target.value) }))}
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 text-2xl font-semibold text-stone-800 focus:border-[#14A0A3] focus:ring-1 focus:ring-[#14A0A3] outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Grade */}
            <label className="block text-xs font-medium tracking-widest uppercase text-[#A86B2A] mb-2">
              Grade
            </label>
            <div className="flex gap-2 mb-8">
              {['A', 'B', 'C'].map(g => (
                <button
                  key={g}
                  onClick={() => setForm(f => ({ ...f, grade: g }))}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold text-lg transition-colors ${
                    form.grade === g
                      ? 'border-[#14A0A3] bg-[#073233] text-white'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
              onClick={() => {
                if (!form.itemId) { setError('Select a commodity'); return }
                if (form.quantityKg <= 0) { setError('Enter weight'); return }
                setError('')
                setStep('confirm')
              }}
              className="w-full bg-[#073233] text-white py-4 rounded-lg font-['Cormorant_Garamond'] text-xl font-semibold hover:bg-[#0A4A4B] transition-colors"
            >
              Review delivery →
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="bg-white rounded-lg border-2 border-[#14A0A3] p-8 shadow-sm">
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#073233] mb-6 text-center">
              Confirm delivery
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-baseline border-b border-stone-100 pb-3">
                <span className="text-stone-500">Commodity</span>
                <span className="text-xl font-semibold text-stone-800">{form.itemName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-stone-100 pb-3">
                <span className="text-stone-500">Weight</span>
                <span className="text-xl font-semibold text-stone-800">{form.quantityKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-stone-100 pb-3">
                <span className="text-stone-500">Bags</span>
                <span className="text-xl font-semibold text-stone-800">{form.bagCount}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-stone-500">Grade</span>
                <span className="text-xl font-semibold text-[#14A0A3]">Grade {form.grade}</span>
              </div>
            </div>

            <p className="text-center text-sm text-stone-400 mb-6">
              Both parties confirm: farmer ({user?.name}) and warehouse operator
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep('entry')}
                className="py-4 rounded-lg border-2 border-stone-300 text-stone-600 font-medium text-lg hover:bg-stone-50"
              >
                ← Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="py-4 rounded-lg bg-[#073233] text-white font-['Cormorant_Garamond'] text-xl font-semibold hover:bg-[#0A4A4B] disabled:opacity-50"
              >
                {submitting ? 'Recording...' : 'Confirm ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
