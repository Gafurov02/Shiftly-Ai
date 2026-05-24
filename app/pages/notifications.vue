<script setup lang="ts">
const {
  notifications,
  markAsRead,
  startRealtime
} = useNotifications()

onMounted(() => {
  startRealtime()
})
</script>

<template>
  <div
      class="min-h-screen
    bg-[#050505]
    px-6 pt-10
    max-w-[430px]
    mx-auto"
  >
    <h1
        class="text-5xl
      font-bold mb-6"
    >
      Notifications.
    </h1>

    <div
        class="space-y-4"
    >
      <div
          v-for="n in notifications"
          :key="n.id"
          @click="
          markAsRead(n.id)
        "
          class="glass-card
        rounded-[28px]
        p-5 cursor-pointer"
      >
        <div
            class="flex justify-between"
        >
          <h3
              class="font-semibold"
          >
            {{ n.title }}
          </h3>

          <div
              v-if="!n.is_read"
              class="w-2.5 h-2.5
            rounded-full
            bg-red-500"
          />
        </div>

        <p
            class="text-zinc-400
          mt-2"
        >
          {{ n.message }}
        </p>
      </div>
    </div>
  </div>
</template>