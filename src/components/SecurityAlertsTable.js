'use client'

import { ArrowRight } from 'lucide-react'

const alerts = [
  {
    severity: 'critical',
    transactionId: 'TXN-88392-LKA',
    user: 'John Doe',
    amount: '₹45,000',
    riskScore: '8.7',
    flagType: 'Velocity Check Fail',
    action: 'Review'
  },
  {
    severity: 'warning',
    transactionId: 'TXN-10293-MMS',
    user: 'Jane Smith',
    amount: '₹12,500',
    riskScore: '6.2',
    flagType: 'Device Mismatch',
    action: 'Review'
  },
  {
    severity: 'low',
    transactionId: 'TXN-44512-00P',
    user: 'Mike Johnson',
    amount: '₹3,200',
    riskScore: '3.1',
    flagType: 'Unusual Location',
    action: 'Review'
  }
]

export default function SecurityAlertsTable() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent High-Risk Flags</h2>
        <button className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80">
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
                  <button className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
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
