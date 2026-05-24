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
    '@nuxtjs/tailwindcss'
  ],

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
