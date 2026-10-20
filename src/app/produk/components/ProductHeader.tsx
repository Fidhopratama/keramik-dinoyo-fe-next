import { Plus } from 'lucide-react'

export default function ProductHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pr-head">
      <div>
        <h2>Produk</h2>
        <p>Kelola produk keramik dari seluruh toko.</p>
      </div>

      <button type="button" className="pr-btn primary" onClick={onAdd}>
        <Plus size={18} aria-hidden="true" />
        Tambah Produk
      </button>
    </div>
  )
}