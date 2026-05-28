<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

type Employee = Database['public']['Tables']['employees']['Row']
type EmployeeUpdate = Database['public']['Tables']['employees']['Update']
type Shift = Database['public']['Tables']['shifts']['Row']
type ActivityAction =
    Database['public']['Tables']['activity_logs']['Insert']['action']

const supabase = useSupabaseClient<Database>()

const selectedDay = ref('Thu')

const week = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
]

const employee = ref<Employee | null>(null)
const shifts = ref<Shift[]>([])
const teamToday = ref<Employee[]>([])

const getCurrentEmployee =
    async () => {
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user?.email) {
            return null
        }

        const { data } =
            await supabase
                .from('employees')
                .select('*')
                .eq('email', user.email)
                .single()

        return data
    }

const loadSchedule = async () => {
  const employeeData =
      await getCurrentEmployee()

  employee.value = employeeData

  const { data: teamData } =
      await supabase
          .from('employees')
          .select('*')
          .order('is_working', {
            ascending: false
          })
          .order('full_name', {
            ascending: true
          })

  teamToday.value =
      teamData || []

  if (employeeData?.id) {
    const { data: shiftData } =
        await supabase
            .from('shifts')
            .select('*')
            .eq(
                'employee_id',
                employeeData.id
            )
            .order(
                'shift_date',
                { ascending: true }
            )

    shifts.value =
        shiftData || []

    return
  }

  shifts.value = []
}

let channel: RealtimeChannel | null = null

onMounted(async () => {
  await loadSchedule()

  channel = supabase
      .channel('employees-realtime')

      .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'employees'
          },
          async () => {
            await loadSchedule()
          }
      )

      .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'shifts'
          },
          async () => {
            await loadSchedule()
          }
      )

      .subscribe()
})

onUnmounted(() => {
  if (channel) {
    void supabase.removeChannel(channel)
    channel = null
  }
})

const todayShift = computed(() => {
  if (!employee.value) return null

  return {
    role: employee.value.role,
    start: employee.value.shift_start,
    end: employee.value.shift_end,
    status: employee.value.status,
    isWorking: employee.value.is_working
  }
})

const formatTime = (time?: string | null) => {
  if (!time) return '--:--'
  return time.slice(0, 5)
}

const loadingAction = ref(false)

const updateCurrentEmployee =
    async (
        payload: EmployeeUpdate,
        action: ActivityAction
    ) => {
      try {
        loadingAction.value = true

        const currentEmployee =
            await getCurrentEmployee()

        if (!currentEmployee) {
          return
        }

        await supabase
            .from('employees')
            .update(payload)
            .eq('id', currentEmployee.id)

        await supabase
            .from('activity_logs')
            .insert({
              employee_id: currentEmployee.id,
              action
            })

        await loadSchedule()
      } finally {
        loadingAction.value = false
      }
    }

const clockIn = async () => {
  await updateCurrentEmployee(
      {
        is_online: true,
        is_working: true,
        status: 'working',
        last_activity:
            new Date().toISOString()
      },
      'clock_in'
  )
}

const takeBreak = async () => {
  await updateCurrentEmployee(
      {
        status: 'break',
        is_working: false
      },
      'break'
  )
}

const clockOut = async () => {
  await updateCurrentEmployee(
      {
        is_online: false,
        is_working: false,
        status: 'offline'
      },
      'clock_out'
  )
}

const requestDayOff = async () => {
  try {
    const currentEmployee =
        await getCurrentEmployee()

    if (!currentEmployee) {
      alert('Employee not found')
      return
    }

    const { error } =
        await supabase
            .from('shift_requests')
            .insert({
              employee_id: currentEmployee.id,
              type: 'day_off',
              message: 'Requested day off'
            })

    console.log('DAY OFF ERROR', error)

    if (error) {
      alert(error.message)
      return
    }

    alert('✅ Day off request sent')
  } catch (error) {
    console.error(error)
  }
}

const requestShiftSwap = async () => {
  try {
    const currentEmployee =
        await getCurrentEmployee()

    if (!currentEmployee) {
      alert('Employee not found')
      return
    }

    const { error } =
        await supabase
            .from('shift_requests')
            .insert({
              employee_id: currentEmployee.id,
              type: 'swap_shift',
              message: 'Requested shift swap'
            })

    console.log('SWAP ERROR', error)

    if (error) {
      alert(error.message)
      return
    }

    alert('✅ Shift swap request sent')
  } catch (error) {
    console.error(error)
  }
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
    <div class="mb-6">
      <span
          class="inline-flex rounded-full
        border border-violet-500/20
        bg-violet-500/10
        px-4 py-2 text-sm
        text-violet-300"
      >
        📅 Staff Schedule
      </span>

      <h1 class="text-5xl font-bold mt-5">
        Your shifts.
      </h1>

      <p class="text-zinc-400 mt-3 text-lg">
        Weekly schedule,
        today shift & team.
      </p>
    </div>

    <!-- Today Shift -->
    <div
        class="glass-card rounded-[34px]
      p-6 border border-white/10
      backdrop-blur-3xl mb-6 shadow-[0_0_50px_rgba(168,85,247,.08)]
bg-white/[0.03]"
    >
      <div class="flex justify-between items-start">
        <div>
          <p class="text-zinc-400 text-sm">
            Today • Active shift
          </p>

          <h2 class="text-2xl font-bold mt-2 capitalize">
            {{ todayShift?.role || 'No Role' }}
          </h2>

          <p class="text-zinc-400 mt-2">
            {{ formatTime(todayShift?.start) }}
            —
            {{ formatTime(todayShift?.end) }}
          </p>

          <p class="text-zinc-500 text-sm mt-1">
            Tot Samiy Gastropub
          </p>
        </div>

        <div
            class="w-3 h-3 rounded-full"
            :class="
    todayShift?.status === 'working'
      ? 'bg-green-500 shadow-[0_0_18px_rgba(34,197,94,.7)]'
      : todayShift?.status === 'break'
      ? 'bg-yellow-500 shadow-[0_0_18px_rgba(234,179,8,.7)]'
      : 'bg-zinc-600'
  "
        />
      </div>

      <div class="space-y-3 mt-6">
        <div class="grid grid-cols-2 gap-3">

          <!-- Clock In -->
          <button
              @click="clockIn"
              :disabled="
        loadingAction ||
        todayShift?.status === 'working'
      "
              class="bg-gradient-to-r
      from-violet-600
      to-fuchsia-500
      rounded-[24px]
      py-4 text-white
      disabled:opacity-40"
          >
            {{
              loadingAction
                  ? 'Loading...'
                  : todayShift?.status === 'working'
                      ? 'Working'
                      : 'Clock In'
            }}
          </button>

          <!-- Break -->
          <button
              @click="takeBreak"
              :disabled="
        todayShift?.status !== 'working'
      "
              class="glass-card
      rounded-[24px]
      py-4 text-zinc-300
      disabled:opacity-40"
          >
            {{
              todayShift?.status === 'break'
                  ? 'On Break'
                  : 'Break'
            }}
          </button>
        </div>

        <!-- Clock Out -->
        <button
            @click="clockOut"
            :disabled="
      todayShift?.status === 'offline'
    "
            class="w-full rounded-[24px]
    py-4 bg-red-500/10
    text-red-400
    disabled:opacity-40"
        >
          Clock Out
        </button>
      </div>

    </div>

    <!-- Week -->
    <div
        class="flex gap-3 overflow-x-auto
no-scrollbar mb-6
snap-x snap-mandatory px-1"
    >
      <button
          v-for="day in week"
          :key="day"
          @click="selectedDay = day"
          class="shrink-0 rounded-full
        px-5 py-3 text-sm
        transition-all duration-300"
          :class="
          selectedDay === day
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_0_25px_rgba(168,85,247,.35)]'
            : 'glass-card text-zinc-400'
        "
      >
        {{ day }}
      </button>
    </div>

    <!-- Upcoming -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-4">
        Upcoming shifts
      </h3>

      <div v-if="!shifts.length"
           class="glass-card rounded-[28px] p-5 text-center text-zinc-500"
      >
        No upcoming shifts
      </div>

      <div
          v-else
          class="space-y-4"
      >
        <div
            v-for="shift in shifts"
            :key="shift.id"
            class="glass-card rounded-[30px]
    hover:scale-[1.02]
    transition-all duration-300
    active:scale-[0.98]
    p-5"
        >
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-semibold text-lg">
                {{ shift.shift_date }}
              </h4>

              <p class="text-zinc-400 mt-1 capitalize">
                {{ shift.role }}
              </p>
            </div>

            <span class="text-zinc-300">
        {{ formatTime(shift.start_time) }}
        —
        {{ formatTime(shift.end_time) }}
      </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Team -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-4">
        Team on shift
      </h3>

      <div class="space-y-3">
        <div
            v-for="member in teamToday"
            :key="member.id"
            class="glass-card rounded-[26px]
          p-4 flex items-center
          justify-between"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">
              {{ member.emoji }}
            </span>

            <div>
              <p class="font-medium">
                {{ member.full_name }}
              </p>

              <p class="text-sm text-zinc-500 capitalize">
                {{ member.role }}
              </p>
            </div>
          </div>

          <div
              class="w-3 h-3 rounded-full"
              :class="
    member.status === 'working'
      ? 'bg-green-500 shadow-[0_0_18px_rgba(34,197,94,.7)]'
      : member.status === 'break'
      ? 'bg-yellow-500 shadow-[0_0_18px_rgba(234,179,8,.7)]'
      : 'bg-zinc-600'
  "
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button
          @click="requestDayOff"
          class="glass-card rounded-[28px]
  py-4 text-zinc-300"
      >
        Day Off
      </button>

      <button
          @click="requestShiftSwap"
          class="bg-gradient-to-r
        from-violet-600
        to-fuchsia-500
        rounded-[28px]
        py-4 text-white
        shadow-[0_0_30px_rgba(168,85,247,.35)]"
      >
        Swap Shift
      </button>
    </div>
  </div>
</template>
