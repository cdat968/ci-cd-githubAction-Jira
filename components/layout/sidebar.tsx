// components/layout/sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard/attendance', label: 'Chấm công' },
  { href: '/dashboard/employees', label: 'Nhân viên' },
  { href: '/dashboard/reports', label: 'Báo cáo' },
  { href: '/dashboard/settings', label: 'Cài đặt' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 min-h-screen bg-[#18181b] flex flex-col text-white shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-base font-semibold tracking-wide">HR Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-[#1d4ed8] text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/30">
        v1.0
      </div>
    </aside>
  )
}
