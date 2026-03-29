import { useState } from 'react'

/**
 * QR Code generator and scanner for bag-level traceability
 *
 * Each bag gets a unique QR code at the aggregation point.
 * The QR encodes: delivery reference + bag number + weight + grade
 * Scannable at any point downstream (processor, warehouse, export)
 */

interface BagQr {
  deliveryRef: string
  bagNumber: number
  totalBags: number
  itemName: string
  weightKg: number
  grade: string
  timestamp: string
  location: string
}

// Generate QR data string for a bag
export function generateBagQrData(bag: BagQr): string {
  return JSON.stringify({
    d: bag.deliveryRef,
    b: bag.bagNumber,
    t: bag.totalBags,
    i: bag.itemName,
    w: bag.weightKg,
    g: bag.grade,
    ts: bag.timestamp,
    l: bag.location,
    v: 1, // QR schema version
  })
}

// Generate QR codes for all bags in a delivery
export function generateDeliveryQrs(delivery: {
  ref: string
  bagCount: number
  itemName: string
  totalWeightKg: number
  grade: string
  location: string
}): BagQr[] {
  const weightPerBag = delivery.totalWeightKg / delivery.bagCount
  const timestamp = new Date().toISOString()

  return Array.from({ length: delivery.bagCount }, (_, i) => ({
    deliveryRef: delivery.ref,
    bagNumber: i + 1,
    totalBags: delivery.bagCount,
    itemName: delivery.itemName,
    weightKg: Math.round(weightPerBag * 10) / 10,
    grade: delivery.grade,
    timestamp,
    location: delivery.location,
  }))
}

/**
 * QR Code display component (uses a simple SVG-based QR)
 * For Phase 0, we generate a text-based representation.
 * Phase 1: integrate a proper QR library (qrcode.react)
 */
export function QrCode({ data, size = 120 }: { data: string; size?: number }) {
  // Phase 0: simple text display with border (proper QR library in Phase 1)
  const shortData = data.length > 40 ? data.slice(0, 37) + '...' : data

  return (
    <div
      className="bg-white border-2 border-stone-800 flex flex-col items-center justify-center p-2"
      style={{ width: size, height: size }}
    >
      <div className="text-[8px] font-mono text-stone-600 text-center break-all leading-tight">
        {shortData}
      </div>
      <div className="text-[6px] text-stone-300 mt-1">QR v1</div>
    </div>
  )
}

/**
 * Bag labels component — generates printable labels for all bags
 */
export function BagLabels({ bags, onClose }: { bags: BagQr[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between print:hidden">
          <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#073233]">
            Bag Labels — {bags.length} bags
          </h2>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="bg-[#073233] text-white px-4 py-2 rounded text-sm">
              Print labels
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-sm">Close</button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4 print:grid-cols-3 print:gap-2">
          {bags.map(bag => (
            <div key={bag.bagNumber} className="border border-stone-300 p-3 rounded text-center">
              <div className="text-xs font-mono text-[#A86B2A] font-medium">D-{bag.deliveryRef}</div>
              <div className="text-2xl font-bold text-stone-800 my-1">
                Bag {bag.bagNumber}/{bag.totalBags}
              </div>
              <div className="text-sm text-stone-600">{bag.itemName} · Grade {bag.grade}</div>
              <div className="text-xs text-stone-400">{bag.weightKg}kg · {bag.location}</div>
              <div className="flex justify-center mt-2">
                <QrCode data={generateBagQrData(bag)} size={80} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
