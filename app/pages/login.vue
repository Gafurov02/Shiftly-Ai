<script setup lang="ts">
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')

const login = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const { error } =
        await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

    if (error) {
      errorMessage.value = error.message
      return
    }

    await navigateTo('/')
  } catch (err: unknown) {
    errorMessage.value =
        err instanceof Error
            ? err.message
            : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      class="min-h-screen bg-[#050505] flex justify-center overflow-hidden"
  >
    <div
        class="relative w-full max-w-[430px] min-h-screen px-6 py-10"
    >
      <!-- Glow -->
      <div
          class="absolute top-[-80px] left-[-100px] w-[220px] h-[220px] bg-violet-600/20 rounded-full blur-[120px]"
      />

      <div
          class="absolute bottom-[-80px] right-[-100px] w-[220px] h-[220px] bg-fuchsia-500/20 rounded-full blur-[120px]"
      />

      <div class="relative z-10 min-h-screen flex flex-col justify-center">
        <!-- Top -->
        <span
            class="inline-flex w-fit items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
        >
          🔐 Secure Login
        </span>

        <h1
            class="text-[54px] font-bold leading-[0.95] mt-6"
        >
          Welcome<br />
          back.
        </h1>

        <p
            class="text-zinc-400 text-lg mt-5 leading-relaxed"
        >
          Login to access your
          workplace, schedule
          and AI assistant.
        </p>

        <!-- Inputs -->
        <div class="mt-12 space-y-4">
          <div class="glass-card rounded-[30px] p-5">
            <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                class="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
            />
          </div>

          <div class="glass-card rounded-[30px] p-5 flex items-center justify-between">
            <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="Password"
                class="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
            />

            <span class="text-zinc-500 text-lg">
  ◉
</span>
          </div>
        </div>

        <!-- Login button -->
        <button
            class="continue-btn w-full relative z-50"
            @click="login"
            :disabled="loading || !email || !password"
        >
          {{ loading ? 'Loading...' : 'Login' }}
        </button>

        <p
            v-if="errorMessage"
            class="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {{ errorMessage }}
        </p>

        <!-- Divider -->
        <div
            class="flex items-center gap-4 my-8"
        >
          <div
              class="h-px bg-zinc-800 flex-1"
          />

          <span
              class="text-zinc-500 text-sm"
          >
            or
          </span>

          <div
              class="h-px bg-zinc-800 flex-1"
          />
        </div>

        <!-- Telegram -->
        <button
            class="glass-card rounded-[30px]
  p-5 w-full flex items-center
  justify-center gap-3
  border border-white/5
  hover:border-violet-500/20
  hover:scale-[1.01]
  transition-all"
        >
          ✈️ Continue with Telegram
        </button>

        <!-- Footer -->
        <p
            class="text-zinc-500 text-center mt-10 text-sm"
        >
          Join your workspace
          using company invite code.
        </p>
      </div>
    </div>
  </div>
</template>
