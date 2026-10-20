'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

function getSavedName() {
  if (typeof window === 'undefined') {
    return ''
  }

  try {
    const saved = localStorage.getItem('dinoyo_admin_settings')

    if (!saved) return ''

    const parsed = JSON.parse(saved)

    return parsed.nama || ''
  } catch {
    return ''
  }
}

function ProfileDropdown({ onProfile, onChangePassword, onLogout }) {
  const [open, setOpen] = useState(false)
  const [savedName, setSavedName] = useState('')

  useEffect(() => {
    setSavedName(getSavedName())

    const handleSettingsUpdate = () => {
      setSavedName(getSavedName())
    }

    window.addEventListener('dinoyo-settings-updated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('dinoyo-settings-updated', handleSettingsUpdate)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const handleOutside = (event) => {
      if (!event.target.closest('.pd-wrapper')) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const name = savedName || 'Admin'

  const initial = name.trim().charAt(0).toUpperCase() || 'A'

  const handleProfile = () => {
    setOpen(false)
    onProfile?.()
  }

  const handlePassword = () => {
    setOpen(false)
    onChangePassword?.()
  }

  const handleLogout = () => {
    setOpen(false)
    onLogout?.()
  }

  return (
    <div className="pd-wrapper">
      <button
        type="button"
        className="admin-account"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="profile-avatar">{initial}</div>

        <div className="profile-info">
          <strong>{name}</strong>
          <span>Administrator</span>
        </div>

        <span className="profile-arrow">
          <ChevronDown size={13} aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div className="admin-dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            className="dropdown-user dropdown-user-button"
            onClick={handleProfile}
            style={{
              width: '100%',
              border: 0,
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: 10,
              font: 'inherit',
              color: 'inherit',
            }}
          >
            <span className="profile-avatar">{initial}</span>

            <span className="dropdown-user-info" style={{ display: 'block' }}>
              <strong>{name}</strong>
              <span>Administrator</span>
            </span>
          </button>

          <div className="dropdown-divider" />

          <button
            type="button"
            className="dropdown-item"
            role="menuitem"
            onClick={handleProfile}
          >
            Profil Admin
          </button>

          <button
            type="button"
            className="dropdown-item"
            role="menuitem"
            onClick={handlePassword}
          >
            Ganti Password
          </button>

          <div className="dropdown-divider" />

          <button
            type="button"
            className="dropdown-item logout-item"
            role="menuitem"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown