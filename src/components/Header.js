'use client'

import { Search, Bell, HelpCircle, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Left side - Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard Overview</h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Transaction ID or User..."
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Icons and Status */}
      <div className="flex items-center space-x-4">
        {/* Status Pill */}
        <div className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>System Healthy</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <HelpCircle className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  )
}
