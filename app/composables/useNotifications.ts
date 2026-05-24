import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

type Notification =
    Database['public']['Tables']['notifications']['Row']

let notificationsChannel: RealtimeChannel | null =
    null

export const useNotifications =
    () => {
        const supabase =
            useSupabaseClient<Database>()

        const notifications =
            useState<Notification[]>(
                'notifications',
                () => []
            )

        const unreadCount =
            computed(() =>
                notifications.value
                    .filter(
                        n => !n.is_read
                    ).length
            )

        const loadNotifications =
            async () => {
                const { data } =
                    await supabase
                        .from(
                            'notifications'
                        )
                        .select('*')
                        .order(
                            'created_at',
                            {
                                ascending:
                                    false
                            }
                        )

                notifications.value =
                    data || []
            }

        const markAsRead =
            async (id: string) => {
                await supabase
                    .from(
                        'notifications'
                    )
                    .update({
                        is_read: true
                    })
                    .eq('id', id)

                await
                    loadNotifications()
            }

        const startRealtime =
            async () => {
                await
                    loadNotifications()

                if (
                    !import.meta.client ||
                    notificationsChannel
                )
                    return

                notificationsChannel =
                    supabase
                        .channel(
                            'notifications'
                        )

                        .on(
                            'postgres_changes',
                            {
                                event: '*',
                                schema:
                                    'public',
                                table:
                                    'notifications'
                            },
                            async () => {
                                await
                                    loadNotifications()
                            }
                        )

                        .subscribe()
            }

        const stopRealtime =
            async () => {
                if (!notificationsChannel) {
                    return
                }

                await supabase.removeChannel(
                    notificationsChannel
                )

                notificationsChannel = null
            }

        return {
            notifications,
            unreadCount,
            markAsRead,
            startRealtime,
            stopRealtime
        }
    }
