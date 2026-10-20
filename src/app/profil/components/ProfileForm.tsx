'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { User } from 'lucide-react'

import type { ProfileData } from '../../../types/profile'

type Props = {
  profile: ProfileData
  loading: boolean
  saving: boolean
  onSave: (data: ProfileData) => Promise<boolean>
}

export default function ProfileForm({ profile, loading, saving, onSave }: Props) {
  const [form, setForm] = useState<ProfileData>(profile)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) setForm(profile)
  }, [profile, editing])

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Nama tidak boleh kosong.')
      return
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Format email tidak valid.')
      return
    }

    setError('')

    const ok = await onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    })

    if (ok) setEditing(false)
  }

  const cancel = () => {
    setForm(profile)
    setError('')
    setEditing(false)
  }

  const locked = loading || !editing

  return (
    <section className="pf-card">
      <header className="pf-card-head">
        <div className="pf-icon">
          <User size={20} aria-hidden="true" />
        </div>
        <div>
          <h3>Informasi Akun</h3>
          <p>Data diri administrator.</p>
        </div>
      </header>

      <form className="pf-body" onSubmit={submit}>
        <div className="pf-two">
          <label className="pf-field">
            <span>Nama Admin</span>
            <input
              type="text"
              value={form.name}
              disabled={locked}
              placeholder="Masukkan nama"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label className="pf-field">
            <span>Role</span>
            <input type="text" value="Administrator" disabled readOnly />
          </label>
        </div>

        <div className="pf-two">
          <label className="pf-field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              disabled={locked}
              placeholder="Masukkan email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label className="pf-field">
            <span>Nomor Telepon</span>
            <input
              type="tel"
              value={form.phone}
              disabled={locked}
              placeholder="Masukkan nomor telepon"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
        </div>

        {error && <p className="pf-err">{error}</p>}

        <div className="pf-actions">
          {editing ? (
            <>
              <button type="button" className="pf-btn ghost" onClick={cancel}>
                Batal
              </button>
              <button type="submit" className="pf-btn primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="pf-btn primary"
              disabled={loading}
              onClick={() => setEditing(true)}
            >
              Edit Profil
            </button>
          )}
        </div>
      </form>
    </section>
  )
}