'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import KPICard from '@/components/KPICard'
import TransactionChart from '@/components/TransactionChart'
import SystemHealth from '@/components/SystemHealth'
import GeographicRisk from '@/components/GeographicRisk'
import SecurityAlertsTable from '@/components/SecurityAlertsTable'

export default function Dashboard() {
  const kpiData = [
    {
      title: 'Total Volume (24h)',
      value: '₹124.5 Cr',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'Monitor',
      iconColor: 'bg-primary'
    },
    {
      title: 'Fraud Blocked',
      value: '₹12.5 L',
      change: '+8.7%',
      changeType: 'positive',
      icon: 'Shield',
      iconColor: 'bg-red-500'
    },
    {
      title: 'High-Risk Flags',
      value: '14',
      change: '+2',
      changeType: 'positive',
      icon: 'AlertTriangle',
      iconColor: 'bg-orange-500'
    },
    {
      title: 'Active Users',
      value: '8,420',
      change: '+12.3%',
      changeType: 'positive',
      icon: 'Users',
      iconColor: 'bg-blue-500'
    }
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {kpiData.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart - Takes 2 columns */}
              <div className="lg:col-span-2">
                <TransactionChart />
              </div>

              {/* Right Panel - Takes 1 column */}
              <div className="space-y-6">
                <SystemHealth />
                <GeographicRisk />
              </div>
            </div>

            {/* Security Alerts Table - Full width */}
            <div className="mt-6">
              <SecurityAlertsTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
