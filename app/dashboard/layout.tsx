// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createSupabaseAuthServerClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#f0f4ff]">
        <Topbar userEmail={user.email ?? ''} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
