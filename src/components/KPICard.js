'use client'

import { cn } from '@/lib/utils'
import LucideIcon from './LucideIcon'

export default function KPICard({ title, value, change, changeType, icon, iconColor }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-semibold text-foreground mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            <span
              className={cn(
                "text-xs font-medium",
                changeType === 'positive' ? 'text-success' : 
                changeType === 'negative' ? 'text-danger' : 
                'text-muted-foreground'
              )}
            >
              {change}
            </span>
            {changeType && (
              <svg
                className={cn(
                  "w-3 h-3",
                  changeType === 'positive' ? 'text-success' : 
                  changeType === 'negative' ? 'text-danger' : 
                  'text-muted-foreground'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {changeType === 'positive' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : changeType === 'negative' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
            )}
          </div>
        </div>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          <LucideIcon name={icon} className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}
