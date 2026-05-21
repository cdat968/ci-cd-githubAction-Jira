// app/dashboard/reports/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import ReportTable from '@/components/reports/report-table'
import { currentMonth } from '@/lib/utils'
import type { MonthlySummaryRow } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ month?: string }>
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const month = params.month ?? currentMonth() // 'YYYY-MM'
  const supabase = createSupabaseServerClient()

  const { data: rows } = await supabase
    .from('v_monthly_summary')
    .select('*')
    .eq('month', month)
    .order('full_name')

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Báo cáo tháng</h2>
      <ReportTable rows={(rows ?? []) as MonthlySummaryRow[]} month={month} />
    </div>
  )
}
