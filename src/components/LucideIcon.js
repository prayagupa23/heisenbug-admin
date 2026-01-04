'use client'

import {
  TrendingUp,
  AlertTriangle,
  Shield,
  Users,
  Monitor,
  CreditCard,
  Activity,
  Key
} from 'lucide-react'

const iconMap = {
  TrendingUp,
  AlertTriangle,
  Shield,
  Users,
  Monitor,
  CreditCard,
  Activity,
  Key
}

export default function LucideIcon({ name, className }) {
  const IconComponent = iconMap[name]
  if (!IconComponent) {
    return <div className={className} />
  }
  return <IconComponent className={className} />
}
