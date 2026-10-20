import { Plus } from 'lucide-react'

import type { Product } from '../../../types/product'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
  loading: boolean
  deletingId: number | string | null
  onAdd: () => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductGrid({
  products,
  loading,
  deletingId,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="pr-empty">
        <p>Memuat data produk...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="pr-empty">
        <strong>Belum ada produk</strong>
        <p>Tambahkan produk pertama.</p>
        <button type="button" className="pr-btn primary" onClick={onAdd}>
          <Plus size={18} aria-hidden="true" />
          Tambah Produk
        </button>
      </div>
    )
  }

  return (
    <div className="pr-grid">
      {products.map((product) => (
        <ProductCard
          key={`${product.id}-${product.image ?? ''}`}
          product={product}
          deleting={deletingId === product.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
