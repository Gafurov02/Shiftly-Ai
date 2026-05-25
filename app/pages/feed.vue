<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

type Announcement =
    Database['public']['Tables']['announcements']['Row']

const supabase =
    useSupabaseClient<Database>()

const posts =
    ref<Announcement[]>([])

const loadFeed =
    async () => {
      const { data } =
          await supabase
              .from(
                  'announcements'
              )
              .select('*')
              .order(
                  'is_pinned',
                  {
                    ascending: false
                  }
              )
              .order(
                  'created_at',
                  {
                    ascending: false
                  }
              )

      posts.value =
          data || []
    }

let channel: RealtimeChannel | null =
    null

onMounted(async () => {
  await loadFeed()

  channel = supabase
      .channel('feed-realtime')

      .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'announcements'
          },
          async () => {
            console.log(
                'REALTIME UPDATE'
            )

            await loadFeed()
          }
      )

      .subscribe((status) => {
        console.log(
            'Realtime:',
            status
        )
      })

onUnmounted(() => {
  if (channel) {
    void supabase.removeChannel(
        channel
    )

    channel = null
  }
})
</script>

<template>
  <div class="space-y-4 mt-6">
    <div
        v-if="!posts.length"
        class="glass-card rounded-[30px] p-5 text-center text-zinc-500"
    >
      No announcements yet
    </div>

    <template v-else>
      <div
          v-for="post in posts"
          :key="post.id"
          class="glass-card
    rounded-[30px]
    p-5 border border-white/10"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3
                class="font-bold text-lg"
            >
              {{ post.title }}
            </h3>

            <p
                class="text-zinc-300
          mt-2 leading-relaxed"
            >
              {{ post.content }}
            </p>
          </div>

          <div
              v-if="post.is_pinned"
              class="text-xs
        px-3 py-1
        rounded-full
        bg-violet-500/20
        text-violet-300"
          >
            PINNED
          </div>
        </div>

        <div
            class="flex items-center
      justify-between
      mt-4 text-sm"
        >
          <div>
        <span
            class="text-zinc-400"
        >
          {{ post.author_name }}
        </span>

          <span
              class="text-zinc-600 ml-2"
          >
          {{ post.author_role }}
        </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
