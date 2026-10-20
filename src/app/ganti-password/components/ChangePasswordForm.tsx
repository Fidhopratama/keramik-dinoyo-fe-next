'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { KeyRound } from 'lucide-react'

import PasswordInput from './PasswordInput'
import PasswordStrength from './PasswordStrength'

type Props = {
  saving: boolean
  onSubmit: (current: string, next: string) => void
}

export default function ChangePasswordForm({ saving, onSubmit }: Props) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const mismatch = confirm.length > 0 && next !== confirm
  const sameAsOld = next.length > 0 && next === current

  const canSubmit =
    current.length > 0 &&
    next.length >= 8 &&
    next === confirm &&
    !sameAsOld &&
    !saving

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (canSubmit) onSubmit(current, next)
  }

  return (
    <section className="p-card">
      <header className="p-card-head">
        <div className="p-icon">
          <KeyRound size={20} aria-hidden="true" />
        </div>
        <div>
          <h3>Password Akun</h3>
          <p>Masukkan password saat ini, lalu password baru.</p>
        </div>
      </header>

      <form className="p-form" onSubmit={submit}>
        <div className="p-field">
          <label htmlFor="current">Password saat ini</label>
          <PasswordInput
            id="current"
            value={current}
            onChange={setCurrent}
            placeholder="Masukkan password saat ini"
            autoComplete="current-password"
          />
        </div>

        <div className="p-field">
          <label htmlFor="next">Password baru</label>
          <PasswordInput
            id="next"
            value={next}
            onChange={setNext}
            placeholder="Masukkan password baru"
            autoComplete="new-password"
            invalid={sameAsOld}
          />
          <PasswordStrength value={next} />
          {sameAsOld && (
            <p className="p-err">
              Password baru tidak boleh sama dengan password saat ini.
            </p>
          )}
        </div>

        <div className="p-field">
          <label htmlFor="confirm">Konfirmasi password baru</label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={setConfirm}
            placeholder="Ulangi password baru"
            autoComplete="new-password"
            invalid={mismatch}
          />
          {mismatch && <p className="p-err">Konfirmasi password tidak sama.</p>}
        </div>

        <div className="p-actions">
          <Link href="/profil" className="p-btn ghost">
            Batal
          </Link>
          <button type="submit" className="p-btn primary" disabled={!canSubmit}>
            {saving ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </div>
      </form>
    </section>
  )
}
