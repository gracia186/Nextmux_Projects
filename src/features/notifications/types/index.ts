export interface NotificationItem {
  id: string
  type: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export interface NotificationsPage {
  data: NotificationItem[]
  current_page: number
  last_page: number
  total: number
}
