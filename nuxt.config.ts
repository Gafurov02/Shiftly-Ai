export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },

  sourcemap: {
    client: false,
    server: false
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',

    manifest: {
      name: 'Shiftly AI',
      short_name: 'Shiftly',
      description:
        'Restaurant staff management',

      theme_color: '#050505',
      background_color: '#050505',

      display: 'standalone',
      orientation: 'portrait',

      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },

    workbox: {
      navigateFallback: '/'
    },

    devOptions: {
      enabled: false
    }
  },

  supabase: {
    redirect: false
  },

  runtimeConfig: {
    openaiApiKey:
      process.env.OPENAI_API_KEY,
    adminEmails:
      process.env.NUXT_ADMIN_EMAILS ||
      process.env.ADMIN_EMAILS ||
      ''
  },

  css: ['~/assets/css/main.css']
})
