'use client'

import ShopCard from './ShopCard'
import type { Shop } from './shopData'

interface ShopTableProps {
  shops: Shop[]
  deletingId: number | string | null
  onEdit: (shop: Shop) => void
  onDelete: (shop: Shop) => void
  onAdd: () => void
}

export default function ShopTable({
  shops,
  deletingId,
  onEdit,
  onDelete,
  onAdd,
}: ShopTableProps) {
  if (shops.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">🏪</div>

        <h3>Belum ada data toko</h3>

        <p>
          Tambahkan toko untuk mulai mengelola data.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={onAdd}
        >
          + Tambah Toko
        </button>
      </div>
    )
  }

  return (
    <div className="shop-grid">
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          deleting={deletingId === shop.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
