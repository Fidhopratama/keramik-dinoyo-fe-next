'use client'

import useLogin from '../../../hooks/useLogin'

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin()

  return (
    <main className="login-page">
      <section className="login-card">
        <div
          className="login-logo"
          aria-label="Keramik Dinoyo"
          style={{
            background: '#fbf3ec',
            boxShadow: '0 10px 24px rgba(185, 111, 66, 0.22)',
            padding: 12,
          }}
        >
          <img
            src="/images/logodinoyo.png"
            alt="Logo Keramik Dinoyo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
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
          Dashboard Admin {'\u00B7'} Keramik Dinoyo
        </p>
      </section>
    </main>
  )
}
