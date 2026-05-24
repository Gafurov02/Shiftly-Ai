export default defineEventHandler(
    async (event) => {
      const supabase =
          await requireAdminClient(event)

      const [
        employeeResult,
        shiftResult,
        announcementResult,
        notificationResult
      ] = await Promise.all([
        supabase
            .from('employees')
            .select('*')
            .order('full_name', {
              ascending: true
            }),
        supabase
            .from('shifts')
            .select('*')
            .order('shift_date', {
              ascending: true
            })
            .order('start_time', {
              ascending: true
            }),
        supabase
            .from('announcements')
            .select('*')
            .order('is_pinned', {
              ascending: false
            })
            .order('created_at', {
              ascending: false
            }),
        supabase
            .from('notifications')
            .select('*')
            .order('created_at', {
              ascending: false
            })
      ])

      const error = [
        employeeResult.error,
        shiftResult.error,
        announcementResult.error,
        notificationResult.error
      ].find(Boolean)

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage:
              error.message
        })
      }

      return {
        employees:
            employeeResult.data || [],
        shifts:
            shiftResult.data || [],
        announcements:
            announcementResult.data || [],
        notifications:
            notificationResult.data || []
      }
    }
)
