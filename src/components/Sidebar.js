'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  LayoutDashboard,
  Shield,
  LogOut,
  Megaphone,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainMenuItems = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Shield, label: 'Fraud Cases' },
  { icon: Megaphone, label: 'Broadcast' },
]

export default function Sidebar({ activeItem, setActiveItem }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Using window.location for a hard refresh to clear any cached admin state
    window.location.href = '/login'
  }

  return (
      <div className="w-64 bg-card border-r border-border flex flex-col h-screen relative">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0742a0' }}>
              <span className="text-white font-bold text-sm">NP</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">NexusPay</h1>
              <p className="text-xs text-muted-foreground">ADMIN CONSOLE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                MAIN MENU
              </p>
              <nav className="space-y-1">
                {mainMenuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setActiveItem(item.label)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            activeItem === item.label
                                ? "shadow-sm"
                                : "text-muted-foreground hover:bg-blue-50 hover:text-blue-700"
                        )}
                        style={activeItem === item.label ? { backgroundColor: '#0742a0', color: 'white' } : {}}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0742a0' }}>
              <span className="text-white font-bold text-sm">PU</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Prayag Upadhyaya</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
            <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-gray-100 p-1 rounded transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LOGOUT CONFIRMATION OVERLAY */}
        {showLogoutConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-border animate-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Sign Out</h3>
                      <p className="text-sm text-gray-500">Are you sure you want to log out?</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}