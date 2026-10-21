'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import api from '../services/api'
import {
  DEFAULT_EMAIL,
  DEFAULT_PASSWORD,
  getLoginMessage,
  saveToken,
} from '../lib/login'
import type { LoginResponse } from '../types/login'

export default function useLogin() {
  const router = useRouter()

  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
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

      saveToken(token)

      router.push('/')
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
