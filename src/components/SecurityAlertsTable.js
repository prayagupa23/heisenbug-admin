'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SecurityAlertsTable() {
  const [txns, setTxns] = useState([])

  useEffect(() => {
    supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => setTxns(data || []))
  }, [])

  return (
      <table className="w-full">
        <thead>
        <tr>
          <th>ID</th><th>User</th><th>Amount</th><th>Risk</th><th>Status</th>
        </tr>
        </thead>
        <tbody>
        {txns.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.user_id}</td>
              <td>₹{t.amount}</td>
              <td>{t.risk_level}</td>
              <td>{t.status}</td>
            </tr>
        ))}
        </tbody>
      </table>
  )
}
