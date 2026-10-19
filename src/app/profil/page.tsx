'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

type Profile = {
  nama: string
  email: string
  telepon: string
  role: string
}

const DEFAULT_PROFILE: Profile = {
  nama: 'Admin',
  email: 'admin@kampungkeramik.id',
  telepon: '081234567890',
  role: 'Administrator',
}

const STORAGE_KEY = 'admin_profile'

export default function ProfilPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [form, setForm] = useState<Profile>(DEFAULT_PROFILE)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Profile
        setProfile(data)
        setForm(data)
      }
    } catch {}
  }, [])

  const handleChange = (key: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setProfile(form)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {}
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setForm(profile)
    setEditing(false)
  }

  const initial = profile.nama.trim().charAt(0).toUpperCase() || 'A'

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.breadcrumb}>Admin / Profil</div>
        <h1 style={styles.title}>Profil Admin</h1>
        <p style={styles.subtitle}>Kelola informasi akun administrator kamu.</p>

        {saved && <div style={styles.toast}>✓ Profil berhasil disimpan</div>}

        <div style={styles.card}>
          {/* Header profil */}
          <div style={styles.header}>
            <div style={styles.avatar}>{initial}</div>
            <div>
              <div style={styles.name}>{profile.nama}</div>
              <div style={styles.role}>{profile.role}</div>
            </div>
            {!editing && (
              <button style={styles.btnPrimary} onClick={() => setEditing(true)}>
                Edit Profil
              </button>
            )}
          </div>

          <div style={styles.divider} />

          {/* Form */}
          <div style={styles.grid}>
            <Field
              label="Nama Lengkap"
              value={form.nama}
              disabled={!editing}
              onChange={(v) => handleChange('nama', v)}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              disabled={!editing}
              onChange={(v) => handleChange('email', v)}
            />
            <Field
              label="No. Telepon"
              value={form.telepon}
              disabled={!editing}
              onChange={(v) => handleChange('telepon', v)}
            />
            <Field label="Role" value={form.role} disabled onChange={() => {}} />
          </div>

          {editing && (
            <div style={styles.actions}>
              <button style={styles.btnGhost} onClick={handleCancel}>
                Batal
              </button>
              <button style={styles.btnPrimary} onClick={handleSave}>
                Simpan Perubahan
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  type?: string
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...styles.input,
          background: disabled ? '#f7f3ef' : '#fff',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </label>
  )
}

const ACCENT = '#c97b4a'

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '8px 4px', maxWidth: 820 },
  breadcrumb: { fontSize: 13, color: '#8a8178', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: 700, color: '#2b2622', margin: 0 },
  subtitle: { color: '#8a8178', margin: '6px 0 24px' },
  toast: {
    background: '#e8f5ec',
    color: '#237a45',
    border: '1px solid #bfe3cb',
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: 28,
    border: '1px solid #eee7e0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  },
  header: { display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#ecd2bf',
    color: ACCENT,
    fontSize: 30,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 22, fontWeight: 700, color: '#2b2622' },
  role: { fontSize: 14, color: '#8a8178' },
  divider: { height: 1, background: '#eee7e0', margin: '24px 0' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 18,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#5c544d' },
  input: {
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid #e2d8cf',
    fontSize: 15,
    color: '#2b2622',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 24,
  },
  btnPrimary: {
    marginLeft: 'auto',
    background: ACCENT,
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  btnGhost: {
    background: '#fff',
    color: '#5c544d',
    border: '1px solid #e2d8cf',
    padding: '10px 20px',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
}