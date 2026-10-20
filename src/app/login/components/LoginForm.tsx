'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

import api from '../../../services/api'

import type {
  LoginErrorResponse,
  LoginResponse,
} from './loginTypes'

export default function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('admin@keramikdinoyo.test')
  const [password, setPassword] = useState('password')
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

      localStorage.setItem('keramik_dinoyo_token', token)

      router.push('/')
    } catch (err: unknown) {
      console.error('Login error:', err)

      const loginError = err as LoginErrorResponse

      setError(
        loginError.response?.data?.message ||
          'Login gagal. Periksa email dan password kamu.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo" aria-label="Keramik Dinoyo">
          K
        </div>

        <h1>Keramik Dinoyo</h1>

        <p className="login-description">
          Masuk ke dashboard administrator.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="login-divider">
          <span />
          <span className="login-divider-text">ADMINISTRATOR</span>
          <span />
        </div>

        <p className="login-note">
          Dashboard Admin · Keramik Dinoyo
        </p>
      </section>
    </main>
  )
}