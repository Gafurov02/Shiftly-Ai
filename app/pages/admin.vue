<script setup lang="ts">
import type { Database } from '~/types/database.types'

type Employee = Database['public']['Tables']['employees']['Row']
type Shift = Database['public']['Tables']['shifts']['Row']
type Announcement = Database['public']['Tables']['announcements']['Row']
type Notification = Database['public']['Tables']['notifications']['Row']
type AdminTab = 'overview' | 'news' | 'shifts' | 'team' | 'alerts'
type AdminDashboard = {
  employees: Employee[]
  shifts: Shift[]
  announcements: Announcement[]
  notifications: Notification[]
}

definePageMeta({
  layout: 'mobile',
  middleware: ['admin']
})

useHead({
  title: 'Admin | Shiftly AI'
})

const activeTab = ref<AdminTab>('overview')
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const employees = ref<Employee[]>([])
const shifts = ref<Shift[]>([])
const announcements = ref<Announcement[]>([])
const notifications = ref<Notification[]>([])

const getLocalDate = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

const announcementForm = reactive({
  title: '',
  content: '',
  authorName: 'Shiftly Admin',
  authorRole: 'Operations',
  isPinned: false,
  notifyTeam: true
})

const shiftForm = reactive({
  employeeId: '',
  shiftDate: getLocalDate(),
  role: '',
  startTime: '10:00',
  endTime: '18:00'
})

const employeeForm = reactive({
  email: '',
  fullName: '',
  role: 'bar',
  emoji: '👤',
  shiftStart: '10:00',
  shiftEnd: '18:00'
})

const notificationForm = reactive({
  title: '',
  message: ''
})

const tabs = computed(() => [
  {
    id: 'overview' as const,
    label: 'Overview',
    count: employees.value.length
  },
  {
    id: 'news' as const,
    label: 'News',
    count: announcements.value.length
  },
  {
    id: 'shifts' as const,
    label: 'Shifts',
    count: shifts.value.length
  },
  {
    id: 'team' as const,
    label: 'Team',
    count: employees.value.length
  },
  {
    id: 'alerts' as const,
    label: 'Alerts',
    count: notifications.value.filter(item => !item.is_read).length
  }
])

const workingCount = computed(() =>
  employees.value.filter(employee => employee.is_working).length
)

const onlineCount = computed(() =>
  employees.value.filter(employee => employee.is_online).length
)

const upcomingShifts = computed(() =>
  shifts.value
      .filter(shift => !shift.shift_date || shift.shift_date >= getLocalDate())
      .slice(0, 5)
)

const pinnedCount = computed(() =>
  announcements.value.filter(post => post.is_pinned).length
)

const getErrorMessage = (error: unknown) => {
  if (
      error &&
      typeof error === 'object' &&
      'data' in error
  ) {
    const data =
        (error as {
          data?: {
            statusMessage?: unknown
            message?: unknown
          }
        }).data

    if (typeof data?.statusMessage === 'string') {
      return data.statusMessage
    }

    if (typeof data?.message === 'string') {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Action failed. Please try again.'
}

const setSuccess = (message: string) => {
  successMessage.value = message
  errorMessage.value = ''
}

const loadAdminData = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const data =
        await $fetch<AdminDashboard>(
            '/api/admin/dashboard'
        )

    employees.value = data.employees
    shifts.value = data.shifts
    announcements.value = data.announcements
    notifications.value = data.notifications
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const runMutation = async (
    mutation: () => Promise<void>,
    success: string
) => {
  try {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    await mutation()
    await loadAdminData()
    setSuccess(success)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    saving.value = false
  }
}

const adminMutate =
    async (
        action: string,
        payload: Record<string, unknown>
    ) => {
      await $fetch(
          '/api/admin/mutate',
          {
            method: 'POST',
            body: {
              action,
              payload
            }
          }
      )
    }

const requireValue = (value: string, label: string) => {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`${label} is required`)
  }

  return normalized
}

const employeeName = (employeeId?: string | null) => {
  const employee = employees.value.find(item => item.id === employeeId)

  return employee?.full_name || employee?.email || 'Unassigned'
}

const syncShiftRole = () => {
  const employee = employees.value.find(item => item.id === shiftForm.employeeId)

  if (employee?.role) {
    shiftForm.role = employee.role
  }
}

const createAnnouncement = async () => {
  await runMutation(
      async () => {
        await adminMutate(
            'createAnnouncement',
            {
              title: requireValue(announcementForm.title, 'Title'),
              content: requireValue(announcementForm.content, 'Content'),
              authorName: announcementForm.authorName,
              authorRole: announcementForm.authorRole,
              isPinned: announcementForm.isPinned,
              notifyTeam: announcementForm.notifyTeam
            }
        )

        Object.assign(announcementForm, {
          title: '',
          content: '',
          authorName: 'Shiftly Admin',
          authorRole: 'Operations',
          isPinned: false,
          notifyTeam: true
        })
      },
      'Announcement published'
  )
}

const deleteAnnouncement = async (id: string) => {
  if (!confirm('Delete this announcement?')) {
    return
  }

  await runMutation(
      async () => {
        await adminMutate(
            'deleteAnnouncement',
            {
              id
            }
        )
      },
      'Announcement deleted'
  )
}

const createShift = async () => {
  await runMutation(
      async () => {
        await adminMutate(
            'createShift',
            {
              employeeId: requireValue(
                  shiftForm.employeeId,
                  'Employee'
              ),
              shiftDate: requireValue(
                  shiftForm.shiftDate,
                  'Shift date'
              ),
              role: shiftForm.role,
              startTime: requireValue(
                  shiftForm.startTime,
                  'Start time'
              ),
              endTime: requireValue(
                  shiftForm.endTime,
                  'End time'
              )
            }
        )

        Object.assign(shiftForm, {
          employeeId: '',
          shiftDate: getLocalDate(),
          role: '',
          startTime: '10:00',
          endTime: '18:00'
        })
      },
      'Shift created'
  )
}

const deleteShift = async (id: string) => {
  if (!confirm('Delete this shift?')) {
    return
  }

  await runMutation(
      async () => {
        await adminMutate(
            'deleteShift',
            {
              id
            }
        )
      },
      'Shift deleted'
  )
}

const createEmployee = async () => {
  await runMutation(
      async () => {
        await adminMutate(
            'createEmployee',
            {
              email: requireValue(employeeForm.email, 'Email'),
              fullName: requireValue(
                  employeeForm.fullName,
                  'Full name'
              ),
              role: employeeForm.role,
              emoji: employeeForm.emoji,
              shiftStart: employeeForm.shiftStart,
              shiftEnd: employeeForm.shiftEnd
            }
        )

        Object.assign(employeeForm, {
          email: '',
          fullName: '',
          role: 'bar',
          emoji: '👤',
          shiftStart: '10:00',
          shiftEnd: '18:00'
        })
      },
      'Employee added'
  )
}

const setEmployeeStatus = async (
    employee: Employee,
    status: 'working' | 'break' | 'offline'
) => {
  await runMutation(
      async () => {
        await adminMutate(
            'setEmployeeStatus',
            {
              id: employee.id,
              status
            }
        )
      },
      `${employee.full_name || employee.email} updated`
  )
}

const createNotification = async () => {
  await runMutation(
      async () => {
        await adminMutate(
            'createNotification',
            {
              title: requireValue(notificationForm.title, 'Title'),
              message: requireValue(
                  notificationForm.message,
                  'Message'
              )
            }
        )

        Object.assign(notificationForm, {
          title: '',
          message: ''
        })
      },
      'Notification sent'
  )
}

const deleteNotification = async (id: string) => {
  if (!confirm('Delete this notification?')) {
    return
  }

  await runMutation(
      async () => {
        await adminMutate(
            'deleteNotification',
            {
              id
            }
        )
      },
      'Notification deleted'
  )
}

const formatTime = (time?: string | null) => {
  if (!time) {
    return '--:--'
  }

  return time.slice(0, 5)
}

onMounted(() => {
  void loadAdminData()
})
</script>

<template>
  <div
      class="min-h-screen bg-[#050505]
    max-w-[430px]
    mx-auto
    px-5
    pt-8
    pb-[220px]"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <span
            class="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
        >
          🛠 Admin Console
        </span>

        <h1 class="text-4xl font-bold mt-5">
          Operations.
        </h1>

        <p class="text-zinc-400 mt-3 leading-relaxed">
          Manage team updates, shifts, people and alerts.
        </p>
      </div>

      <button
          class="glass-card mt-1 h-11 w-11 rounded-2xl text-lg"
          :disabled="loading"
          title="Refresh admin data"
          @click="loadAdminData"
      >
        ↻
      </button>
    </div>

    <div
        v-if="errorMessage"
        class="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {{ errorMessage }}
    </div>

    <div
        v-if="successMessage"
        class="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
    >
      {{ successMessage }}
    </div>

    <div
        class="mt-6 flex gap-2 overflow-x-auto pb-1"
    >
      <button
          v-for="tab in tabs"
          :key="tab.id"
          class="shrink-0 rounded-full px-4 py-2 text-sm transition-all"
          :class="
          activeTab === tab.id
            ? 'bg-white text-black'
            : 'glass-card text-zinc-300'
        "
          @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span class="ml-1 text-xs opacity-60">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <div
        v-if="loading"
        class="glass-card mt-6 rounded-[28px] p-6 text-center text-zinc-400"
    >
      Loading admin data...
    </div>

    <template v-else>
      <section
          v-if="activeTab === 'overview'"
          class="mt-6 space-y-5"
      >
        <div class="grid grid-cols-2 gap-3">
          <div class="glass-card rounded-[26px] p-5">
            <p class="text-sm text-zinc-500">
              Team
            </p>
            <p class="mt-2 text-3xl font-bold">
              {{ employees.length }}
            </p>
          </div>

          <div class="glass-card rounded-[26px] p-5">
            <p class="text-sm text-zinc-500">
              Working
            </p>
            <p class="mt-2 text-3xl font-bold">
              {{ workingCount }}
            </p>
          </div>

          <div class="glass-card rounded-[26px] p-5">
            <p class="text-sm text-zinc-500">
              Online
            </p>
            <p class="mt-2 text-3xl font-bold">
              {{ onlineCount }}
            </p>
          </div>

          <div class="glass-card rounded-[26px] p-5">
            <p class="text-sm text-zinc-500">
              Pinned
            </p>
            <p class="mt-2 text-3xl font-bold">
              {{ pinnedCount }}
            </p>
          </div>
        </div>

        <div class="glass-card rounded-[28px] p-5">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">
              Next shifts
            </h2>
            <button
                class="text-sm text-violet-300"
                @click="activeTab = 'shifts'"
            >
              Manage
            </button>
          </div>

          <div class="mt-4 space-y-3">
            <div
                v-if="!upcomingShifts.length"
                class="text-sm text-zinc-500"
            >
              No shifts planned
            </div>

            <div
                v-for="shift in upcomingShifts"
                :key="shift.id"
                class="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p class="font-medium">
                  {{ employeeName(shift.employee_id) }}
                </p>
                <p class="text-sm text-zinc-500">
                  {{ shift.shift_date || 'No date' }}
                </p>
              </div>
              <span class="text-sm text-zinc-300">
                {{ formatTime(shift.start_time) }}-{{ formatTime(shift.end_time) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
          v-if="activeTab === 'news'"
          class="mt-6 space-y-5"
      >
        <form
            class="glass-card rounded-[28px] p-5 space-y-4"
            @submit.prevent="createAnnouncement"
        >
          <div>
            <label class="text-sm text-zinc-500">
              Title
            </label>
            <input
                v-model="announcementForm.title"
                class="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                placeholder="New cocktail menu"
            />
          </div>

          <div>
            <label class="text-sm text-zinc-500">
              Content
            </label>
            <textarea
                v-model="announcementForm.content"
                class="mt-2 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                placeholder="Write a team update..."
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <input
                v-model="announcementForm.authorName"
                class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                placeholder="Author"
            />
            <input
                v-model="announcementForm.authorRole"
                class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                placeholder="Role"
            />
          </div>

          <div class="flex flex-wrap gap-3">
            <label class="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
              <input
                  v-model="announcementForm.isPinned"
                  type="checkbox"
              />
              Pin
            </label>
            <label class="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
              <input
                  v-model="announcementForm.notifyTeam"
                  type="checkbox"
              />
              Notify team
            </label>
          </div>

          <button
              class="continue-btn"
              :disabled="saving"
          >
            {{ saving ? 'Publishing...' : 'Publish news' }}
          </button>
        </form>

        <div class="space-y-3">
          <div
              v-if="!announcements.length"
              class="glass-card rounded-[28px] p-5 text-center text-zinc-500"
          >
            No news yet
          </div>

          <div
              v-for="post in announcements"
              :key="post.id"
              class="glass-card rounded-[26px] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-semibold">
                  {{ post.title || 'Untitled' }}
                </h3>
                <p class="mt-2 text-sm leading-relaxed text-zinc-400">
                  {{ post.content }}
                </p>
                <p class="mt-3 text-xs text-zinc-600">
                  {{ post.author_name || 'Admin' }} · {{ post.author_role || 'Operations' }}
                </p>
              </div>
              <button
                  class="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  @click="deleteAnnouncement(post.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
          v-if="activeTab === 'shifts'"
          class="mt-6 space-y-5"
      >
        <form
            class="glass-card rounded-[28px] p-5 space-y-4"
            @submit.prevent="createShift"
        >
          <div>
            <label class="text-sm text-zinc-500">
              Employee
            </label>
            <select
                v-model="shiftForm.employeeId"
                class="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                @change="syncShiftRole"
            >
              <option value="">
                Select employee
              </option>
              <option
                  v-for="employee in employees"
                  :key="employee.id"
                  :value="employee.id"
              >
                {{ employee.full_name || employee.email }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-zinc-500">
                Date
              </label>
              <input
                  v-model="shiftForm.shiftDate"
                  type="date"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label class="text-sm text-zinc-500">
                Role
              </label>
              <input
                  v-model="shiftForm.role"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                  placeholder="bar"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-zinc-500">
                Start
              </label>
              <input
                  v-model="shiftForm.startTime"
                  type="time"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label class="text-sm text-zinc-500">
                End
              </label>
              <input
                  v-model="shiftForm.endTime"
                  type="time"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <button
              class="continue-btn"
              :disabled="saving || !employees.length"
          >
            {{ saving ? 'Saving...' : 'Create shift' }}
          </button>
        </form>

        <div class="space-y-3">
          <div
              v-if="!shifts.length"
              class="glass-card rounded-[28px] p-5 text-center text-zinc-500"
          >
            No shifts yet
          </div>

          <div
              v-for="shift in shifts"
              :key="shift.id"
              class="glass-card rounded-[26px] p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="font-semibold">
                  {{ employeeName(shift.employee_id) }}
                </h3>
                <p class="mt-1 text-sm text-zinc-400">
                  {{ shift.shift_date || 'No date' }} · {{ shift.role || 'staff' }}
                </p>
                <p class="mt-1 text-sm text-zinc-500">
                  {{ formatTime(shift.start_time) }}-{{ formatTime(shift.end_time) }}
                </p>
              </div>
              <button
                  class="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  @click="deleteShift(shift.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
          v-if="activeTab === 'team'"
          class="mt-6 space-y-5"
      >
        <form
            class="glass-card rounded-[28px] p-5 space-y-4"
            @submit.prevent="createEmployee"
        >
          <div class="grid grid-cols-[72px_1fr] gap-3">
            <input
                v-model="employeeForm.emoji"
                class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center text-xl outline-none focus:border-violet-400"
                maxlength="4"
            />
            <input
                v-model="employeeForm.fullName"
                class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                placeholder="Full name"
            />
          </div>

          <input
              v-model="employeeForm.email"
              type="email"
              class="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
              placeholder="employee@email.com"
          />

          <div class="grid grid-cols-3 gap-3">
            <input
                v-model="employeeForm.role"
                class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
                placeholder="role"
            />
            <input
                v-model="employeeForm.shiftStart"
                type="time"
                class="rounded-2xl border border-white/10 bg-black/30 px-3 py-3 outline-none focus:border-violet-400"
            />
            <input
                v-model="employeeForm.shiftEnd"
                type="time"
                class="rounded-2xl border border-white/10 bg-black/30 px-3 py-3 outline-none focus:border-violet-400"
            />
          </div>

          <button
              class="continue-btn"
              :disabled="saving"
          >
            {{ saving ? 'Adding...' : 'Add employee' }}
          </button>
        </form>

        <div class="space-y-3">
          <div
              v-if="!employees.length"
              class="glass-card rounded-[28px] p-5 text-center text-zinc-500"
          >
            No employees yet
          </div>

          <div
              v-for="employee in employees"
              :key="employee.id"
              class="glass-card rounded-[26px] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
                  {{ employee.emoji || '👤' }}
                </div>
                <div>
                  <h3 class="font-semibold">
                    {{ employee.full_name || 'Employee' }}
                  </h3>
                  <p class="text-sm text-zinc-500">
                    {{ employee.email }}
                  </p>
                  <p class="mt-1 text-sm capitalize text-zinc-400">
                    {{ employee.role || 'staff' }} · {{ employee.status || 'offline' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2">
              <button
                  class="rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                  @click="setEmployeeStatus(employee, 'working')"
              >
                Working
              </button>
              <button
                  class="rounded-2xl bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300"
                  @click="setEmployeeStatus(employee, 'break')"
              >
                Break
              </button>
              <button
                  class="rounded-2xl bg-white/[0.05] px-3 py-2 text-sm text-zinc-300"
                  @click="setEmployeeStatus(employee, 'offline')"
              >
                Offline
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
          v-if="activeTab === 'alerts'"
          class="mt-6 space-y-5"
      >
        <form
            class="glass-card rounded-[28px] p-5 space-y-4"
            @submit.prevent="createNotification"
        >
          <input
              v-model="notificationForm.title"
              class="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
              placeholder="Alert title"
          />
          <textarea
              v-model="notificationForm.message"
              class="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-400"
              placeholder="Message for the team..."
          />

          <button
              class="continue-btn"
              :disabled="saving"
          >
            {{ saving ? 'Sending...' : 'Send alert' }}
          </button>
        </form>

        <div class="space-y-3">
          <div
              v-if="!notifications.length"
              class="glass-card rounded-[28px] p-5 text-center text-zinc-500"
          >
            No alerts yet
          </div>

          <div
              v-for="item in notifications"
              :key="item.id"
              class="glass-card rounded-[26px] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span
                      v-if="!item.is_read"
                      class="h-2 w-2 rounded-full bg-red-500"
                  />
                  <h3 class="font-semibold">
                    {{ item.title || 'Untitled alert' }}
                  </h3>
                </div>
                <p class="mt-2 text-sm leading-relaxed text-zinc-400">
                  {{ item.message }}
                </p>
              </div>
              <button
                  class="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  @click="deleteNotification(item.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
