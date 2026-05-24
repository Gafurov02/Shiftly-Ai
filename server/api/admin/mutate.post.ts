import type { Database } from '~/types/database.types'

type EmployeeInsert =
    Database['public']['Tables']['employees']['Insert']

type AdminAction =
  | {
      action: 'createAnnouncement'
      payload: {
        title?: unknown
        content?: unknown
        authorName?: unknown
        authorRole?: unknown
        isPinned?: unknown
        notifyTeam?: unknown
      }
    }
  | {
      action: 'deleteAnnouncement'
      payload: {
        id?: unknown
      }
    }
  | {
      action: 'createShift'
      payload: {
        employeeId?: unknown
        shiftDate?: unknown
        role?: unknown
        startTime?: unknown
        endTime?: unknown
      }
    }
  | {
      action: 'deleteShift'
      payload: {
        id?: unknown
      }
    }
  | {
      action: 'createEmployee'
      payload: {
        email?: unknown
        fullName?: unknown
        role?: unknown
        emoji?: unknown
        shiftStart?: unknown
        shiftEnd?: unknown
      }
    }
  | {
      action: 'setEmployeeStatus'
      payload: {
        id?: unknown
        status?: unknown
      }
    }
  | {
      action: 'createNotification'
      payload: {
        title?: unknown
        message?: unknown
      }
    }
  | {
      action: 'deleteNotification'
      payload: {
        id?: unknown
      }
    }

const optionalText =
    (value: unknown, fallback = '') => {
      return typeof value === 'string' && value.trim()
          ? value.trim()
          : fallback
    }

const throwIfError =
    (error: { message: string } | null) => {
      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage:
              error.message
        })
      }
    }

export default defineEventHandler(
    async (event) => {
      const supabase =
          await requireAdminClient(event)
      const body =
          await readBody<AdminAction>(event)

      if (!body?.action || !body.payload) {
        throw createError({
          statusCode: 400,
          statusMessage:
              'Admin action is required.'
        })
      }

      if (body.action === 'createAnnouncement') {
        const title =
            requireText(body.payload.title, 'Title')
        const content =
            requireText(body.payload.content, 'Content')

        const { error } =
            await supabase
                .from('announcements')
                .insert({
                  title,
                  content,
                  author_name:
                      optionalText(
                          body.payload.authorName,
                          'Shiftly Admin'
                      ),
                  author_role:
                      optionalText(
                          body.payload.authorRole,
                          'Operations'
                      ),
                  is_pinned:
                      Boolean(body.payload.isPinned),
                  created_at:
                      new Date().toISOString()
                })

        throwIfError(error)

        if (Boolean(body.payload.notifyTeam)) {
          const { error: notificationError } =
              await supabase
                  .from('notifications')
                  .insert({
                    title,
                    message: content,
                    is_read: false,
                    created_at:
                        new Date().toISOString()
                  })

          throwIfError(notificationError)
        }

        return {
          ok: true
        }
      }

      if (body.action === 'deleteAnnouncement') {
        const id =
            requireText(body.payload.id, 'Announcement id')

        const { error } =
            await supabase
                .from('announcements')
                .delete()
                .eq('id', id)

        throwIfError(error)

        return {
          ok: true
        }
      }

      if (body.action === 'createShift') {
        const employeeId =
            requireText(body.payload.employeeId, 'Employee')
        const shiftDate =
            requireText(body.payload.shiftDate, 'Shift date')
        const startTime =
            requireText(body.payload.startTime, 'Start time')
        const endTime =
            requireText(body.payload.endTime, 'End time')

        const { data: employee } =
            await supabase
                .from('employees')
                .select('role')
                .eq('id', employeeId)
                .single()

        const { error } =
            await supabase
                .from('shifts')
                .insert({
                  employee_id: employeeId,
                  shift_date: shiftDate,
                  role:
                      optionalText(
                          body.payload.role,
                          employee?.role || 'staff'
                      ),
                  start_time: startTime,
                  end_time: endTime,
                  created_at:
                      new Date().toISOString()
                })

        throwIfError(error)

        return {
          ok: true
        }
      }

      if (body.action === 'deleteShift') {
        const id =
            requireText(body.payload.id, 'Shift id')

        const { error } =
            await supabase
                .from('shifts')
                .delete()
                .eq('id', id)

        throwIfError(error)

        return {
          ok: true
        }
      }

      if (body.action === 'createEmployee') {
        const payload: EmployeeInsert = {
          email:
              requireText(body.payload.email, 'Email'),
          full_name:
              requireText(body.payload.fullName, 'Full name'),
          role:
              optionalText(body.payload.role, 'staff'),
          emoji:
              optionalText(body.payload.emoji, '👤'),
          shift_start:
              optionalText(body.payload.shiftStart) || null,
          shift_end:
              optionalText(body.payload.shiftEnd) || null,
          status: 'offline',
          is_online: false,
          is_working: false,
          created_at:
              new Date().toISOString()
        }

        const { error } =
            await supabase
                .from('employees')
                .insert(payload)

        throwIfError(error)

        return {
          ok: true
        }
      }

      if (body.action === 'setEmployeeStatus') {
        const id =
            requireText(body.payload.id, 'Employee id')
        const status =
            requireText(body.payload.status, 'Status')

        if (
            ![
              'working',
              'break',
              'offline'
            ].includes(status)
        ) {
          throw createError({
            statusCode: 400,
            statusMessage:
                'Unsupported employee status.'
          })
        }

        const { error } =
            await supabase
                .from('employees')
                .update({
                  status,
                  is_online: status !== 'offline',
                  is_working: status === 'working',
                  last_activity:
                      new Date().toISOString()
                })
                .eq('id', id)

        throwIfError(error)

        return {
          ok: true
        }
      }

      if (body.action === 'createNotification') {
        const title =
            requireText(body.payload.title, 'Title')
        const message =
            requireText(body.payload.message, 'Message')

        const { error } =
            await supabase
                .from('notifications')
                .insert({
                  title,
                  message,
                  is_read: false,
                  created_at:
                      new Date().toISOString()
                })

        throwIfError(error)

        return {
          ok: true
        }
      }

      if (body.action === 'deleteNotification') {
        const id =
            requireText(body.payload.id, 'Notification id')

        const { error } =
            await supabase
                .from('notifications')
                .delete()
                .eq('id', id)

        throwIfError(error)

        return {
          ok: true
        }
      }

      throw createError({
        statusCode: 400,
        statusMessage:
            'Unsupported admin action.'
      })
    }
)
