import { Link } from 'react-router-dom'
import { useAuth } from '../core/auth'

/**
 * Role-based dashboard — shows relevant modules based on capabilities
 */
export function Dashboard() {
  const { user, hasCapability, signOut } = useAuth()

  if (!user) return null

  const modules = [
    { path: '/contracts', label: 'Contracts', desc: 'View and manage buy contracts', cap: 'contracts.view' as const, icon: '📋' },
    { path: '/kiosk/delivery', label: 'Kiosk: Record Delivery', desc: 'Weigh, grade, and confirm deliveries', cap: 'deliveries.handshake' as const, icon: '⚖️' },
  ]

  const available = modules.filter(m => hasCapability(m.cap))

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-[#073233] text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-[#D99550] tracking-[0.3em] uppercase mb-2">CATSP OS</p>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold mb-1">{user.name}</h1>
          <p className="text-sm text-white/50">{user.preset} &middot; {user.orgIds.length} organisation(s)</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {available.map(m => (
            <Link key={m.path} to={m.path}
              className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm hover:border-[#14A0A3] hover:shadow-md transition-all group">
              <div className="text-3xl mb-3">{m.icon}</div>
              <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#073233] group-hover:text-[#14A0A3] transition-colors">
                {m.label}
              </h2>
              <p className="text-sm text-stone-400 mt-1">{m.desc}</p>
            </Link>
          ))}
        </div>

        {available.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            No modules available for your current capabilities.
          </div>
        )}

        <div className="mt-12 text-center">
          <button onClick={signOut} className="text-sm text-stone-400 hover:text-stone-600">Sign out</button>
        </div>
      </main>
    </div>
  )
}
