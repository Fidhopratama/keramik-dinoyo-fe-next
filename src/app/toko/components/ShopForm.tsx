'use client'

import type { ChangeEvent, FormEvent } from 'react'
import type { ShopFormData } from './shopData'

interface ShopFormProps {
  form: ShopFormData
  saving: boolean
  editing: boolean
  error: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function ShopForm({
  form,
  saving,
  editing,
  error,
  onChange,
  onImageChange,
  onSubmit,
  onCancel,
}: ShopFormProps) {
  return (
    <>
      {error && (
        <div className="alert error">{error}</div>
      )}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="shop-name">Nama Toko</label>
          <input
            id="shop-name"
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nama toko"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="shop-description">Deskripsi</label>
          <textarea
            id="shop-description"
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            placeholder="Deskripsi toko"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="shop-instagram">Instagram</label>
            <input
              id="shop-instagram"
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={onChange}
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="shop-tiktok">TikTok</label>
            <input
              id="shop-tiktok"
              type="text"
              name="tiktok"
              value={form.tiktok}
              onChange={onChange}
              placeholder="@username"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="shop-whatsapp">WhatsApp</label>
            <input
              id="shop-whatsapp"
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={onChange}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={onChange}
              />
              <span>Toko aktif</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="shop-address">Alamat</label>
          <textarea
            id="shop-address"
            name="address"
            value={form.address}
            onChange={onChange}
            rows={3}
            placeholder="Alamat toko"
          />
        </div>

        <div className="form-group">
          <label htmlFor="shop-image">Gambar Toko</label>
          <input
            id="shop-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onImageChange}
          />

          <small>
            JPG, PNG, atau WEBP. Maksimal 2 MB.
          </small>

          {form.imagePreview && (
            <div className="preview">
              <img
                src={form.imagePreview}
                alt="Preview toko"
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-button"
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
              : editing
                ? 'Simpan Perubahan'
                : 'Simpan Toko'}
          </button>
        </div>
      </form>
    </>
  )
}