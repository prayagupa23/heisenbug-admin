'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { AlertTriangle, User, UserX } from 'lucide-react'

export default function ReportedCasesTable() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchReports() {
            const { data, error } = await supabase
                .from('user_reports')
                .select('reporter_upi, reported_name, reported_upi, reason, created_at')
                .order('created_at', { ascending: false })

            if (!error) setReports(data)
            setLoading(false)
        }
        fetchReports()
    }, [])

    if (loading) return <div className="p-8 text-center animate-pulse">Loading reported cases...</div>

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-foreground">Reported Fraud Cases</h2>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">
          {reports.length} Total Reports
        </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="p-4">Reporter UPI</th>
                        <th className="p-4">Reported Person</th>
                        <th className="p-4">Reported UPI</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4 text-right">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {reports.map((report, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-mono text-xs text-blue-600">{report.reporter_upi}</td>
                            <td className="p-4">
                                <div className="flex items-center space-x-2">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                    <span className="font-medium">{report.reported_name}</span>
                                </div>
                            </td>
                            <td className="p-4 font-mono text-xs text-red-600">{report.reported_upi}</td>
                            <td className="p-4">
                  <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs border border-red-100">
                    {report.reason}
                  </span>
                            </td>
                            <td className="p-4 text-right text-muted-foreground whitespace-nowrap">
                                {new Date(report.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    {reports.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-muted-foreground">
                                No fraud reports found in the system.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}