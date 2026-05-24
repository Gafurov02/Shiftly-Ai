<template>
  <div
      class="min-h-screen bg-[#050505] flex justify-center overflow-hidden"
  >
    <div
        class="relative w-full max-w-[430px] min-h-screen px-6 py-10 overflow-hidden"
    >
      <!-- Glow -->
      <div
          class="absolute top-[-100px] left-[-100px] w-[260px] h-[260px] bg-violet-600/20 rounded-full blur-[120px]"
      />

      <div
          class="absolute bottom-[-80px] right-[-80px] w-[220px] h-[220px] bg-fuchsia-500/20 rounded-full blur-[120px]"
      />

      <div
          class="relative z-10 h-full flex flex-col justify-between"
      >
        <!-- Top -->
        <div class="mt-10">
  <span
      class="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
  >
    ✨ AI-powered workplace
  </span>

          <h1
              class="text-[58px] font-bold mt-6 leading-[0.95]"
          >
            Your staff,<br />
            smarter.
          </h1>

          <p
              class="text-zinc-400 text-lg mt-5 leading-relaxed"
          >
            Scheduling, AI assistant,
            teamwork and operations —
            all in one place.
          </p>
        </div>

        <!-- Features -->
        <div class="mt-12 space-y-4">
          <div
              class="glass-card rounded-[34px] p-5 flex items-center gap-4"
          >
            <div
                class="w-14 h-14 rounded-[20px] bg-violet-500/15 flex items-center justify-center text-2xl"
            >
              🤖
            </div>

            <div>
              <h3 class="font-semibold">
                AI Assistant
              </h3>

              <p
                  class="text-zinc-500 text-sm mt-1"
              >
                Recipes, standards & help
              </p>
            </div>
          </div>

          <div
              class="glass-card rounded-[34px] p-5 flex items-center gap-4"
          >
            <div
                class="w-14 h-14 rounded-[20px] bg-emerald-500/15 flex items-center justify-center text-2xl"
            >
              📅
            </div>

            <div>
              <h3 class="font-semibold">
                Smart Scheduling
              </h3>

              <p
                  class="text-zinc-500 text-sm mt-1"
              >
                Shifts, swaps & reminders
              </p>
            </div>
          </div>

          <div
              class="glass-card rounded-[34px] p-5 flex items-center gap-4"
          >
            <div
                class="w-14 h-14 rounded-[20px] bg-cyan-500/15 flex items-center justify-center text-2xl"
            >
              👥
            </div>

            <div>
              <h3 class="font-semibold">
                Team Collaboration
              </h3>

              <p
                  class="text-zinc-500 text-sm mt-1"
              >
                Chat, updates & teamwork
              </p>
            </div>
          </div>
        </div>

        <!-- Button -->
        <NuxtLink
            to="/login"
            class="block mt-12 mb-10"
        >
          <div
              class="continue-btn flex items-center justify-center"
          >
            Continue
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>