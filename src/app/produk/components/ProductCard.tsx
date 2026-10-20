'use client'

import { useState } from 'react'

import { formatPrice, getProductImage } from '../../../lib/product'
import type { Product } from '../../../types/product'

type Props = {
  product: Product
  deleting: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductCard({ product, deleting, onEdit, onDelete }: Props) {
  const [failed, setFailed] = useState(false)
  const image = getProductImage(product)
  const active = product.status === 'active'

  return (
    <div className="pr-card">
      <div className="pr-img">
        {image && !failed ? (
          <img src={image} alt={product.name} onError={() => setFailed(true)} />
        ) : (
          <span>Tidak ada foto</span>
        )}
      </div>

      <div className="pr-body">
        <div className="pr-title-row">
          <h3>{product.name}</h3>
          <span className={`pr-badge ${active ? 'on' : 'off'}`}>
            {active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        <p className="pr-shop">{product.shop?.name || 'Toko tidak diketahui'}</p>
        <p className="pr-desc">{product.description || 'Belum ada deskripsi.'}</p>

        <div className="pr-meta">
          <div>
            <span>Harga</span>
            <strong>Rp {formatPrice(product.price)}</strong>
          </div>
          <div>
            <span>Stok</span>
            <strong>{product.stock ?? 0}</strong>
          </div>
        </div>

        <div className="pr-actions">
          <button type="button" className="pr-btn edit" onClick={() => onEdit(product)}>
            Edit
          </button>
          <button
            type="button"
            className="pr-btn remove"
            disabled={deleting}
            onClick={() => onDelete(product)}
          >
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}
