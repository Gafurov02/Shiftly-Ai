<template>
  <div
      class="min-h-screen bg-[#050505] flex justify-center overflow-hidden"
  >
    <!-- glow -->
    <div
        class="fixed top-[-120px] left-[-120px]
      w-[260px] h-[260px]
      bg-violet-600/20
      rounded-full blur-[140px]"
    />

    <div
        class="fixed bottom-[-120px] right-[-120px]
      w-[260px] h-[260px]
      bg-fuchsia-500/20
      rounded-full blur-[140px]"
    />

    <div
        class="relative w-full
      max-w-[430px]
      min-h-screen px-6"
    >
      <slot />
    </div>
  </div>
</template>