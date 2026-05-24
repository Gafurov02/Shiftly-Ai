export default defineNuxtRouteMiddleware(
    async (to) => {
        const supabase = useSupabaseClient()

        const {
            data: { session }
        } = await supabase.auth.getSession()

        const publicRoutes = [
            '/onboarding',
            '/login'
        ]

        if (
            !session &&
            !publicRoutes.includes(to.path)
        ) {
            return navigateTo('/login')
        }

        if (
            session &&
            to.path === '/login'
        ) {
            return navigateTo('/')
        }
    }
)
