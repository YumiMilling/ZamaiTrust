import { useState, useEffect } from 'react'
import { useAuth } from '../../core/auth'
import { supabase } from '../../core/supabase'

interface PaymentLine {
  priority: number
  recipient_type: string
  description: string
  amount_zmw: number
  percentage: number
  status: string
}

interface Payment {
  id: string
  gross_amount_zmw: number
  stage: string
  status: string
  triggered_at: string
  lines: PaymentLine[]
}

/**
 * Waterfall display — shows how money splits for a delivery
 * Phase 0: display-only. Human executes the actual payment.
 */
export function WaterfallView({ deliveryId }: { deliveryId?: string }) {
  const { hasCapability } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const canView = hasCapability('financial.view')

  useEffect(() => {
    if (!canView) return
    loadPayments()
  }, [deliveryId, canView])

  async function loadPayments() {
    let query = supabase.from('payments').select('*').order('triggered_at', { ascending: false })
    if (deliveryId) query = query.eq('delivery_id', deliveryId)

    const { data: paymentData } = await query.limit(20)
    if (!paymentData) return

    // Load lines for each payment
    const withLines = await Promise.all(paymentData.map(async (p) => {
      const { data: lines } = await supabase
        .from('payment_lines')
        .select('*')
        .eq('payment_id', p.id)
        .order('priority')
      return { ...p, lines: lines ?? [] }
    }))

    setPayments(withLines)
  }

  if (!canView) return <div className="text-stone-400 text-sm p-6">Financial data not available for your role.</div>

  const typeColors: Record<string, string> = {
    warehouse: 'bg-amber-50 text-amber-700 border-amber-200',
    financier: 'bg-purple-50 text-purple-700 border-purple-200',
    supplier: 'bg-blue-50 text-blue-700 border-blue-200',
    insurer: 'bg-pink-50 text-pink-700 border-pink-200',
    platform: 'bg-stone-50 text-stone-600 border-stone-200',
    farmer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cluster: 'bg-teal-50 text-teal-700 border-teal-200',
  }

  return (
    <div className="space-y-6">
      {payments.map(p => (
        <div key={p.id} className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#073233] px-6 py-4 text-white">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#D99550] tracking-widest uppercase">
                  {p.stage === 'advance' ? 'Stage 1 — Advance' : 'Stage 2 — Settlement'}
                </span>
                <div className="font-['Cormorant_Garamond'] text-3xl font-semibold mt-1">
                  K{p.gross_amount_zmw.toLocaleString()}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                p.status === 'calculated' ? 'bg-white/10 text-white/60' :
                p.status === 'settled' ? 'bg-green-500/20 text-green-300' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                {p.status}
              </span>
            </div>
          </div>

          {/* Waterfall lines */}
          <div className="divide-y divide-stone-100">
            {p.lines.map((line, i) => {
              const colorClass = typeColors[line.recipient_type] ?? 'bg-stone-50 text-stone-600 border-stone-200'
              const isLast = i === p.lines.length - 1

              return (
                <div key={line.priority} className={`px-6 py-4 flex items-center justify-between ${isLast ? 'bg-emerald-50/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-stone-300 w-5">{line.priority}</span>
                    <div>
                      <div className="text-sm font-medium text-stone-800">{line.description}</div>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded border mt-1 ${colorClass}`}>
                        {line.recipient_type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${isLast ? 'text-emerald-700 text-lg' : 'text-stone-800'}`}>
                      K{line.amount_zmw.toLocaleString()}
                    </div>
                    {line.percentage != null && (
                      <div className="text-xs text-stone-400">{line.percentage}%</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Phase 0 notice */}
          <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-xs text-stone-400">
            Phase 0: display only — execute payment manually via mobile money
          </div>
        </div>
      ))}

      {payments.length === 0 && (
        <div className="text-center py-12 text-stone-400 text-sm">
          No waterfall calculations yet. Confirm a delivery to generate one.
        </div>
      )}
    </div>
  )
}
