
'use client'

import LucideIcon from './LucideIcon'

export default function KPICard({ title, subtitle, value, icon, iconColor }) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex justify-between">
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
                )}
                <p className="text-2xl font-semibold text-foreground">{value}</p>
            </div>

            <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${iconColor}`}>
                <LucideIcon name={icon} className="w-5 h-5 text-white" />
            </div>
        </div>
    )
}
