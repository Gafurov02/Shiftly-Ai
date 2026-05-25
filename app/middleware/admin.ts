export default defineNuxtRouteMiddleware(
    async () => {
        const supabase =
            useSupabaseClient()

        const {
            data: { user }
        } =
            await supabase.auth.getUser()

        if (!user?.email) {
            return navigateTo('/login')
        }

        const {
            data: employee,
            error
        } =
            await supabase
                .from('employees')
                .select('role')
                .eq(
                    'email',
                    user.email.trim()
                        .toLowerCase()
                )
                .maybeSingle()

        console.log(
            'ADMIN CHECK',
            {
                email: user.email,
                employee,
                error
            }
        )

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