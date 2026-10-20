import type { PasswordRule, Strength } from '../types/password'

export function strengthOf(value: string): Strength {
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

export function getPasswordRules(value: string): PasswordRule[] {
  return [
    { ok: value.length >= 8, text: 'Minimal 8 karakter' },
    {
      ok: /[a-z]/.test(value) && /[A-Z]/.test(value),
      text: 'Kombinasi huruf besar dan kecil',
    },
    { ok: /\d/.test(value), text: 'Mengandung angka' },
  ]
}
