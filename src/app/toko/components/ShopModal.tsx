'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { X } from 'lucide-react'

import type { ShopFormData } from '../../../types/shop'
import ShopForm from './ShopForm'

type Props = {
  show: boolean
  editing: boolean
  form: ShopFormData
  saving: boolean
  error: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function ShopModal({
  show,
  editing,
  form,
  saving,
  error,
  onChange,
  onImageChange,
  onSubmit,
  onClose,
}: Props) {
  if (!show) return null

  return (
    <div className="sh-overlay">
      <form className="sh-modal" onSubmit={onSubmit}>
        <header className="sh-modal-head">
          <div>
            <h3>{editing ? 'Edit Toko' : 'Tambah Toko'}</h3>
            <p>Lengkapi informasi toko keramik.</p>
          </div>

          <button
            type="button"
            className="sh-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </header>

        <div className="sh-modal-body">
          <ShopForm
            form={form}
            saving={saving}
            onChange={onChange}
            onImageChange={onImageChange}
          />

          {error && <div className="sh-alert error">{error}</div>}
        </div>

        <footer className="sh-modal-foot">
          <button type="button" className="sh-btn ghost" onClick={onClose} disabled={saving}>
            Batal
          </button>
          <button type="submit" className="sh-btn primary" disabled={saving}>
            {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Toko'}
          </button>
        </footer>
      </form>
    </div>
  )
}
