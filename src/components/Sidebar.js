'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  CreditCard, 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  LogOut,
  Bell,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: CreditCard, label: 'Transactions', active: false },
  { icon: Shield, label: 'Fraud Cases', active: false},
  // { icon: Users, label: 'User Management', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
  // { icon: FileText, label: 'Logs', active: false },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Overview')

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
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
              {menuItems.slice(0, 4).map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => setActiveItem(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    index === 0
                      ? "shadow-sm"
                      : "text-muted-foreground hover:bg-blue-50 hover:text-blue-700"
                  )}
                  style={index === 0 ? { backgroundColor: '#0742a0', color: 'white' } : {}}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.notification && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.notification}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              SYSTEM
            </p>
            <nav className="space-y-1">
              {menuItems.slice(4).map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => setActiveItem(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    false
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-blue-50 hover:text-blue-700"
                  )}
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
          <button className="text-muted-foreground hover:text-foreground hover:bg-gray-100 p-1 rounded transition-all duration-200">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
