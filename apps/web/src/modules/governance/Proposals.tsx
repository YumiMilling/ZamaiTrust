import { useState, useEffect } from 'react'
import { useAuth } from '../../core/auth'
import { supabase } from '../../core/supabase'

interface Proposal {
  id: string
  title: string
  description: string
  proposal_type: string
  votes_for: number
  votes_against: number
  eligible_voters: number
  quorum_pct: number
  threshold_pct: number
  voting_closes: string
  status: string
  outcome: string | null
}

export function Proposals() {
  const { user, hasCapability } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [voting, setVoting] = useState<string | null>(null)
  const canVote = hasCapability('governance.vote')
  const canPropose = hasCapability('governance.propose')

  useEffect(() => { loadProposals() }, [])

  async function loadProposals() {
    const { data } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
    setProposals(data ?? [])
  }

  async function castVote(proposalId: string, vote: boolean) {
    if (!user) return
    setVoting(proposalId)
    await supabase.from('votes').insert({
      proposal_id: proposalId,
      voter_id: user.id,
      vote,
      vote_method: 'pwa',
    })
    await loadProposals()
    setVoting(null)
  }

  function timeLeft(closes: string): string {
    const ms = new Date(closes).getTime() - Date.now()
    if (ms <= 0) return 'Closed'
    const hrs = Math.floor(ms / 3600000)
    if (hrs > 24) return `${Math.floor(hrs / 24)}d ${hrs % 24}h left`
    return `${hrs}h left`
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#073233]">Proposals</h1>
          {canPropose && (
            <button className="bg-[#073233] text-white px-4 py-2 rounded-lg text-sm font-medium">
              + New proposal
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-4">
        {proposals.map(p => {
          const totalCast = p.votes_for + p.votes_against
          const quorumReached = (totalCast / Math.max(p.eligible_voters, 1) * 100) >= p.quorum_pct
          const isOpen = p.status === 'voting' && new Date(p.voting_closes) > new Date()
          const forPct = totalCast > 0 ? Math.round(p.votes_for / totalCast * 100) : 0

          return (
            <div key={p.id} className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-medium tracking-wider uppercase text-[#A86B2A]">{p.proposal_type.replace('_', ' ')}</span>
                  <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-stone-800 mt-1">{p.title}</h2>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  p.status === 'approved' ? 'bg-green-50 text-green-700' :
                  p.status === 'rejected' ? 'bg-red-50 text-red-700' :
                  isOpen ? 'bg-blue-50 text-blue-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {isOpen ? timeLeft(p.voting_closes) : p.outcome ?? p.status}
                </span>
              </div>

              <p className="text-sm text-stone-500 mb-4">{p.description}</p>

              {/* Vote bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-stone-400 mb-1">
                  <span>For: {p.votes_for}</span>
                  <span>{totalCast} of {p.eligible_voters} voted ({quorumReached ? 'quorum reached' : `need ${p.quorum_pct}%`})</span>
                  <span>Against: {p.votes_against}</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden flex">
                  <div className="bg-[#14A0A3] transition-all" style={{ width: `${forPct}%` }} />
                  <div className="bg-red-300 transition-all" style={{ width: `${100 - forPct}%` }} />
                </div>
                <div className="text-xs text-stone-400 mt-1 text-center">
                  Threshold: {p.threshold_pct}% needed to pass
                </div>
              </div>

              {/* Vote buttons */}
              {isOpen && canVote && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => castVote(p.id, true)}
                    disabled={voting === p.id}
                    className="flex-1 py-3 rounded-lg border-2 border-[#14A0A3] text-[#073233] font-semibold hover:bg-[#073233] hover:text-white transition-colors"
                  >
                    Vote FOR
                  </button>
                  <button
                    onClick={() => castVote(p.id, false)}
                    disabled={voting === p.id}
                    className="flex-1 py-3 rounded-lg border-2 border-red-300 text-red-700 font-semibold hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Vote AGAINST
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {proposals.length === 0 && (
          <div className="text-center py-16 text-stone-400">No proposals yet.</div>
        )}
      </main>
    </div>
  )
}
