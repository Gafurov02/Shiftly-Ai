<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const auth = useAuthStore()

const handleJoin = async () => {
  auth.joinCompany()
  await navigateTo('/')
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

      <div
          class="relative z-10 min-h-screen flex flex-col justify-center"
      >
        <!-- Top -->
        <span
            class="inline-flex w-fit items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
        >
          🏢 Workspace Access
        </span>

        <h1
            class="text-[54px] font-bold leading-[0.95] mt-6"
        >
          Join your<br />
          company.
        </h1>

        <p
            class="text-zinc-400 text-lg mt-5 leading-relaxed"
        >
          Enter your invite code
          to access your workspace.
        </p>

        <!-- Code input -->
        <div class="mt-12">
          <div
              class="glass-card rounded-[34px] p-6 border border-white/5"
          >
            <input
                placeholder="GASTRO-2049"
                class="w-full bg-transparent outline-none text-center text-2xl tracking-[0.25em] font-semibold placeholder:text-zinc-600"
            />
          </div>
        </div>

        <!-- Workspace preview -->
        <div
            class="glass-card rounded-[34px] p-5 mt-6 border border-violet-500/10"
        >
          <div class="flex items-center gap-4">
            <div
                class="w-16 h-16 rounded-[24px] bg-violet-500/15 flex items-center justify-center text-2xl"
            >
              🍸
            </div>

            <div>
              <h3 class="font-semibold text-lg">
                Tot Samiy Gastropub
              </h3>

              <p class="text-zinc-500 text-sm">
                12 employees • Fergana
              </p>
            </div>
          </div>
        </div>

        <!-- Join -->
        <button
            class="continue-btn w-full"
            @click="handleJoin"
        >
          Join Workspace
        </button>

        <!-- Paste -->
        <button
            class="mt-5 text-violet-400 text-sm"
        >
          Paste code from clipboard
        </button>
      </div>
    </div>
  </div>
</template>
