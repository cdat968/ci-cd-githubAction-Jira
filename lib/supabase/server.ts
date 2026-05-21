import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Data client using service_role key — bypasses RLS completely.
 * Uses createClient directly (NOT createServerClient) so session cookies
 * don't override the service_role auth header.
 * ⚠️  Server-side only. Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Auth-only client using anon key — used to read session in Server Components.
 * ⚠️  MUST be called with `await`: `const supabase = await createSupabaseAuthServerClient()`
 */
export async function createSupabaseAuthServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Intentional: cookies() may be read-only in some Server Component contexts
          }
        },
      },
    }
  )
}
