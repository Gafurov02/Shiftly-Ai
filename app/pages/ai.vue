<script setup lang="ts">
type ChatMessage = {
  role: 'assistant' | 'user'
  text: string
}

const message = ref('')
const loading = ref(false)

const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    text: 'Hi 👋 I am Shiftly AI.'
  }
])

const sendMessage = async () => {
  const userMessage = message.value.trim()

  if (!userMessage) return

  messages.value.push({
    role: 'user',
    text: userMessage
  })

  message.value = ''

  loading.value = true

  try {
    const response = await $fetch<{ message: string }>(
        '/api/chat',
        {
          method: 'POST',
          body: {
            message: userMessage
          }
        }
    )

    messages.value.push({
      role: 'assistant',
      text: response.message
    })
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      text: 'AI temporarily unavailable'
    })

    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      class="min-h-screen
    bg-[#050505]
    max-w-[430px]
    mx-auto
    px-6 pt-10 pb-[180px]"
  >
    <div class="mb-6">
      <span
          class="inline-flex rounded-full
        border border-violet-500/20
        bg-violet-500/10
        px-4 py-2 text-sm
        text-violet-300"
      >
        ✨ Shiftly AI
      </span>

      <h1
          class="text-5xl font-bold mt-5"
      >
        AI assistant.
      </h1>

      <p
          class="text-zinc-400 mt-3 text-lg"
      >
        Smart workplace helper.
      </p>
    </div>

    <div class="space-y-4">
      <div
          v-for="(msg, i)
          in messages"
          :key="i"
          class="flex"
          :class="
          msg.role === 'user'
          ? 'justify-end'
          : 'justify-start'
        "
      >
        <div
            class="max-w-[80%]
          rounded-[28px]
          p-4"
            :class="
            msg.role === 'user'
            ? 'bg-violet-600 text-white'
            : 'glass-card text-zinc-200'
          "
        >
          {{ msg.text }}
        </div>
      </div>
    </div>

    <div
        class="fixed bottom-24
      w-full max-w-[380px]"
    >
      <div
          class="glass-card
        rounded-[30px]
        p-2 flex gap-2"
      >
        <input
            v-model="message"
            placeholder="Ask Shiftly AI..."
            class="bg-transparent
          flex-1 outline-none
          px-4"
        >

        <button
            @click="sendMessage"
            :disabled="loading"
            class="bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          rounded-[20px]
          px-5 py-3"
        >
          {{ loading ? '...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>
