import { CheckCircle2, Clock, Sparkles, TriangleAlert } from 'lucide-react'

type Props = {
  total: number
  waiting: number
  good: number
  bad: number
}

export default function VerificationStats({ total, waiting, good, bad }: Props) {
  const stats = [
    { label: 'Total analisis', value: total, Icon: Sparkles, cls: '' },
    { label: 'Menunggu', value: waiting, Icon: Clock, cls: 'wait' },
    { label: 'Lolos', value: good, Icon: CheckCircle2, cls: 'good' },
    { label: 'Perlu dicek', value: bad, Icon: TriangleAlert, cls: 'bad' },
  ]

  return (
    <div className="v-stats">
      {stats.map(({ label, value, Icon, cls }) => (
        <div className="v-stat" key={label}>
          <div className={`v-stat-icon ${cls}`}>
            <Icon size={22} aria-hidden="true" />
          </div>
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}