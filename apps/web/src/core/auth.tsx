import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { CapabilityId, ScopeLevel } from '@catsp/shared'

interface PlatformUser {
  id: string
  authId: string
  name: string
  phone?: string
  email?: string
  preset?: string
  orgIds: string[]
  capabilities: Array<{ id: CapabilityId; scope: ScopeLevel }>
}

interface AuthContextType {
  user: PlatformUser | null
  loading: boolean
  signIn: (method: 'google' | 'otp', credential: string) => Promise<void>
  signInNfc: (cardUid: string, pin: string) => Promise<void>
  signOut: () => Promise<void>
  hasCapability: (cap: CapabilityId, requiredScope?: ScopeLevel) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadPlatformUser(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) loadPlatformUser(session.user.id)
      else { setUser(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadPlatformUser(authId: string) {
    // Load platform user with capabilities
    const { data: platformUser } = await supabase
      .from('users')
      .select('id, name, phone, email, preset, auth_id')
      .eq('auth_id', authId)
      .single()

    if (!platformUser) { setLoading(false); return }

    // Load org affiliations
    const { data: affiliations } = await supabase
      .from('user_affiliations')
      .select('org_id')
      .eq('user_id', platformUser.id)
      .eq('active', true)

    // Load capabilities
    const { data: caps } = await supabase
      .from('user_capabilities')
      .select('capability_id, scope_level')
      .eq('user_id', platformUser.id)
      .eq('active', true)

    setUser({
      id: platformUser.id,
      authId: platformUser.auth_id,
      name: platformUser.name,
      phone: platformUser.phone,
      email: platformUser.email,
      preset: platformUser.preset,
      orgIds: affiliations?.map(a => a.org_id) ?? [],
      capabilities: caps?.map(c => ({ id: c.capability_id as CapabilityId, scope: c.scope_level as ScopeLevel })) ?? [],
    })
    setLoading(false)
  }

  function hasCapability(cap: CapabilityId, requiredScope: ScopeLevel = 'own'): boolean {
    if (!user) return false
    const RANK: Record<string, number> = { own: 1, assigned: 2, district: 3, province: 4, national: 5, facility: 3, actuarial: 3, custom: 3 }
    const required = RANK[requiredScope] ?? 1
    return user.capabilities.some(c => c.id === cap && (RANK[c.scope] ?? 1) >= required)
  }

  async function signIn(method: 'google' | 'otp', credential: string) {
    if (method === 'google') {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
    } else {
      await supabase.auth.signInWithOtp({ phone: credential })
    }
  }

  async function signInNfc(cardUid: string, pin: string) {
    // Call Edge Function to verify NFC + PIN and return a session
    const { data, error } = await supabase.functions.invoke('nfc-auth', {
      body: { card_uid: cardUid, pin },
    })
    if (error) throw error
    // Edge Function returns a custom JWT — set it as session
    if (data?.access_token) {
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInNfc, signOut, hasCapability }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
