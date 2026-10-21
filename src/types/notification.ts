export type NoticeKind = 'shop' | 'product' | 'workshop' | 'ai'

export type AppNotification = {
  id: string
  kind: NoticeKind
  title: string
  text: string
  time: number
}
