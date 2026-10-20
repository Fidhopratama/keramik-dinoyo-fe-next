'use client'

import { useState } from 'react'
import type { Product } from './productData'
import { formatPrice, getProductImage } from './productData'

type ProductCardProps = {
  product: Product
  deleting: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductCard({
  product,
  deleting,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getProductImage(product)
  const isActive = product.status === 'active'

  return (
    <article className="product-card">
      <div className="product-image">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-placeholder">
            Tidak ada foto
          </div>
        )}
      </div>

      <div className="product-content">
        <div className="product-title-row">
          <h3>{product.name}</h3>

          <span
            className={`status-badge ${
              isActive ? 'active' : 'inactive'
            }`}
          >
            {isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        <p className="product-shop">
          {product.shop?.name || 'Toko tidak diketahui'}
        </p>

        <p className="product-description">
          {product.description || 'Belum ada deskripsi.'}
        </p>

        <div className="product-meta">
          <div>
            <span>Harga</span>
            <strong>{formatPrice(product.price)}</strong>
          </div>

          <div>
            <span>Stok</span>
            <strong>{product.stock ?? 0}</strong>
          </div>
        </div>

        <div className="product-actions">
          <button
            type="button"
            className="edit-product-button"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-product-button"
            disabled={deleting}
            onClick={() => onDelete(product)}
          >
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </article>
  )
}