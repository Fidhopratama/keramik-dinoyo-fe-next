import type { LoginErrorResponse } from '../types/login'

export const TOKEN_KEY = 'keramik_dinoyo_token'

// Isian awal formulir. Kosongkan sebelum aplikasi dipakai sungguhan.
export const DEFAULT_EMAIL = 'admin@keramikdinoyo.test'
export const DEFAULT_PASSWORD = 'password'

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getLoginMessage(err: unknown): string {
  const loginError = err as LoginErrorResponse

  return (
    loginError?.response?.data?.message ||
    'Login gagal. Periksa email dan password kamu.'
  )
}
