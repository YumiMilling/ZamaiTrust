/**
 * Offline Resilience — PowerSync integration for kiosk
 *
 * The kiosk has fixed internet. PowerSync is the safety net for
 * the 10 minutes/day the connection drops — not the primary mode.
 *
 * Strategy:
 * - Reads: PowerSync maintains a local SQLite mirror of relevant tables
 * - Writes: Queue actions locally, sync when connection returns
 * - Conflict: Last-write-wins for reads, queue-and-reconcile for writes
 */

interface QueuedAction {
  id: string
  type: 'handshake' | 'vote' | 'attestation'
  payload: Record<string, unknown>
  createdAt: string
  synced: boolean
  error?: string
}

const DB_NAME = 'catsp-offline'
const STORE_NAME = 'action-queue'

// Open IndexedDB for action queue
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('synced', 'synced')
        store.createIndex('type', 'type')
      }
    }
  })
}

// Queue an action for later sync
export async function queueAction(action: Omit<QueuedAction, 'id' | 'createdAt' | 'synced'>): Promise<string> {
  const db = await openDB()
  const id = crypto.randomUUID()
  const entry: QueuedAction = {
    ...action,
    id,
    createdAt: new Date().toISOString(),
    synced: false,
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    tx.oncomplete = () => resolve(id)
    tx.onerror = () => reject(tx.error)
  })
}

// Get all unsynced actions
export async function getUnsyncedActions(): Promise<QueuedAction[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const index = tx.objectStore(STORE_NAME).index('synced')
    const request = index.getAll(false)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Mark action as synced
export async function markSynced(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const entry = getReq.result as QueuedAction
      if (entry) {
        entry.synced = true
        store.put(entry)
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Mark action as failed
export async function markFailed(id: string, error: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const entry = getReq.result as QueuedAction
      if (entry) {
        entry.error = error
        store.put(entry)
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Get queue count (for UI indicator)
export async function getQueueCount(): Promise<number> {
  const actions = await getUnsyncedActions()
  return actions.length
}

/**
 * Connectivity monitor — detects online/offline state
 * Shows banner on kiosk when offline, syncs when back
 */
export function onConnectivityChange(callback: (online: boolean) => void) {
  window.addEventListener('online', () => callback(true))
  window.addEventListener('offline', () => callback(false))
  // Initial state
  callback(navigator.onLine)
  return () => {
    window.removeEventListener('online', () => callback(true))
    window.removeEventListener('offline', () => callback(false))
  }
}

/**
 * Sync engine — processes queued actions when connection returns
 */
export async function syncQueue(
  processor: (action: QueuedAction) => Promise<void>
): Promise<{ synced: number; failed: number }> {
  const actions = await getUnsyncedActions()
  let synced = 0
  let failed = 0

  for (const action of actions) {
    try {
      await processor(action)
      await markSynced(action.id)
      synced++
    } catch (e: any) {
      await markFailed(action.id, e.message ?? 'Sync failed')
      failed++
    }
  }

  return { synced, failed }
}
