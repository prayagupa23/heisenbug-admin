'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const timeFilters = ['24h', '7d', '30d']

const generateMockData = (filter) => {
  if (filter === '24h') {
    return [
      { time: '00:00', volume: 1200, fraud: 12 },
      { time: '04:00', volume: 800, fraud: 8 },
      { time: '08:00', volume: 2000, fraud: 18 },
      { time: '12:00', volume: 3500, fraud: 25 },
      { time: '16:00', volume: 2800, fraud: 22 },
      { time: '20:00', volume: 2200, fraud: 20 },
      { time: '23:59', volume: 1500, fraud: 15 },
    ]
  } else if (filter === '7d') {
    return [
      { time: 'Mon', volume: 15000, fraud: 120 },
      { time: 'Tue', volume: 18000, fraud: 135 },
      { time: 'Wed', volume: 22000, fraud: 145 },
      { time: 'Thu', volume: 19000, fraud: 130 },
      { time: 'Fri', volume: 25000, fraud: 155 },
      { time: 'Sat', volume: 12000, fraud: 95 },
      { time: 'Sun', volume: 10000, fraud: 85 },
    ]
  } else {
    return [
      { time: 'Week 1', volume: 95000, fraud: 720 },
      { time: 'Week 2', volume: 102000, fraud: 780 },
      { time: 'Week 3', volume: 98000, fraud: 745 },
      { time: 'Week 4', volume: 110000, fraud: 820 },
    ]
  }
}

export default function TransactionChart() {
  const [activeFilter, setActiveFilter] = useState('24h')
  const data = generateMockData(activeFilter)

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Transaction Volume vs Fraud</h2>
          <p className="text-sm text-muted-foreground">Real-time monitoring (24h)</p>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#111827'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#0742a0" 
              strokeWidth={2}
              dot={false}
              name="Volume"
            />
            <Line 
              type="monotone" 
              dataKey="fraud" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              name="Fraud"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
