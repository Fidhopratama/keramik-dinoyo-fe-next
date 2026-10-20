import { Check } from 'lucide-react'

import { getPasswordRules, strengthOf } from '../../../lib/password'

export default function PasswordStrength({ value }: { value: string }) {
  const strength = strengthOf(value)
  const rules = getPasswordRules(value)

  return (
    <>
      {value && (
        <div className="p-meter">
          <div className="p-meter-bar">
            <i
              style={{
                width: `${(strength.score / 4) * 100}%`,
                background: strength.color,
              }}
            />
          </div>
          <span style={{ color: strength.color }}>{strength.label}</span>
        </div>
      )}

      <ul className="p-rules">
        {rules.map((rule) => (
          <li key={rule.text} className={rule.ok ? 'ok' : ''}>
            <Check size={13} aria-hidden="true" />
            {rule.text}
          </li>
        ))}
      </ul>
    </>
  )
}
