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

type ProductFormProps = {
  form: ProductFormData
  shops: Shop[]
  editingProduct: Product | null
  saving: boolean
  formError: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function ProductForm({
  form,
  shops,
  editingProduct,
  saving,
  formError,
  onChange,
  onImageChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="shop_id">Toko</label>
        <select
          id="shop_id"
          name="shop_id"
          value={form.shop_id}
          onChange={onChange}
          required
        >
          <option value="">Pilih toko</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category_id">Category ID</label>
        <input
          id="category_id"
          name="category_id"
          type="number"
          min="1"
          value={form.category_id}
          onChange={onChange}
          placeholder="Masukkan ID kategori jika ada"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Nama Produk</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
          placeholder="Contoh: Cangkir Keramik Dinoyo"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Foto Produk</label>
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
        />

        <small className="file-help">
          JPG, JPEG, atau WEBP. Maksimal 2 MB.
        </small>

        {form.imagePreview && (
          <div className="image-preview">
            <img
              src={form.imagePreview}
              alt="Preview produk"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          rows={4}
          placeholder="Deskripsi produk..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Harga (Rp)</label>
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

        <div className="form-group">
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

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={onChange}
        >
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      {formError && (
        <div className="form-error">{formError}</div>
      )}

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Batal
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={saving}
        >
          {saving
            ? 'Menyimpan...'
            : editingProduct
              ? 'Simpan Perubahan'
              : 'Tambah Produk'}
        </button>
      </div>
    </form>
  )
}