'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts'

const RANGE_MAP = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
}

// Mock data generator
const generateMockData = (days) => {
  const data = []
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - days)
  
  // Generate data points for each week
  const weeks = Math.ceil(days / 7)
  const weekInMs = 7 * 24 * 60 * 60 * 1000
  
  for (let i = 0; i <= weeks; i++) {
    const date = new Date(startDate.getTime() + (i * weekInMs))
    const weekNum = i + 1
    
    // Generate realistic transaction volume (in thousands)
    const baseVolume = Math.sin(weekNum * 0.5) * 200 + 800 // Oscillating pattern
    const volume = Math.max(200, Math.floor(baseVolume + (Math.random() * 200 - 100))) // Add some randomness
    
    data.push({
      name: `W${weekNum}`,
      value: volume,
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    })
  }
  
  return data
}

export default function TransactionChart() {
  const [range, setRange] = useState('1W')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let chartData = []

      try {
        const days = RANGE_MAP[range]
        const fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - days)

        console.log('Fetching transactions from:', fromDate.toISOString())
        
        // First try to use mock data directly for testing
        console.log('Using mock data directly for testing')
        chartData = generateMockData(RANGE_MAP[range])
        console.log('Generated mock data:', chartData)
        
        // Commented out the Supabase call for now to test with mock data
        /*
        const { data: txns, error } = await supabase
          .from('transactions')
          .select('amount, created_at, status')
          .gte('created_at', fromDate.toISOString())
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching transactions, using mock data:', error)
          throw error
        }

        console.log('Fetched transactions:', txns)
        const grouped = {}

        txns.forEach(txn => {
          const label =
            days === 1
              ? `${new Date(txn.created_at).getHours()}:00`
              : new Date(txn.created_at).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short' 
                })

          if (!grouped[label]) {
            grouped[label] = { time: label, volume: 0, fraud: 0 }
          }

          grouped[label].volume += Number(txn.amount || 0)
          if (txn.status === 'blocked') {
            grouped[label].fraud += Number(txn.amount || 0)
          }
        })

        chartData = Object.values(grouped)
        setUseMockData(false)
        */
        
        setUseMockData(true) // Force using mock data for now
      } catch (error) {
        console.error('Error in fetchData:', error)
        console.log('Falling back to mock data due to error')
        chartData = generateMockData(RANGE_MAP[range])
        setUseMockData(true)
      }

      setData(chartData)
      setLoading(false)
    }

    fetchData()
  }, [range])

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Transaction Volume
          </h3>
          <p className="text-sm text-gray-500">
            {useMockData ? 'Mock data' : 'Aggregated view'} • {data[0]?.date} - {data[data.length - 1]?.date}
          </p>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {Object.keys(RANGE_MAP).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                range === r
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-200/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-[280px] flex items-center justify-center text-gray-500">
          Loading data…
        </div>
      ) : (
        <div className="h-[280px] -ml-2 -mr-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                vertical={false} 
                stroke="#f0f0f0"
              />
              
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickFormatter={(value) => `$${value}K`}
                width={35}
                padding={{ left: 5 }}
              />
              
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                }}
                formatter={(value) => [`$${value}K`, 'Volume']}
                labelFormatter={(label) => `Week ${label}`}
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
              />
              
              <ReferenceLine 
                y={data.reduce((a, b) => a + b.value, 0) / data.length} 
                stroke="#9ca3af" 
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
          <span>Transaction Volume</span>
        </div>
        <div className="text-gray-900 font-medium">
          ${Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}K
          <span className="ml-1 text-green-500">↑ 12.5%</span>
        </div>
      </div>
    </div>
  )
}


