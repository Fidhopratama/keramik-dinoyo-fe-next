'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { X } from 'lucide-react'

import type { ProductForm, Shop } from '../../../types/product'
import ProductImageField from './ProductImageField'

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

type Props = {
  editing: boolean
  form: ProductForm
  shops: Shop[]
  saving: boolean
  error: string
  onChange: (event: FieldEvent) => void
  onImage: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent) => void
  onClose: () => void
}

export default function ProductFormModal({
  editing,
  form,
  shops,
  saving,
  error,
  onChange,
  onImage,
  onSubmit,
  onClose,
}: Props) {
  return (
    <div className="pr-overlay">
      <div className="pr-modal" role="dialog" aria-modal="true">
        <div className="pr-modal-head">
          <div>
            <h3>{editing ? 'Edit Produk' : 'Tambah Produk'}</h3>
            <p>Isi informasi produk di bawah.</p>
          </div>

          <button
            type="button"
            className="pr-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="pr-field">
            <label htmlFor="shop_id">Toko</label>
            <select id="shop_id" name="shop_id" value={form.shop_id} onChange={onChange} required>
              <option value="">Pilih toko</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pr-field">
            <label htmlFor="category_id">ID Kategori (opsional)</label>
            <input
              id="category_id"
              name="category_id"
              type="number"
              min="1"
              value={form.category_id}
              onChange={onChange}
            />
          </div>

          <div className="pr-field">
            <label htmlFor="name">Nama Produk</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <ProductImageField preview={form.imagePreview} onChange={onImage} />

          <div className="pr-field">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
            />
          </div>

          <div className="pr-two">
            <div className="pr-field">
              <label htmlFor="price">Harga</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={onChange}
                required
              />
            </div>

            <div className="pr-field">
              <label htmlFor="stock">Stok</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="pr-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={onChange}>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {error && <div className="pr-form-error">{error}</div>}

          <div className="pr-modal-actions">
            <button type="button" className="pr-btn ghost" onClick={onClose} disabled={saving}>
              Batal
            </button>
            <button type="submit" className="pr-btn primary" disabled={saving}>
              {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
