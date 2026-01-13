'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    CreditCard,
    Shield,
    Users,
    BarChart3,
    Settings,
    FileText,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/' },
    { label: 'Transactions', icon: CreditCard, href: '/transactions' },

    // ⬇️ HARD-CODED (NO ROUTING FOR NOW)
    { label: 'Fraud Cases', icon: Shield, href: null },
    { label: 'User Management', icon: Users, href: null },
    { label: 'Analytics', icon: BarChart3, href: null },
    { label: 'Settings', icon: Settings, href: null },
    { label: 'Logs', icon: FileText, href: null }
]

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="w-64 h-screen border-r bg-card flex flex-col">
            {/* TOP */}
            <div className="p-6 border-b">
                <h1 className="font-semibold">NexusPay</h1>
                <p className="text-xs text-muted-foreground">ADMIN CONSOLE</p>
            </div>

            {/* MENU */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map(item => {
                    const isActive = item.href && pathname === item.href

                    return (
                        <button
                            key={item.label}
                            onClick={() => item.href && router.push(item.href)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition',
                                item.href
                                    ? isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-muted-foreground hover:bg-blue-50 hover:text-blue-700'
                                    : 'text-muted-foreground opacity-60 cursor-not-allowed'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            {/* BOTTOM USER SECTION */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                        PU
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-medium">Prayag Upadhyaya</p>
                        <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>

                    <button
                        className="p-2 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition"
                        title="Logout"
                        onClick={() => {
                            // add logout logic later
                            console.log('Logout clicked')
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}



