// app/dashboard/settings/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/settings/settings-form'
import type { Settings } from '@/lib/types'

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (!settings) {
    return (
      <p className="text-red-500 text-sm">
        Không tìm thấy bản ghi cài đặt (id=1). Vui lòng kiểm tra database.
      </p>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Cài đặt hệ thống</h2>
      <SettingsForm settings={settings as Settings} />
    </div>
  )
}
