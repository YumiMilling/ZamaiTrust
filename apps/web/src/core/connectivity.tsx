import { useState, useEffect, type ReactNode } from 'react'
import { onConnectivityChange, getQueueCount, syncQueue } from './offline'
import { supabase } from './supabase'

/**
 * Connectivity banner — shows on kiosk when offline
 * Auto-syncs queued actions when connection returns
 */
export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(navigator.onLine)
  const [queueCount, setQueueCount] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<{ synced: number; failed: number } | null>(null)

  useEffect(() => {
    const cleanup = onConnectivityChange(async (isOnline) => {
      setOnline(isOnline)
      if (isOnline) {
        // Auto-sync when back online
        await doSync()
      }
      updateQueueCount()
    })
    updateQueueCount()
    return cleanup
  }, [])

  async function updateQueueCount() {
    const count = await getQueueCount()
    setQueueCount(count)
  }

  async function doSync() {
    setSyncing(true)
    const result = await syncQueue(async (action) => {
      // Process each queued action type
      switch (action.type) {
        case 'handshake': {
          const { deliveryData, handshakeData } = action.payload as any
          const { data: delivery } = await supabase.from('deliveries').insert(deliveryData).select().single()
          if (delivery) {
            await supabase.from('handshakes').insert({ ...handshakeData, delivery_id: delivery.id })
          }
          break
        }
        case 'vote': {
          await supabase.from('votes').insert(action.payload)
          break
        }
        case 'attestation': {
          await supabase.from('attestations').insert(action.payload)
          break
        }
      }
    })
    setLastSync(result)
    setSyncing(false)
    await updateQueueCount()

    // Clear sync result after 5 seconds
    if (result.synced > 0 || result.failed > 0) {
      setTimeout(() => setLastSync(null), 5000)
    }
  }

  return (
    <>
      {/* Offline banner */}
      {!online && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white text-center py-2 text-sm font-medium">
          ⚠ Offline — actions will be queued and synced when connection returns
          {queueCount > 0 && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">{queueCount} queued</span>}
        </div>
      )}

      {/* Syncing indicator */}
      {syncing && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-[#14A0A3] text-white text-center py-2 text-sm font-medium">
          Syncing {queueCount} queued action(s)...
        </div>
      )}

      {/* Sync result */}
      {lastSync && !syncing && (
        <div className={`fixed top-0 left-0 right-0 z-[200] text-white text-center py-2 text-sm font-medium ${
          lastSync.failed > 0 ? 'bg-red-500' : 'bg-green-600'
        }`}>
          {lastSync.synced > 0 && `✓ ${lastSync.synced} action(s) synced`}
          {lastSync.failed > 0 && ` · ${lastSync.failed} failed`}
        </div>
      )}

      {/* Queued actions indicator (when online but actions pending) */}
      {online && queueCount > 0 && !syncing && !lastSync && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-blue-500 text-white text-center py-2 text-sm font-medium">
          {queueCount} queued action(s) —
          <button onClick={doSync} className="underline ml-1">Sync now</button>
        </div>
      )}

      <div className={!online ? 'pt-10' : ''}>{children}</div>
    </>
  )
}
