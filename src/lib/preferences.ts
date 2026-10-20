import type { Prefs } from '../types/preferences'

export const PREF_KEY = 'keramik_dinoyo_preferences'

export const DEFAULT_PREFS: Prefs = {
  notifications: true,
  notifWorkshop: true,
  notifProduct: true,
  notifAi: true,
  language: 'id',
  perPage: '10',
}

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREF_KEY)
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(prefs: Prefs): boolean {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
    return true
  } catch {
    return false
  }
}
