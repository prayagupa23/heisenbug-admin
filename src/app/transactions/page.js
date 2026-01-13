'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadTransactions() {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
          id,
          amount,
          status,
          receiver_upi,
          created_at
        `)
                .order('created_at', { ascending: false })
                .limit(10)

            if (!error) {
                setTransactions(data || [])
            }

            setLoading(false)
        }

        loadTransactions()
    }, [])

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8 space-y-6 min-h-[calc(100vh-64px)]">
                    <div>
                        <h1 className="text-2xl font-semibold">Recent Transactions</h1>
                        <p className="text-sm text-muted-foreground">
                            Latest 10 UPI transactions
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 text-left">Txn ID</th>
                                    <th className="p-4 text-left">Receiver UPI</th>
                                    <th className="p-4 text-left">Amount</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Date</th>
                                </tr>
                                </thead>

                                <tbody>
                                {transactions.map(tx => (
                                    <tr
                                        key={tx.id}
                                        className="border-t border-border hover:bg-muted/40 transition"
                                    >
                                        <td className="p-4 font-mono text-xs">
                                            {tx.id}
                                        </td>

                                        <td className="p-4">
                                            {tx.receiver_upi || '—'}
                                        </td>

                                        <td className="p-4 font-medium">
                                            ₹{tx.amount.toLocaleString('en-IN')}
                                        </td>

                                        <td className="p-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                tx.status === 'blocked'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {tx.status}
                        </span>
                                        </td>

                                        <td className="p-4 text-muted-foreground">
                                            {new Date(tx.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                                {transactions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-6 text-center text-muted-foreground"
                                        >
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

