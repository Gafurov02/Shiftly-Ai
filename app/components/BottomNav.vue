<script setup lang="ts">
const route = useRoute()

const navItems = [
  {
    name: 'Home',
    icon: '🏠',
    path: '/'
  },
  {
    name: 'Schedule',
    icon: '📅',
    path: '/schedule'
  },
  {
    name: 'AI',
    icon: '✨',
    path: '/ai'
  },
  {
    name: 'Team',
    icon: '💬',
    path: '/team'
  },
  {
    name: 'Profile',
    icon: '👤',
    path: '/profile'
  },
  {
    name: 'Alerts',
    icon: '🔔',
    path: '/notifications'
  },
  {
    name: 'Feed',
    icon: '📢',
    path: '/feed'
  },
  {
    name: 'Admin',
    icon: '🛠',
    path: '/admin'
  }
]

const {
  unreadCount,
  startRealtime
} = useNotifications()

onMounted(() => {
  startRealtime()
})
</script>

<template>
  <div
      class="fixed bottom-0 left-1/2
    -translate-x-1/2
    w-full max-w-[430px]
    z-[999]"
  >
    <div
        class="backdrop-blur-3xl
      bg-[#090909]/85
      border-t border-white/10
      px-4 py-4"
    >
      <div
          class="flex items-center
        justify-around"
      >
        <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex flex-col
  items-center
  transition-all duration-300"
            :class="
    route.path === item.path
      ? 'text-violet-400'
      : 'text-zinc-500 hover:text-zinc-300'
  "
        >
          <div class="relative">
    <span class="text-[22px]">
      {{ item.icon }}
    </span>

            <!-- badge only for notifications -->
            <div
                v-if="
        item.path ===
        '/notifications'
        &&
        unreadCount > 0
      "
                class="absolute
      -top-2 -right-2
      min-w-[20px]
      h-5 px-1
      rounded-full
      bg-red-500
      text-white
      text-[11px]
      flex items-center
      justify-center
      font-bold"
            >
              {{ unreadCount }}
            </div>
          </div>

          <span
              class="text-[11px] mt-1"
          >
    {{ item.name }}
  </span>

          <div
              v-if="
      route.path === item.path
    "
              class="w-1.5 h-1.5
    rounded-full
    bg-violet-400 mt-1"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
