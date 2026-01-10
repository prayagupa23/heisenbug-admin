'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SecurityAlertsTable() {
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('receiver_upi, amount, risk_level, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (error) throw error
        setTxns(data || [])
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Receiver UPI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {txns.map((t, index) => (
              <tr key={index} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {t.receiver_upi || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  ₹{t.amount?.toLocaleString('en-IN') || '0'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap pl-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                    t.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t.risk_level?.toUpperCase() || 'NORMAL'}
                  </span>
                </td>
              </tr>
            ))}
            {txns.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
