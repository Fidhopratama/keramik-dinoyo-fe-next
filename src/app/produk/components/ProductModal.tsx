'use client'

import type {
  ChangeEvent,
  FormEvent,
} from 'react'
import type {
  Product,
  ProductFormData,
  Shop,
} from './productData'
import ProductForm from './ProductForm'

type ProductModalProps = {
  form: ProductFormData
  shops: Shop[]
  editingProduct: Product | null
  saving: boolean
  formError: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function ProductModal({
  form,
  shops,
  editingProduct,
  saving,
  formError,
  onChange,
  onImageChange,
  onSubmit,
  onClose,
}: ProductModalProps) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose()
        }
      }}
    >
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="product-modal-title">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
            </h2>
            <p>Isi informasi produk di bawah.</p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup formulir"
          >
            ×
          </button>
        </div>

        <ProductForm
          form={form}
          shops={shops}
          editingProduct={editingProduct}
          saving={saving}
          formError={formError}
          onChange={onChange}
          onImageChange={onImageChange}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </section>
    </div>
  )
}