export type WorkshopStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type Workshop = {
  id: number | string
  title?: string
  description?: string
  instructor?: string
  date?: string
  start_time?: string
  end_time?: string
  capacity?: number
  location?: string
  status?: WorkshopStatus | string
  image?: string | null
  image_url?: string | null
}

export type WorkshopFormData = {
  title: string
  description: string
  instructor: string
  date: string
  start_time: string
  end_time: string
  capacity: number | string
  location: string
  status: string
}
