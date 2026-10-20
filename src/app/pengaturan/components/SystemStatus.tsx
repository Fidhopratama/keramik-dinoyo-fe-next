'use client'

import { useCallback, useEffect, useState } from 'react'
import { Server } from 'lucide-react'

import { getDashboard } from '../../../services/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5050/api'

export default function SystemStatus() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail'>('checking')

  const check = useCallback(async () => {
    setStatus('checking')
    try {
      await getDashboard()
      setStatus('ok')
    } catch {
      setStatus('fail')
    }
  }, [])

  useEffect(() => {
    check()
  }, [check])

  const text =
    status === 'checking'
      ? 'Memeriksa koneksi...'
      : status === 'ok'
        ? 'Terhubung ke server'
        : 'Tidak terhubung ke server'

  return (
    <section className="st-card">
      <header className="st-card-head">
        <div className="st-icon">
          <Server size={20} aria-hidden="true" />
        </div>
        <div>
          <h3>Sistem</h3>
          <p>Status koneksi dan informasi aplikasi.</p>
        </div>
      </header>

      <div className="st-body">
        <div className="st-row">
          <div>
            <span className="st-status">
              <i className={`st-dot ${status}`} />
              {text}
            </span>
            <p>Alamat server: {API_BASE}</p>
          </div>
          <button type="button" className="st-btn outline" onClick={check}>
            Cek ulang
          </button>
        </div>

        <dl className="st-info">
          <dt>Aplikasi</dt>
          <dd>Keramik Dinoyo Admin Dashboard</dd>
          <dt>Versi</dt>
          <dd>1.0.0</dd>
        </dl>
      </div>
    </section>
  )
}