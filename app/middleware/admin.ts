export default defineNuxtRouteMiddleware(
    async () => {
        const supabase =
            useSupabaseClient()

        const {
            data: { user }
        } =
            await supabase
                .auth
                .getUser()

        if (!user?.email) {
            return navigateTo(
                '/login'
            )
        }

        const {
            data: employee
        } =
            await supabase
                .from(
                    'employees'
                )
                .select('role')
                .eq(
                    'email',
                    user.email
                )
                .single()

        const allowed =
            employee?.role ===
            'admin' ||
            employee?.role ===
            'manager'

        if (!allowed) {
            return navigateTo('/')
        }
    }
)