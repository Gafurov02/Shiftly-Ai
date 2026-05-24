<template>
  <div
      class="min-h-screen bg-[#050505] text-white flex justify-center overflow-hidden"
  >
    <div
        class="fixed inset-0 pointer-events-none"
    >
      <div
          class="absolute top-[-120px] left-[-100px] w-[320px] h-[320px] bg-violet-700/25 rounded-full blur-[120px]"
      />

      <div
          class="absolute bottom-[120px] right-[-120px] w-[280px] h-[280px] bg-fuchsia-600/20 rounded-full blur-[120px]"
      />
    </div>

    <div
        class="relative w-full max-w-[430px] min-h-screen border-x border-white/5 bg-black/50 backdrop-blur-xl"
    >
      <main class="pb-32">
        <slot />
      </main>

      <BottomNav />
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomNav from '~/components/BottomNav.vue'
</script>