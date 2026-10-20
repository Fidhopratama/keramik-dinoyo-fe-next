'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Check,
  KeyRound,
  LogOut,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import api, { getDashboard, getMe } from '../../services/api'

const PREF_KEY = 'keramik_dinoyo_preferences'
const SETTINGS_KEY = 'dinoyo_admin_settings'
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5050/api'

function readSavedProfile(): any {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeSavedProfile(data: { name: string; email: string; phone: string }) {
  try {
    const current = readSavedProfile()
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        ...current,
        nama: data.name,
        email: data.email,
        telepon: data.phone,
      }),
    )
    window.dispatchEvent(new Event('dinoyo-settings-updated'))
  } catch {}
}

type Prefs = {
  notifications: boolean
  notifWorkshop: boolean
  notifProduct: boolean
  notifAi: boolean
  language: string
  perPage: string
}

const DEFAULT_PREFS: Prefs = {
  notifications: true,
  notifWorkshop: true,
  notifProduct: true,
  notifAi: true,
  language: 'id',
  perPage: '10',
}

const css = `
.s { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 780px; color: #25211e; }
.s-head h2 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.s-head p { margin: 6px 0 0; color: #8b827b; font-size: 14px; }
.s-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.s-toast.success { background: #e8f5ec; color: #237a45; }
.s-toast.error { background: #fdecec; color: #b42318; }
.s-card { padding: 0 24px 22px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.s-card-head { display: flex; align-items: center; gap: 14px; padding: 18px 0 14px; border-bottom: 1px solid #efe9e3; }
.s-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: #fbeee4; color: #c9562e; }
.s-card-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
.s-card-head p { margin: 2px 0 0; color: #8b827b; font-size: 13px; }
.s-avatar { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; margin-left: auto; border-radius: 50%; background: #ecd2bf; color: #8a4d28; font-size: 15px; font-weight: 700; }
.s-body { display: flex; flex-direction: column; gap: 16px; padding-top: 18px; }
.s-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.s-field { display: flex; flex-direction: column; gap: 6px; }
.s-field span { font-size: 13px; font-weight: 600; }
.s-field input, .s-select { width: 100%; height: 42px; padding: 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-size: 14px; outline: none; }
.s-field input::placeholder { color: #b3aba4; }
.s-field input:focus, .s-select:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.s-field input:disabled { background: #faf8f6; color: #8b827b; cursor: not-allowed; }
.s-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.s-row.line { padding-bottom: 16px; border-bottom: 1px solid #efe9e3; }
.s-row.sub { padding-left: 14px; }
.s-row strong { display: block; font-size: 15px; font-weight: 600; }
.s-row.sub strong { font-size: 14px; font-weight: 500; }
.s-row p { margin: 3px 0 0; color: #8b827b; font-size: 13px; }
.s-select { width: 190px; flex-shrink: 0; cursor: pointer; }
.s-actions { display: flex; justify-content: flex-end; }
.s-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 40px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; cursor: pointer; }
.s-btn.primary { border: 0; background: #c9562e; color: #fff; }
.s-btn.primary:hover:not(:disabled) { background: #b24a27; }
.s-btn.primary:disabled { opacity: 0.6; cursor: not-allowed; }
.s-btn.outline { flex-shrink: 0; border: 1px solid #c9562e; background: #fff; color: #c9562e; }
.s-btn.outline:hover { background: #fbeee4; }
.s-btn.danger { flex-shrink: 0; border: 1px solid #e6b3ad; background: #fff; color: #b42318; }
.s-btn.danger:hover { background: #fdecec; }
.s-toggle { position: relative; flex-shrink: 0; width: 44px; height: 24px; padding: 0; border: 0; border-radius: 999px; background: #d9d2cb; cursor: pointer; transition: background 0.2s ease; }
.s-toggle span { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.2s ease; }
.s-toggle.on { background: #c9562e; }
.s-toggle.on span { transform: translateX(20px); }
.s-toggle:disabled { opacity: 0.45; cursor: not-allowed; }
.s-status { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.s-dot { width: 10px; height: 10px; border-radius: 50%; background: #d9d2cb; }
.s-dot.ok { background: #2f9e5b; }
.s-dot.fail { background: #d92d20; }
.s-dot.checking { background: #e0a43a; }
.s-info { display: grid; grid-template-columns: 130px 1fr; gap: 8px 16px; margin: 0; padding-top: 16px; border-top: 1px solid #efe9e3; font-size: 13px; }
.s-info dt { color: #8b827b; }
.s-info dd { margin: 0; font-weight: 500; }
@media (max-width: 700px) {
  .s-two { grid-template-columns: 1fr; }
  .s-card { padding: 0 16px 18px; }
  .s-row { flex-direction: column; align-items: flex-start; }
  .s-select { width: 100%; }
  .s-info { grid-template-columns: 1fr; gap: 2px; }
}
`

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`s-toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  )
}

export default function PengaturanPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail'>('checking')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage(null), 3500)
  }

  const checkStatus = useCallback(async () => {
    setStatus('checking')
    try {
      await getDashboard()
      setStatus('ok')
    } catch {
      setStatus('fail')
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREF_KEY)
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) })
    } catch {}

    const loadProfile = async () => {
      const saved = readSavedProfile()

      try {
        const response = await getMe()
        const user = response.data?.data ?? response.data ?? {}

        setForm({
          name: saved.nama || user.name || 'Admin',
          email: saved.email || user.email || '',
          phone: saved.telepon || user.phone || '',
        })
      } catch {
        setForm({
          name: saved.nama || 'Admin',
          email: saved.email || '',
          phone: saved.telepon || '',
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
    checkStatus()
  }, [checkStatus])

  const saveProfile = async () => {
    setSaving(true)
    writeSavedProfile(form)

    try {
      await api.put('/me', form)
      showMessage('success', 'Profil berhasil disimpan.')
    } catch {
      showMessage(
        'success',
        'Profil disimpan di perangkat ini. Server belum menerima perubahan.',
      )
    } finally {
      setSaving(false)
    }
  }

  const savePrefs = () => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
      showMessage('success', 'Preferensi berhasil disimpan.')
    } catch {
      showMessage('error', 'Preferensi gagal disimpan.')
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('keramik_dinoyo_token')
    } catch {}
    router.push('/login')
  }

  const initial = form.name.trim().charAt(0).toUpperCase() || 'A'

  const statusText =
    status === 'checking'
      ? 'Memeriksa koneksi...'
      : status === 'ok'
        ? 'Terhubung ke server'
        : 'Tidak terhubung ke server'

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="s">
        <div className="s-head">
          <h2>Pengaturan</h2>
          <p>Kelola informasi akun dan preferensi sistem.</p>
        </div>

        {message && (
          <div className={`s-toast ${message.type}`} role="status">
            {message.type === 'success' && <Check size={15} />}
            {message.text}
          </div>
        )}

        {/* ---------- Profil ---------- */}
        <section className="s-card">
          <header className="s-card-head">
            <div className="s-icon">
              <User size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Profil Admin</h3>
              <p>Kelola informasi akun administrator.</p>
            </div>
            <div className="s-avatar" aria-hidden="true">
              {initial}
            </div>
          </header>

          <div className="s-body">
            <div className="s-two">
              <label className="s-field">
                <span>Nama Admin</span>
                <input
                  type="text"
                  value={form.name}
                  disabled={loading}
                  placeholder="Masukkan nama"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className="s-field">
                <span>Role</span>
                <input type="text" value="Administrator" disabled readOnly />
              </label>
            </div>

            <div className="s-two">
              <label className="s-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  disabled={loading}
                  placeholder="Masukkan email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label className="s-field">
                <span>Nomor Telepon</span>
                <input
                  type="tel"
                  value={form.phone}
                  disabled={loading}
                  placeholder="Masukkan nomor telepon"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
            </div>

            <div className="s-actions">
              <button
                type="button"
                className="s-btn primary"
                disabled={loading || saving}
                onClick={saveProfile}
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Keamanan ---------- */}
        <section className="s-card">
          <header className="s-card-head">
            <div className="s-icon">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Keamanan Akun</h3>
              <p>Kelola keamanan dan password akun administrator.</p>
            </div>
          </header>

          <div className="s-body">
            <div className="s-row line">
              <div>
                <strong>Password</strong>
                <p>Ubah password secara berkala untuk menjaga keamanan akun.</p>
              </div>
              <Link href="/ganti-password" className="s-btn outline">
                <KeyRound size={16} aria-hidden="true" />
                Ganti Password
              </Link>
            </div>

            <div className="s-row">
              <div>
                <strong>Keluar dari akun</strong>
                <p>Akhiri sesi login di perangkat ini.</p>
              </div>
              <button type="button" className="s-btn danger" onClick={logout}>
                <LogOut size={16} aria-hidden="true" />
                Keluar
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Notifikasi ---------- */}
        <section className="s-card">
          <header className="s-card-head">
            <div className="s-icon">
              <Bell size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Notifikasi</h3>
              <p>Pilih jenis pemberitahuan yang ingin kamu terima.</p>
            </div>
          </header>

          <div className="s-body">
            <div className="s-row line">
              <div>
                <strong>Aktifkan notifikasi</strong>
                <p>Terima notifikasi aktivitas workshop dan sistem.</p>
              </div>
              <Toggle
                label="Aktifkan notifikasi"
                checked={prefs.notifications}
                onChange={(value) => setPrefs({ ...prefs, notifications: value })}
              />
            </div>

            <div className="s-row sub">
              <div>
                <strong>Workshop baru</strong>
                <p>Saat ada pendaftaran atau perubahan workshop.</p>
              </div>
              <Toggle
                label="Notifikasi workshop"
                disabled={!prefs.notifications}
                checked={prefs.notifications && prefs.notifWorkshop}
                onChange={(value) => setPrefs({ ...prefs, notifWorkshop: value })}
              />
            </div>

            <div className="s-row sub">
              <div>
                <strong>Produk baru</strong>
                <p>Saat toko menambah atau mengubah produk.</p>
              </div>
              <Toggle
                label="Notifikasi produk"
                disabled={!prefs.notifications}
                checked={prefs.notifications && prefs.notifProduct}
                onChange={(value) => setPrefs({ ...prefs, notifProduct: value })}
              />
            </div>

            <div className="s-row sub">
              <div>
                <strong>Hasil verifikasi AI</strong>
                <p>Saat ada hasil analisis produk yang perlu diperiksa.</p>
              </div>
              <Toggle
                label="Notifikasi verifikasi AI"
                disabled={!prefs.notifications}
                checked={prefs.notifications && prefs.notifAi}
                onChange={(value) => setPrefs({ ...prefs, notifAi: value })}
              />
            </div>
          </div>
        </section>

        {/* ---------- Preferensi ---------- */}
        <section className="s-card">
          <header className="s-card-head">
            <div className="s-icon">
              <SlidersHorizontal size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Preferensi</h3>
              <p>Atur preferensi penggunaan dashboard.</p>
            </div>
          </header>

          <div className="s-body">
            <div className="s-row line">
              <div>
                <strong>Bahasa</strong>
                <p>Pilih bahasa tampilan antarmuka sistem.</p>
              </div>
              <select
                className="s-select"
                value={prefs.language}
                onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en" disabled>
                  English (segera hadir)
                </option>
              </select>
            </div>

            <div className="s-row line">
              <div>
                <strong>Data per halaman</strong>
                <p>Jumlah baris yang ditampilkan pada daftar.</p>
              </div>
              <select
                className="s-select"
                value={prefs.perPage}
                onChange={(e) => setPrefs({ ...prefs, perPage: e.target.value })}
              >
                <option value="10">10 data</option>
                <option value="25">25 data</option>
                <option value="50">50 data</option>
              </select>
            </div>

            <div className="s-actions">
              <button type="button" className="s-btn primary" onClick={savePrefs}>
                Simpan Preferensi
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Sistem ---------- */}
        <section className="s-card">
          <header className="s-card-head">
            <div className="s-icon">
              <Server size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Sistem</h3>
              <p>Status koneksi dan informasi aplikasi.</p>
            </div>
          </header>

          <div className="s-body">
            <div className="s-row">
              <div>
                <span className="s-status">
                  <i className={`s-dot ${status}`} />
                  {statusText}
                </span>
                <p>Alamat server: {API_BASE}</p>
              </div>
              <button type="button" className="s-btn outline" onClick={checkStatus}>
                Cek ulang
              </button>
            </div>

            <dl className="s-info">
              <dt>Aplikasi</dt>
              <dd>Keramik Dinoyo Admin Dashboard</dd>
              <dt>Versi</dt>
              <dd>1.0.0</dd>
            </dl>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}