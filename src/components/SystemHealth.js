'use client'

import { Server, Database, Cpu, Shield } from 'lucide-react'

const healthItems = [
  {
    icon: Server,
    label: 'API Latency',
    value: '45ms',
    status: 'healthy'
  },
  {
    icon: Cpu,
    label: 'Fraud Model v4.2 Inference Time',
    value: '12ms',
    status: 'healthy'
  },
  {
    icon: Database,
    label: 'Database Replica Sync Delay',
    value: '2.1s',
    status: 'warning'
  }
]

export default function SystemHealth() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">System Health</h2>
      
      <div className="space-y-4">
        {healthItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  item.status === 'healthy' ? 'bg-green-500' : 
                  item.status === 'warning' ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}></div>
              </div>
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-sm transition-all duration-200 text-sm font-medium">
        View System Logs
      </button>
    </div>
  )
}
