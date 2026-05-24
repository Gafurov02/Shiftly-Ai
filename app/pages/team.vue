<script setup lang="ts">
const search = ref('')

const teamMembers = [
  {
    name: 'Bekzod',
    role: 'Bar',
    emoji: '🍹',
    status: 'Working',
    online: true
  },
  {
    name: 'Aziz',
    role: 'Kitchen',
    emoji: '👨‍🍳',
    status: 'Break',
    online: true
  },
  {
    name: 'Madina',
    role: 'Hall',
    emoji: '💁‍♀️',
    status: 'Working',
    online: true
  },
  {
    name: 'Jamshid',
    role: 'Cashier',
    emoji: '💵',
    status: 'Offline',
    online: false
  }
]

const activity = [
  {
    time: '10:00',
    text: 'Bekzod started shift'
  },
  {
    time: '12:00',
    text: 'Aziz on break'
  },
  {
    time: '14:30',
    text: 'Madina clocked in'
  }
]

const filteredMembers = computed(() => {
  return teamMembers.filter(member =>
      member.name
          .toLowerCase()
          .includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <div
      class="min-h-screen
    bg-[#050505]
    max-w-[430px]
    mx-auto
    px-6
    pt-10
    pb-[220px]"
  >
    <!-- Header -->
    <div class="mb-6">
      <span
          class="inline-flex rounded-full
        border border-violet-500/20
        bg-violet-500/10
        px-4 py-2 text-sm
        text-violet-300"
      >
        👥 Team Activity
      </span>

      <h1 class="text-5xl font-bold mt-5">
        Your team.
      </h1>

      <p class="text-zinc-400 mt-3 text-lg">
        Who’s online,
        shifts & activity.
      </p>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div
          class="glass-card rounded-[30px]
        border border-white/10
        p-4 flex items-center
        gap-3 backdrop-blur-3xl"
      >
        <span class="text-zinc-500">
          🔍
        </span>

        <input
            v-model="search"
            placeholder="Search employee..."
            class="bg-transparent
          flex-1 outline-none
          text-white
          placeholder:text-zinc-500"
        />
      </div>
    </div>

    <!-- Team members -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">
        Online now
      </h3>

      <div class="space-y-4">
        <div
            v-for="member in filteredMembers"
            :key="member.name"
            class="glass-card rounded-[28px]
            hover:border-violet-500/20
hover:shadow-[0_0_30px_rgba(168,85,247,.08)]
          p-5 flex justify-between
          items-center border
          border-white/10
          transition-all duration-300
          active:scale-[0.98]
          hover:scale-[1.01]"
        >
          <div class="flex gap-4 items-center">
            <div
                class="w-14 h-14
              rounded-full
              bg-white/5
              flex items-center
              justify-center text-2xl"
            >
              {{ member.emoji }}
            </div>

            <div>
              <h4 class="font-semibold text-lg">
                {{ member.name }}
              </h4>

              <p class="text-zinc-400">
                {{ member.role }}
                •
                {{ member.status }}
              </p>
            </div>
          </div>

          <div
              class="w-3 h-3 rounded-full"
              :class="
              member.online
                ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,.7)]'
                : 'bg-zinc-600'
            "
          />
        </div>
      </div>
    </div>

    <!-- Activity -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">
        Shift activity
      </h3>

      <div
          class="glass-card rounded-[30px]
          focus-within:border-violet-500/20
transition-all duration-300
        p-5 border border-white/10"
      >
        <div
            v-for="item in activity"
            :key="item.time"
            class="flex gap-4
          py-3 border-b
          border-white/5
          last:border-none"
        >
          <span
              class="text-violet-400
            font-medium min-w-[55px]"
          >
            {{ item.time }}
          </span>

          <p class="text-zinc-300">
            {{ item.text }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button
          class="glass-card rounded-[28px]
        py-4 text-zinc-300
        hover:scale-[1.02]
        transition-all duration-300"
      >
        Call Staff
      </button>

      <button
          class="bg-gradient-to-r
        from-violet-600
        to-fuchsia-500
        rounded-[28px]
        py-4 text-white
        shadow-[0_0_30px_rgba(168,85,247,.35)]
        hover:scale-[1.02]
        transition-all duration-300"
      >
        Request Help
      </button>
    </div>
  </div>
</template>