'use client'

import { ArrowRight } from 'lucide-react'

const alerts = [
  {
    severity: 'critical',
    transactionId: 'TXN-88392-LKA',
    user: 'Parth Salunke',
    amount: '₹45,000',
    riskScore: '89.7',
    flagType: 'Velocity Check Fail',
    action: 'Review'
  },
  {
    severity: 'warning',
    transactionId: 'TXN-10293-MMS',
    user: 'Deep Bandekar',
    amount: '₹12,500',
    riskScore: '45.5',
    flagType: 'Device Mismatch',
    action: 'Review'
  },
  {
    severity: 'low',
    transactionId: 'TXN-44512-00P',
    user: 'Vishesh Kamble',
    amount: '₹3,200',
    riskScore: '23.1',
    flagType: 'Unusual Location',
    action: 'Review'
  }
]

export default function SecurityAlertsTable() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent High-Risk Flags</h2>
        <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200">
          <span>View All Cases</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Transaction ID</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">User</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Amount</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className="border-b border-border last:border-b-0">
                <td className="py-3 px-2 text-sm text-foreground font-mono">{alert.transactionId}</td>
                <td className="py-3 px-2 text-sm text-foreground">{alert.user}</td>
                <td className="py-3 px-2 text-sm text-foreground">{alert.amount}</td>
                <td className="py-3 px-2 text-sm text-foreground">{alert.riskScore}</td>
                <td className="py-3 px-2 text-sm text-foreground">{alert.flagType}</td>
                <td className="py-3 px-2">
                  <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 hover:shadow-sm transition-all duration-200">
                    {alert.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
