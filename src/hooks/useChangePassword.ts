'use client'

import { useState } from 'react'

import api from '../services/api'
import type { Notice } from '../types/common'

// Alamat dicoba berurutan. Berhenti di yang pertama ada di server.
const ENDPOINTS: { method: 'put' | 'post'; url: string }[] = [
  { method: 'put', url: '/me/password' },
  { method: 'post', url: '/change-password' },
  { method: 'put', url: '/change-password' },
]

export default function useChangePassword(onSuccess?: () => void) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Notice | null>(null)

  const submit = async (current: string, next: string) => {
    setSaving(true)
    setMessage(null)

    const payload = {
      current_password: current,
      new_password: next,
      password: next,
      password_confirmation: next,
      currentPassword: current,
      newPassword: next,
    }

    for (const endpoint of ENDPOINTS) {
      try {
        await api.request({ method: endpoint.method, url: endpoint.url, data: payload })

        setSaving(false)
        setMessage({ type: 'success', text: 'Password berhasil diubah.' })
        onSuccess?.()
        return
      } catch (err: any) {
        const code = err?.response?.status

        // Alamat tidak ada di server: coba alamat berikutnya.
        if (code === 404 || code === 405) continue

        // Server menjawab (mis. password lama salah): tampilkan pesannya.
        setSaving(false)
        setMessage({
          type: 'error',
          text:
            err?.response?.data?.message ||
            'Password gagal diubah. Periksa password saat ini.',
        })
        return
      }
    }

    setSaving(false)
    setMessage({
      type: 'error',
      text: 'Fitur ganti password belum tersedia di server. Hubungi pengembang backend.',
    })
  }

  return { saving, message, submit }
}
