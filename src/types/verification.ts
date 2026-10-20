export type Tone = 'good' | 'bad' | 'wait'

export type Row = {
  key: string | number
  name: string
  summary: string
  score: number | null
  tone: Tone
  date: string
}

export type TabKey = 'all' | Tone
