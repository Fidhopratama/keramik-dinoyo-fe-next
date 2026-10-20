'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Props = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: string
  invalid?: boolean
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  invalid,
}: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="p-input">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={invalid ? 'bad' : ''}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        type="button"
        className="p-eye"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}
