// components/layout/topbar.tsx
'use client'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  userEmail: string
}

export default function Topbar({ userEmail }: TopbarProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 px-6 flex items-center justify-between bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] text-white shrink-0">
      <h1 className="text-base font-semibold">Quản lý chấm công</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/80">{userEmail}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/80 hover:text-white hover:bg-white/10 text-xs"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </header>
  )
}
