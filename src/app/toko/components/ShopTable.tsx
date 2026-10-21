'use client'

import { Plus, Store } from 'lucide-react'

import type { Shop } from '../../../types/shop'
import ShopCard from './ShopCard'

interface ShopTableProps {
  shops: Shop[]
  deletingId: number | string | null
  highlightId?: string
  onEdit: (shop: Shop) => void
  onDelete: (shop: Shop) => void
  onAdd: () => void
}

export default function ShopTable({
  shops,
  deletingId,
  highlightId,
  onEdit,
  onDelete,
  onAdd,
}: ShopTableProps) {
  if (shops.length === 0) {
    return (
      <div className="sh-empty">
        <Store size={36} aria-hidden="true" />
        <strong>Belum ada data toko</strong>
        <p>Tambahkan toko untuk mulai mengelola data.</p>
        <button type="button" className="sh-btn primary" onClick={onAdd}>
          <Plus size={18} aria-hidden="true" />
          Tambah Toko
        </button>
      </div>
    )
  }

  return (
    <div className="sh-grid">
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          deleting={deletingId === shop.id}
          highlighted={highlightId === String(shop.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
