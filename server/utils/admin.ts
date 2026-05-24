import { createError, type H3Event } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  serverSupabaseServiceRole,
  serverSupabaseUser
} from '#supabase/server'
import type { Database } from '~/types/database.types'

export type AdminClient = SupabaseClient<Database>

const getAdminEmails = (event: H3Event) => {
  const config = useRuntimeConfig(event)

  return String(config.adminEmails || '')
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
}

export const requireAdminClient =
    async (event: H3Event): Promise<AdminClient> => {
      const claims =
          await serverSupabaseUser(event).catch(() => null)

      const email =
          typeof claims?.email === 'string'
              ? claims.email.toLowerCase()
              : ''

      if (!email) {
        throw createError({
          statusCode: 401,
          statusMessage:
              'Please sign in before using the admin console.'
        })
      }

      const adminEmails =
          getAdminEmails(event)

      if (!adminEmails.length) {
        throw createError({
          statusCode: 500,
          statusMessage:
              'Admin access is not configured. Set NUXT_ADMIN_EMAILS.'
        })
      }

      if (!adminEmails.includes(email)) {
        throw createError({
          statusCode: 403,
          statusMessage:
              'This user is not allowed to use the admin console.'
        })
      }

      try {
        return serverSupabaseServiceRole<Database>(event)
      } catch {
        throw createError({
          statusCode: 500,
          statusMessage:
              'Supabase admin key is missing. Set NUXT_SUPABASE_SECRET_KEY.'
        })
      }
    }

export const requireText =
    (value: unknown, label: string) => {
      if (typeof value !== 'string') {
        throw createError({
          statusCode: 400,
          statusMessage:
              `${label} is required.`
        })
      }

      const normalized =
          value.trim()

      if (!normalized) {
        throw createError({
          statusCode: 400,
          statusMessage:
              `${label} is required.`
        })
      }

      return normalized
    }
