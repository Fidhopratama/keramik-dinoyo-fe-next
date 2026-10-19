'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PengaturanPage() {
  const router = useRouter()

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get('section')

    if (section === 'password') {
      router.replace('/ganti-password')
    } else {
      router.replace('/profil')
    }
  }, [router])

  return null
}