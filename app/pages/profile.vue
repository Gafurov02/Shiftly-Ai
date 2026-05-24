<script setup lang="ts">
import type { Database } from '~/types/database.types'

type Employee = Database['public']['Tables']['employees']['Row']

const supabase = useSupabaseClient<Database>()

const employee = ref<Employee | null>(null)
const profileError = ref('')

const loadProfile = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email) {
    profileError.value = 'User session not found'
    return
  }

  const { data, error } =
      await supabase
          .from('employees')
          .select('*')
          .eq('email', user.email)
          .single()

  if (error) {
    profileError.value = error.message
    return
  }

  employee.value = data
}

onMounted(() => {
  void loadProfile()
})

const formatTime = (time?: string | null) => {
  if (!time) return '--:--'
  return time.slice(0, 5)
}

const initials = computed(() => {
  const name = employee.value?.full_name?.trim()

  if (!name) {
    return 'G'
  }

  return name
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
})

const statusLabel = computed(() => {
  if (employee.value?.is_working) {
    return 'Working now'
  }

  if (employee.value?.is_online) {
    return 'Online'
  }

  return 'Offline'
})

const statusClass = computed(() => {
  if (employee.value?.is_working) {
    return 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,.7)]'
  }

  if (employee.value?.is_online) {
    return 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,.7)]'
  }

  return 'bg-zinc-600'
})

const logout = async () => {
  await supabase.auth.signOut()

  await navigateTo('/login')
}
</script>

<template>
  <div
      class="min-h-screen bg-[#050505]
    max-w-[430px]
    mx-auto
    px-6
    pt-10
    pb-[220px]"
  >
    <!-- Header -->
    <div class="mb-8">
      <span
          class="inline-flex rounded-full
        border border-violet-500/20
        bg-violet-500/10
        px-4 py-2 text-sm
        text-violet-300"
      >
        👤 Staff Profile
      </span>

      <h1 class="text-5xl font-bold mt-5">
        Your account.
      </h1>

      <p class="text-zinc-400 mt-3 text-lg">
        Personal info,
        settings & access.
      </p>

      <p
          v-if="profileError"
          class="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ profileError }}
      </p>
    </div>

    <!-- Profile Card -->
    <div
        class="glass-card rounded-[34px]
      p-6 border border-white/10
      bg-white/[0.03]
      shadow-[0_0_50px_rgba(168,85,247,.08)]
      mb-6"
    >
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div
            class="w-20 h-20 rounded-full
          bg-gradient-to-br
          from-violet-600
          to-fuchsia-500
          flex items-center justify-center
          text-3xl font-bold
          shadow-[0_0_35px_rgba(168,85,247,.35)]"
        >
          {{ initials }}
        </div>

        <div class="flex-1">
          <h2
              class="text-2xl font-bold"
          >
            {{
              employee?.full_name
              || 'Employee'
            }}
          </h2>

          <p
              class="text-zinc-400 capitalize mt-1"
          >
            {{
              employee?.role
              || 'No role'
            }}
          </p>

          <div
              class="flex items-center gap-2 mt-2"
          >
            <div
                class="w-2.5 h-2.5 rounded-full
              "
                :class="statusClass"
            />

            <span class="text-sm text-zinc-400">
  {{ statusLabel }}
</span>
          </div>
        </div>
      </div>

      <!-- Shift -->
      <div
          class="grid grid-cols-2 gap-3 mt-6"
      >
        <div
            class="glass-card rounded-[24px]
          p-4"
        >
          <p
              class="text-zinc-500 text-sm"
          >
            Shift
          </p>

          <h3
              class="font-semibold mt-2"
          >
            {{
              formatTime(
                  employee?.shift_start
              )
            }}
            —
            {{
              formatTime(
                  employee?.shift_end
              )
            }}
          </h3>
        </div>

        <div
            class="glass-card rounded-[24px]
          p-4"
        >
          <p
              class="text-zinc-500 text-sm"
          >
            Email
          </p>

          <h3
              class="font-semibold mt-2 truncate"
          >
            {{
              employee?.email
              || 'No email'
            }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="mb-6">
      <h3
          class="text-xl font-semibold mb-4"
      >
        Settings
      </h3>

      <div class="space-y-3">
        <div
            class="glass-card rounded-[28px]
          p-5 flex justify-between
          items-center"
        >
          <span>
            🔔 Notifications
          </span>

          <span
              class="text-zinc-500"
          >
            Enabled
          </span>
        </div>

        <div
            class="glass-card rounded-[28px]
          p-5 flex justify-between
          items-center"
        >
          <span>
            🌙 Dark mode
          </span>

          <span
              class="text-zinc-500"
          >
            Active
          </span>
        </div>

        <div
            class="glass-card rounded-[28px]
          p-5 flex justify-between
          items-center"
        >
          <span>
            🌐 Language
          </span>

          <span
              class="text-zinc-500"
          >
            English
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
        class="grid grid-cols-2 gap-3"
    >
      <button
          class="glass-card rounded-[28px]
        py-4 text-zinc-300"
      >
        Edit Profile
      </button>

      <button
          @click="logout"
          class="bg-gradient-to-r
        from-violet-600
        to-fuchsia-500
        rounded-[28px]
        py-4 text-white
        shadow-[0_0_30px_rgba(168,85,247,.35)]"
      >
        Logout
      </button>
    </div>
  </div>
</template>
