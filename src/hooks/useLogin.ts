
'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import api from '../services/api'
import {
  getLoginMessage,
  saveToken,
} from '../lib/login'
import type { LoginResponse } from '../types/login'

export default function useLogin() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    try {
      setLoading(true)
      setError('')

      const response = await api.post<LoginResponse>('/login', {
        email: email.trim(),
        password,
      })

      const token = response.data?.data?.token

      if (!token) {
        setError('Token login tidak ditemukan. Periksa respons API.')
        return
      }

      // Simpan token setelah login berhasil.
      saveToken(token)

      // Langsung masuk ke dashboard.
      router.replace('/dashboard')
    } catch (err: unknown) {
      console.error('Login error:', err)
      setError(getLoginMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  }
}
