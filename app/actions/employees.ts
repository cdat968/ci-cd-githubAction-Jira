// app/actions/employees.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function toggleEmployeeActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('employees')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/employees')
  return {}
}
