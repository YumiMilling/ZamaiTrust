import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../core/auth'

/**
 * Kiosk login screen
 * NFC card tap + 4-digit PIN → identity confirmed
 * Fallback: phone number + OTP for admin/processor login
 */
export function KioskLogin() {
  const { signInNfc, signIn, loading } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'nfc' | 'phone'>('nfc')
  const [cardUid, setCardUid] = useState('')
  const [pin, setPin] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [waitingForCard, setWaitingForCard] = useState(true)

  // NFC reader integration (Web NFC API)
  async function startNfcScan() {
    try {
      if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader()
        await ndef.scan()
        ndef.addEventListener('reading', ({ serialNumber }: any) => {
          setCardUid(serialNumber)
          setWaitingForCard(false)
        })
      } else {
        // Fallback: manual entry for development/testing
        setWaitingForCard(false)
      }
    } catch {
      setWaitingForCard(false)
    }
  }

  async function handleNfcLogin() {
    if (pin.length !== 4) { setError('Enter your 4-digit PIN'); return }
    setError('')
    try {
      await signInNfc(cardUid, pin)
      navigate('/kiosk/delivery')
    } catch {
      setError('Card or PIN not recognised. Try again.')
    }
  }

  async function handlePhoneLogin() {
    setError('')
    try {
      await signIn('otp', phone)
      navigate('/')
    } catch {
      setError('Could not send OTP. Check phone number.')
    }
  }

  return (
    <div className="min-h-screen bg-[#073233] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-white mb-2">
            CATSP OS
          </h1>
          <p className="text-sm text-[#D99550] tracking-[0.3em] uppercase">
            Monze Aggregation Point
          </p>
        </div>

        {mode === 'nfc' ? (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            {waitingForCard ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#19C8CC] flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#19C8CC] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white mb-2">
                    Tap your card
                  </h2>
                  <p className="text-sm text-white/50">
                    Hold your NFC card against the reader
                  </p>
                </div>
                <button onClick={startNfcScan} className="w-full bg-[#14A0A3] text-white py-3 rounded font-medium hover:bg-[#0F7274] transition-colors">
                  Start scanning
                </button>
                {/* Dev fallback */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Or enter card UID manually (dev)"
                    value={cardUid}
                    onChange={e => setCardUid(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2 rounded"
                  />
                  {cardUid && (
                    <button onClick={() => setWaitingForCard(false)} className="w-full mt-2 text-sm text-[#D99550] hover:text-[#E8AE68]">
                      Continue with this UID →
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-sm text-[#19C8CC] font-mono mb-2">Card: {cardUid || 'manual'}</div>
                  <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white">
                    Enter your PIN
                  </h2>
                </div>

                {/* PIN entry — large buttons for field use */}
                <div className="flex justify-center gap-3 mb-6">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                      pin.length > i ? 'border-[#19C8CC] text-white bg-[#19C8CC]/20' : 'border-white/20 text-white/20'
                    }`}>
                      {pin.length > i ? '•' : ''}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((n, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (n === '⌫') setPin(p => p.slice(0, -1))
                        else if (n !== '' && pin.length < 4) setPin(p => p + n)
                      }}
                      disabled={n === ''}
                      className={`h-14 rounded-lg text-xl font-medium transition-colors ${
                        n === '' ? '' : 'bg-white/10 text-white hover:bg-white/20 active:bg-[#14A0A3]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

                <button
                  onClick={handleNfcLogin}
                  disabled={pin.length !== 4 || loading}
                  className="w-full bg-[#14A0A3] text-white py-3 rounded font-medium hover:bg-[#0F7274] transition-colors disabled:opacity-30"
                >
                  {loading ? 'Verifying...' : 'Confirm'}
                </button>

                <button onClick={() => { setWaitingForCard(true); setPin(''); setCardUid('') }} className="w-full mt-3 text-sm text-white/40 hover:text-white/60">
                  ← Scan different card
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white mb-6 text-center">
              Phone login
            </h2>
            <input
              type="tel"
              placeholder="+260 97..."
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button onClick={handlePhoneLogin} className="w-full bg-[#14A0A3] text-white py-3 rounded font-medium hover:bg-[#0F7274]">
              Send OTP
            </button>
          </div>
        )}

        {/* Mode toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => setMode(m => m === 'nfc' ? 'phone' : 'nfc')}
            className="text-sm text-white/30 hover:text-white/50"
          >
            {mode === 'nfc' ? 'Use phone login instead' : 'Use NFC card instead'}
          </button>
        </div>
      </div>
    </div>
  )
}
