'use client'

import type { ChangeEvent } from 'react'
import { ImagePlus } from 'lucide-react'

import type { ShopFormData } from '../../../types/shop'

type Props = {
  form: ShopFormData
  saving: boolean
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function ShopForm({ form, saving, onChange, onImageChange }: Props) {
  return (
    <>
      <div className="sh-field">
        <label htmlFor="name">Nama Toko</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nama toko"
          value={form.name}
          onChange={onChange}
          disabled={saving}
          required
        />
      </div>

      <div className="sh-field">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          name="description"
          placeholder="Deskripsi toko"
          value={form.description}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="sh-field">
        <label htmlFor="address">Alamat</label>
        <textarea
          id="address"
          name="address"
          placeholder="Alamat toko"
          value={form.address}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="sh-two">
        <div className="sh-field">
          <label htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            placeholder="@username"
            value={form.instagram}
            onChange={onChange}
            disabled={saving}
          />
        </div>

        <div className="sh-field">
          <label htmlFor="tiktok">TikTok</label>
          <input
            id="tiktok"
            name="tiktok"
            type="text"
            placeholder="@username"
            value={form.tiktok}
            onChange={onChange}
            disabled={saving}
          />
        </div>
      </div>

      <div className="sh-field">
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="text"
          placeholder="08xxxxxxxxxx"
          value={form.whatsapp}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="sh-field">
        <label>Foto Toko</label>
        <label className="sh-upload">
          {form.imagePreview ? (
            <img src={form.imagePreview} alt="Pratinjau toko" />
          ) : (
            <>
              <ImagePlus size={28} aria-hidden="true" />
              <span>Klik untuk memilih foto</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onImageChange}
            disabled={saving}
          />
        </label>
        <span className="sh-help">JPG, PNG, atau WEBP. Maksimal 2 MB.</span>
      </div>

      <label className="sh-check">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={onChange}
          disabled={saving}
        />
        Toko aktif
      </label>
    </>
  )
}
