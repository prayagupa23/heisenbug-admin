'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const RANGE_MAP = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
}

export default function TransactionChart() {
  const [range, setRange] = useState('24h')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const days = RANGE_MAP[range]
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)

      const { data: txns, error } = await supabase
          .from('transactions')
          .select('amount, created_at, status')
          .gte('created_at', fromDate.toISOString())
          .order('created_at', { ascending: true })

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const grouped = {}

      txns.forEach(txn => {
        const label =
            days === 1
                ? `${new Date(txn.created_at).getHours()}:00`
                : new Date(txn.created_at).toLocaleDateString('en-IN')

        if (!grouped[label]) {
          grouped[label] = { time: label, volume: 0, fraud: 0 }
        }

        grouped[label].volume += Number(txn.amount || 0)
        if (txn.status === 'blocked') {
          grouped[label].fraud += Number(txn.amount || 0)
        }
      })

      setData(Object.values(grouped))
      setLoading(false)
    }

    fetchData()
  }, [range])

  return (
      <div className="bg-card border border-border rounded-lg p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Transaction Volume & Fraud
            </h3>
            <p className="text-sm text-muted-foreground">
              Aggregated view ({range})
            </p>
          </div>

          <div className="flex gap-2">
            {Object.keys(RANGE_MAP).map(r => (
                <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 text-sm rounded-md border ${
                        range === r
                            ? 'bg-background border-primary text-primary'
                            : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {r}
                </button>
            ))}
          </div>
        </div>

        {/* CHART */}
        {loading ? (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              Loading data…
            </div>
        ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                  />

                  <XAxis
                      dataKey="time"
                      fontSize={12}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                  />

                  <YAxis
                      fontSize={12}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                  />

                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                  />

                  <Line
                      type="monotone"
                      dataKey="volume"
                      name="Total Volume"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                  />

                  <Line
                      type="monotone"
                      dataKey="fraud"
                      name="Fraud Blocked"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
        )}
      </div>
  )
}


