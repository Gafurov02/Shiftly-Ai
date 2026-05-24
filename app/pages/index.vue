<template>
  <div class="px-5 pt-8">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-zinc-500">
          Good evening 👋
        </p>

        <h1
            class="text-4xl font-bold mt-1"
        >
          Gafurov
        </h1>
      </div>

      <div
          class="w-12 h-12 rounded-full glass-card flex items-center justify-center"
      >
        🍸
      </div>
    </div>

    <div
        class="glass-card rounded-[40px] p-7 mt-8 overflow-hidden relative border border-white/10"
    >
      <div
          class="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 blur-[70px]"
      />

      <div class="relative z-10">
        <p
            class="text-zinc-400 text-sm"
        >
          Today Shift
        </p>

        <h2
            class="text-[38px] font-bold mt-3"
        >
          10:00
          <span class="text-zinc-500">
            —
          </span>
          23:30
        </h2>

        <div
            class="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2"
        >
          <div
              class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
          />

          <span
              class="text-emerald-400 text-sm"
          >
            You are on shift today
          </span>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div
          class="glass-card rounded-[30px] p-5"
      >
        <div
            class="flex items-center justify-between"
        >
          <h3 class="font-semibold">
            Updates
          </h3>

          <span
              class="text-xs text-zinc-500"
          >
        today
      </span>
        </div>

        <div class="mt-4 space-y-4">
          <div
              class="flex items-center gap-3"
          >
            <div
                class="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center"
            >
              🍹
            </div>

            <div>
              <p class="font-medium">
                New cocktail menu
              </p>

              <p
                  class="text-zinc-500 text-sm"
              >
                Summer drinks added
              </p>
            </div>
          </div>

          <div
              class="flex items-center gap-3"
          >
            <div
                class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
            >
              📋
            </div>

            <div>
              <p class="font-medium">
                Inventory at 22:00
              </p>

              <p
                  class="text-zinc-500 text-sm"
              >
                Please be prepared
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div
          class="flex justify-between items-center"
      >
        <h3
            class="font-semibold text-xl"
        >
          Quick Actions
        </h3>

        <span
            class="text-violet-400 text-sm"
        >
          See all
        </span>
      </div>

      <div
          class="grid grid-cols-2 gap-4 mt-4"
      >
        <div
            class="glass-card rounded-[32px] p-5 h-36 flex flex-col justify-between"
        >
          <div class="text-3xl">
            ✨
          </div>

          <div>
            <h4 class="font-medium">
              AI Assistant
            </h4>

            <p
                class="text-zinc-500 text-sm mt-1"
            >
              Ask anything
            </p>
          </div>
        </div>

        <div
            class="glass-card rounded-[32px] p-5 h-36 flex flex-col justify-between"
        >
          <div class="text-3xl">
            📚
          </div>

          <div>
            <h4 class="font-medium">
              Standards
            </h4>

            <p
                class="text-zinc-500 text-sm mt-1"
            >
              Rules & docs
            </p>
          </div>
        </div>

        <div
            class="glass-card rounded-[32px] p-5 h-36 flex flex-col justify-between"
        >
          <div class="text-3xl">
            🔄
          </div>

          <div>
            <h4 class="font-medium">
              Swap Shift
            </h4>

            <p
                class="text-zinc-500 text-sm mt-1"
            >
              Find replacement
            </p>
          </div>
        </div>

        <div
            class="glass-card rounded-[32px] p-5 h-36 flex flex-col justify-between"
        >
          <div class="text-3xl">
            ☕
          </div>

          <div>
            <h4 class="font-medium">
              Recipes
            </h4>

            <p
                class="text-zinc-500 text-sm mt-1"
            >
              Drinks guide
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile'
})
</script>