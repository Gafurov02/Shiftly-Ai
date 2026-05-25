export const useRole = () => {
    const supabase =
        useSupabaseClient()

    const role =
        useState<string | null>(
            'role',
            () => null
        )

    const isAdmin =
        computed(() =>
            role.value === 'admin'
        )

    const isManager =
        computed(() =>
            role.value === 'manager'
        )

    const loadRole =
        async () => {
            const {
                data: { user }
            } =
                await supabase
                    .auth
                    .getUser()

            if (!user?.email)
                return

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

            role.value =
                employee?.role ||
                'employee'
        }

    return {
        role,
        isAdmin,
        isManager,
        loadRole
    }
}