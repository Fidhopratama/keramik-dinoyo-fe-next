'use client'

import { useEffect, useState } from 'react'

import api, { getMe } from '../services/api'
import { readSavedProfile, writeSavedProfile } from '../lib/profile'
import type { Notice } from '../types/common'
import type { ProfileData } from '../types/profile'

export default function useProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const show = (type: Notice['type'], text: string) => {
    setNotice({ type, text })
    window.setTimeout(() => setNotice(null), 3500)
  }

  useEffect(() => {
    const load = async () => {
      const saved = readSavedProfile()

      try {
        const response = await getMe()
        const user = response.data?.data ?? response.data ?? {}
        const imageUrl = [
          user.image_url,
          user.avatar_url,
          user.image,
          saved.imageUrl,
        ].find((value) => typeof value === 'string' && value.trim()) || ''

        setProfile({
          name: saved.nama || user.name || 'Admin',
          email: saved.email || user.email || '',
          phone: saved.telepon || user.phone || '',
          imageUrl,
        })
      } catch {
        setProfile({
          name: saved.nama || 'Admin',
          email: saved.email || '',
          phone: saved.telepon || '',
          imageUrl: saved.imageUrl || '',
        })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const save = async (data: ProfileData) => {
    setSaving(true)
    writeSavedProfile(data)
    setProfile({ ...data, imageUrl: profile.imageUrl })

    try {
      await api.put('/me', data)
      show('success', 'Profil berhasil disimpan.')
    } catch {
      show('success', 'Profil disimpan di perangkat ini. Server belum menerima perubahan.')
    } finally {
      setSaving(false)
    }

    return true
  }

  return { profile, loading, saving, notice, save }
}