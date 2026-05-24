export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type TableDefinition<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

type EmployeeRow = {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  emoji: string | null
  status: 'working' | 'break' | 'offline' | string | null
  shift_start: string | null
  shift_end: string | null
  is_online: boolean | null
  is_working: boolean | null
  last_activity: string | null
  created_at: string | null
}

type EmployeeInsert = Partial<EmployeeRow> & {
  id?: string
}

type ShiftRow = {
  id: string
  employee_id: string | null
  shift_date: string | null
  role: string | null
  start_time: string | null
  end_time: string | null
  created_at: string | null
}

type ShiftInsert = Partial<ShiftRow> & {
  id?: string
}

type ActivityLogRow = {
  id: string
  employee_id: string
  action: 'clock_in' | 'break' | 'clock_out' | string
  created_at: string | null
}

type ActivityLogInsert = {
  id?: string
  employee_id: string
  action: ActivityLogRow['action']
  created_at?: string | null
}

type NotificationRow = {
  id: string
  title: string | null
  message: string | null
  is_read: boolean | null
  created_at: string | null
}

type NotificationInsert = Partial<NotificationRow> & {
  id?: string
}

type AnnouncementRow = {
  id: string
  title: string | null
  content: string | null
  author_name: string | null
  author_role: string | null
  is_pinned: boolean | null
  created_at: string | null
}

type AnnouncementInsert = Partial<AnnouncementRow> & {
  id?: string
}

export type Database = {
  public: {
    Tables: {
      employees: TableDefinition<EmployeeRow, EmployeeInsert>
      shifts: TableDefinition<ShiftRow, ShiftInsert>
      activity_logs: TableDefinition<ActivityLogRow, ActivityLogInsert>
      notifications: TableDefinition<NotificationRow, NotificationInsert>
      announcements: TableDefinition<AnnouncementRow, AnnouncementInsert>
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
