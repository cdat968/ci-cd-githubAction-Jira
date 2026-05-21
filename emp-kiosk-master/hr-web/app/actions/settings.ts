// app/actions/settings.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Settings } from '@/lib/types'

export async function saveSettings(
  data: Omit<Settings, 'id'>
): Promise<{ error?: string }> {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('settings')
    .update(data)
    .eq('id', 1)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/settings')
  return {}
}
