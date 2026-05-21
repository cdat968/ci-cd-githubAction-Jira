'use server'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, createSupabaseAuthServerClient } from '@/lib/supabase/server'

export type AttendanceFormData = {
  id?: string           // present when editing
  employee_id: string
  work_date: string     // 'YYYY-MM-DD'
  check_in_at: string   // 'HH:MM' local VN time
  check_out_at?: string // 'HH:MM' optional
  is_late: boolean
  note: string
}

function toISO(date: string, time: string): string {
  // Combine work_date + HH:MM into ISO timestamp at VN offset +07:00
  return `${date}T${time}:00+07:00`
}

export async function upsertAttendance(
  formData: AttendanceFormData
): Promise<{ error?: string }> {
  // Get current user email for modified_by
  const authClient = await createSupabaseAuthServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Không xác thực được người dùng.' }

  const supabase = createSupabaseServerClient()

  const check_in_at = toISO(formData.work_date, formData.check_in_at)
  const check_out_at = formData.check_out_at
    ? toISO(formData.work_date, formData.check_out_at)
    : null

  // Validate check_out after check_in
  if (check_out_at && new Date(check_out_at) <= new Date(check_in_at)) {
    return { error: 'Giờ ra phải sau giờ vào.' }
  }

  if (formData.id) {
    // UPDATE existing record
    const { error } = await supabase
      .from('attendance')
      .update({
        employee_id: formData.employee_id,
        work_date: formData.work_date,
        check_in_at,
        check_out_at,
        is_late: formData.is_late,
        source: 'admin_manual',
        note: formData.note,
        modified_by: user.email,
      })
      .eq('id', formData.id)
    if (error) return { error: error.message }
  } else {
    // INSERT — check for duplicate (employee_id, work_date) first
    const { data: existing } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', formData.employee_id)
      .eq('work_date', formData.work_date)
      .maybeSingle()

    if (existing) {
      return { error: 'Nhân viên này đã có bản ghi chấm công ngày này.' }
    }

    const { error } = await supabase.from('attendance').insert({
      employee_id: formData.employee_id,
      work_date: formData.work_date,
      check_in_at,
      check_out_at,
      is_late: formData.is_late,
      source: 'admin_manual',
      note: formData.note,
      modified_by: user.email,
    })
    if (error) return { error: error.message }
  }

  revalidatePath('/dashboard/attendance')
  return {}
}
