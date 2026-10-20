'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Eye, EyeOff, KeyRound } from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

// Endpoint dicoba berurutan. Berhenti di yang pertama ada di server.
const ENDPOINTS: { method: 'put' | 'post'; url: string }[] = [
  { method: 'put', url: '/me/password' },
  { method: 'post', url: '/change-password' },
  { method: 'put', url: '/change-password' },
]

const css = `
.p { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px; color: #25211e; }
.p-back { display: inline-flex; align-items: center; gap: 6px; width: fit-content; color: #8b827b; font-size: 13px; text-decoration: none; }
.p-back:hover { color: #c9562e; }
.p-head h2 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.p-head p { margin: 6px 0 0; color: #8b827b; font-size: 14px; }
.p-card { padding: 0 24px 24px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.p-card-head { display: flex; align-items: center; gap: 14px; padding: 18px 0 14px; border-bottom: 1px solid #efe9e3; }
.p-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: #fbeee4; color: #c9562e; }
.p-card-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
.p-card-head p { margin: 2px 0 0; color: #8b827b; font-size: 13px; }
.p-form { display: flex; flex-direction: column; gap: 16px; padding-top: 18px; }
.p-field { display: flex; flex-direction: column; gap: 6px; }
.p-field label { font-size: 13px; font-weight: 600; }
.p-input { position: relative; }
.p-input input { width: 100%; height: 42px; padding: 0 44px 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-size: 14px; outline: none; }
.p-input input:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.p-input input.bad { border-color: #d92d20; }
.p-eye { position: absolute; top: 0; right: 0; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border: 0; background: transparent; color: #8b827b; cursor: pointer; }
.p-eye:hover { color: #c9562e; }
.p-hint { margin: 0; color: #a59c95; font-size: 12px; }
.p-err { margin: 0; color: #b42318; font-size: 12px; }
.p-meter { display: flex; align-items: center; gap: 10px; }
.p-meter-bar { flex: 1; height: 6px; overflow: hidden; border-radius: 999px; background: #f1ece7; }
.p-meter-bar i { display: block; height: 100%; border-radius: 999px; transition: width 0.2s ease, background 0.2s ease; }
.p-meter span { width: 56px; font-size: 12px; font-weight: 600; text-align: right; }
.p-rules { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; list-style: none; font-size: 12px; color: #a59c95; }
.p-rules li { display: flex; align-items: center; gap: 6px; }
.p-rules li.ok { color: #237a45; }
.p-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.p-toast.success { background: #e8f5ec; color: #237a45; }
.p-toast.error { background: #fdecec; color: #b42318; }
.p-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
.p-btn { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; cursor: pointer; }
.p-btn.primary { border: 0; background: #c9562e; color: #fff; }
.p-btn.primary:hover:not(:disabled) { background: #b24a27; }
.p-btn.primary:disabled { opacity: 0.6; cursor: not-allowed; }
.p-btn.ghost { border: 1px solid #e7e0d9; background: #fff; color: #4a423d; }
.p-btn.ghost:hover { background: #faf8f6; }
@media (max-width: 700px) { .p-card { padding: 0 16px 18px; } }
`

function strengthOf(value: string) {
  let score = 0
  if (value.length >= 8) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1

  if (!value) return { score: 0, label: '', color: '#e7e0d9' }
  if (score <= 1) return { score, label: 'Lemah', color: '#d92d20' }
  if (score === 2) return { score, label: 'Cukup', color: '#e0a43a' }
  if (score === 3) return { score, label: 'Baik', color: '#7bb661' }
  return { score, label: 'Kuat', color: '#2f9e5b' }
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  invalid,
  autoComplete,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  invalid?: boolean
  autoComplete: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="p-input">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={invalid ? 'bad' : ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="p-eye"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export default function GantiPasswordPage() {
  const router = useRouter()

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const strength = strengthOf(next)

  const rules = [
    { ok: next.length >= 8, text: 'Minimal 8 karakter' },
    { ok: /[a-z]/.test(next) && /[A-Z]/.test(next), text: 'Kombinasi huruf besar dan kecil' },
    { ok: /\d/.test(next), text: 'Mengandung angka' },
  ]

  const mismatch = confirm.length > 0 && next !== confirm
  const sameAsOld = next.length > 0 && next === current

  const canSubmit =
    current.length > 0 &&
    next.length >= 8 &&
    next === confirm &&
    !sameAsOld &&
    !saving

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    setSaving(true)
    setMessage(null)

    const payload = {
      current_password: current,
      new_password: next,
      password: next,
      password_confirmation: confirm,
      currentPassword: current,
      newPassword: next,
    }

    let done = false

    for (const endpoint of ENDPOINTS) {
      try {
        await api.request({
          method: endpoint.method,
          url: endpoint.url,
          data: payload,
        })
        done = true
        break
      } catch (err: any) {
        const code = err?.response?.status

        // Endpoint tidak ada di server: coba alamat berikutnya.
        if (code === 404 || code === 405) continue

        // Server menjawab (mis. password lama salah): tampilkan pesannya.
        setMessage({
          type: 'error',
          text:
            err?.response?.data?.message ||
            'Password gagal diubah. Periksa password saat ini.',
        })
        setSaving(false)
        return
      }
    }

    setSaving(false)

    if (!done) {
      setMessage({
        type: 'error',
        text: 'Fitur ganti password belum tersedia di server. Hubungi pengembang backend.',
      })
      return
    }

    setCurrent('')
    setNext('')
    setConfirm('')
    setMessage({ type: 'success', text: 'Password berhasil diubah.' })
    window.setTimeout(() => router.push('/pengaturan'), 1500)
  }

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="p">
        <Link href="/pengaturan" className="p-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Pengaturan
        </Link>

        <div className="p-head">
          <h2>Ganti Password</h2>
          <p>Gunakan password yang kuat dan jangan dibagikan ke orang lain.</p>
        </div>

        {message && (
          <div className={`p-toast ${message.type}`} role="status">
            {message.type === 'success' && <Check size={15} />}
            {message.text}
          </div>
        )}

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

              {next && (
                <div className="p-meter">
                  <div className="p-meter-bar">
                    <i
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}

              <ul className="p-rules">
                {rules.map((rule) => (
                  <li key={rule.text} className={rule.ok ? 'ok' : ''}>
                    <Check size={13} aria-hidden="true" />
                    {rule.text}
                  </li>
                ))}
              </ul>

              {sameAsOld && (
                <p className="p-err">Password baru tidak boleh sama dengan password saat ini.</p>
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
              <Link href="/pengaturan" className="p-btn ghost">
                Batal
              </Link>
              <button type="submit" className="p-btn primary" disabled={!canSubmit}>
                {saving ? 'Menyimpan...' : 'Simpan Password'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  )
}