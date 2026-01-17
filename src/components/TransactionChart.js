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
  ReferenceLine,
} from 'recharts'

const RANGE_MAP = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
}

export default function TransactionChart() {
  const [range, setRange] = useState('1W')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [range])

  async function fetchData() {
    setLoading(true)

    const days = RANGE_MAP[range]
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    fromDate.setHours(0, 0, 0, 0) // Start from the beginning of the day

    const { data: txns, error } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .gte('created_at', fromDate.toISOString())
        .order('created_at', { ascending: true })

    if (error) {
      console.error('Transaction fetch error:', error)
      setLoading(false)
      return
    }

    // Initialize grouped object to ensure chronological order and fill empty days
    const grouped = {}

    // Pre-fill keys for 1W to ensure a continuous graph even if some days have 0 transactions
    if (range === '1W') {
      for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
        grouped[label] = 0
      }
    }

    txns.forEach(txn => {
      const txnDate = new Date(txn.created_at)
      const label =
          days <= 7
              ? txnDate.toLocaleDateString('en-IN', { weekday: 'short' })
              : txnDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })

      // If key doesn't exist (for 1M/3M), initialize it
      if (grouped[label] === undefined) {
        grouped[label] = 0
      }

      grouped[label] += Number(txn.amount || 0) / 1000
    })

    const chartData = Object.keys(grouped).map(key => ({
      name: key,
      value: Math.round(grouped[key]),
    }))

    setData(chartData)
    setLoading(false)
  }

  const average =
      data.length > 0
          ? data.reduce((sum, d) => sum + d.value, 0) / data.length
          : 0

  return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Transaction Volume
            </h3>
            <p className="text-sm text-gray-500">
              Live data • Last {RANGE_MAP[range]} days
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
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="#f0f0f0" />

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
                      tickFormatter={v => `₹${v}K`}
                      width={40}
                  />

                  <Tooltip
                      formatter={v => [`₹${v}K`, 'Volume']}
                      labelFormatter={label => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                      }}
                  />

                  <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorValue)"
                      animationDuration={1500}
                  />

                  <ReferenceLine
                      y={average}
                      stroke="#9ca3af"
                      strokeDasharray="3 3"
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
            ₹{Math.round(average)}K
            <span className="ml-1 text-green-500">↑ 12.5%</span>
          </div>
        </div>
      </div>
  )
}





