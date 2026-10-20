export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'http://127.0.0.1:5050'

// Ambil daftar dari berbagai bentuk balasan API.
export function toList(response: any): any[] {
  const body = response?.data?.data ?? response?.data

  if (Array.isArray(body)) return body
  if (Array.isArray(body?.items)) return body.items

  return []
}

export function getMessage(err: any, fallback: string): string {
  return err?.response?.data?.message || fallback
}
