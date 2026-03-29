/**
 * Kiosk Receipt — prints on thermal printer
 * Shows: delivery reference, farmer, commodity, weight, grade, timestamp, QR code
 * The farmer takes this home as proof of delivery.
 */

interface ReceiptData {
  deliveryRef: string
  farmerName: string
  itemName: string
  quantityKg: number
  bagCount: number
  grade: string
  handshakeStatus: string
  timestamp: string
  location: string
}

export function KioskReceipt({ data, onNewDelivery, onLogout }: {
  data: ReceiptData
  onNewDelivery: () => void
  onLogout: () => void
}) {
  function handlePrint() {
    window.print()
  }

  const time = new Date(data.timestamp)
  const confirmed = data.handshakeStatus === 'confirmed'

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Screen UI — not printed */}
        <div className="text-center mb-6 print:hidden">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            confirmed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {confirmed ? '✓ Delivery confirmed' : '⚠ Under review'}
          </div>
        </div>

        {/* Receipt — this is what prints */}
        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm print:shadow-none print:border-none print:rounded-none print:p-4">
          {/* Header */}
          <div className="text-center border-b border-dashed border-stone-300 pb-4 mb-4">
            <h1 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-stone-800">
              Delivery Receipt
            </h1>
            <p className="text-xs text-stone-400 mt-1">CATSP OS &middot; {data.location}</p>
          </div>

          {/* Reference */}
          <div className="text-center mb-4">
            <div className="text-xs text-stone-400 uppercase tracking-widest">Reference</div>
            <div className="font-mono text-2xl font-bold text-[#073233] tracking-wider">
              D-{data.deliveryRef}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 border-y border-dashed border-stone-300 py-4 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-stone-500">Farmer</span>
              <span className="text-sm font-medium text-stone-800">{data.farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-500">Commodity</span>
              <span className="text-sm font-medium text-stone-800">{data.itemName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-500">Weight</span>
              <span className="text-sm font-bold text-stone-800">{data.quantityKg.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-500">Bags</span>
              <span className="text-sm font-medium text-stone-800">{data.bagCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-500">Grade</span>
              <span className="text-sm font-bold text-[#14A0A3]">Grade {data.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-500">Status</span>
              <span className={`text-sm font-medium ${confirmed ? 'text-green-600' : 'text-amber-600'}`}>
                {confirmed ? 'CONFIRMED' : 'PENDING REVIEW'}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-center text-xs text-stone-400">
            <div>{time.toLocaleDateString('en-ZM', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>{time.toLocaleTimeString('en-ZM', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          {/* QR placeholder */}
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-24 bg-stone-100 border border-stone-200 rounded flex items-center justify-center text-xs text-stone-400">
              QR: D-{data.deliveryRef}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-xs text-stone-300">
            Keep this receipt &middot; zamai.pro
          </div>
        </div>

        {/* Actions — not printed */}
        <div className="mt-6 space-y-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full bg-[#073233] text-white py-4 rounded-lg font-['Cormorant_Garamond'] text-xl font-semibold hover:bg-[#0A4A4B]"
          >
            Print receipt
          </button>
          <button
            onClick={onNewDelivery}
            className="w-full border-2 border-[#14A0A3] text-[#073233] py-3 rounded-lg font-medium hover:bg-[#073233]/5"
          >
            New delivery
          </button>
          <button onClick={onLogout} className="w-full text-sm text-stone-400 hover:text-stone-600 py-2">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
