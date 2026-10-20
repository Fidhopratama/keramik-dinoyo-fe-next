import type { ProfileData } from '../types/profile'

export const SETTINGS_KEY = 'dinoyo_admin_settings'

export function readSavedProfile(): any {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Disimpan juga supaya nama di navbar ikut berubah.
export function writeSavedProfile(data: ProfileData) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        ...readSavedProfile(),
        nama: data.name,
        email: data.email,
        telepon: data.phone,
      }),
    )
    window.dispatchEvent(new Event('dinoyo-settings-updated'))
  } catch {}
}