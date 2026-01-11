'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { isAdminUser } from '@/lib/isAdmin'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import KPICard from '@/components/KPICard'
import TransactionChart from '@/components/TransactionChart'
import SystemHealth from '@/components/SystemHealth'
import GeographicRisk from '@/components/GeographicRisk'
import SecurityAlertsTable from '@/components/SecurityAlertsTable'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
}

function formatINR(amount) {
  if (!amount) return '₹0'
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(2)} Cr`
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let isMounted = true

    async function loadDashboard() {
      try {
        // 1. Admin check
        const allowed = await isAdminUser()
        if (!allowed) {
          window.location.href = '/login'
          return
        }

        // 2. Fetch dashboard metrics ONLY
        const { data: metrics, error: metricsError } = await supabase
            .from('dashboard_metrics')
            .select(`
            total_volume,
            fraud_blocked,
            high_risk_count,
            active_users_count
          `)
            .eq('period', 'lifetime') // ✅ IMPORTANT
            .order('calculated_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (metricsError) {
          console.error('Metrics fetch error:', metricsError.message)
          throw new Error('Failed to load dashboard metrics')
        }

        // 3. Safe fallback
        const loadedKpis = {
          totalVolume: metrics?.total_volume ?? 0,
          fraudBlocked: metrics?.fraud_blocked ?? 0,
          highRisk: metrics?.high_risk_count ?? 0,
          activeUsers: metrics?.active_users_count ?? 0
        }

        if (isMounted) {
          setKpis(loadedKpis)
          setLoading(false)
        }
      } catch (err) {
        console.error('Dashboard load error:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard')
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
              <div className="p-6 bg-card rounded-lg border border-destructive/20 text-center">
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="text-muted-foreground mt-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* KPIs */}
            <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              <KPICard title="Total Volume" value={formatINR(kpis.totalVolume)} icon="Monitor" />
              <KPICard title="Fraud Blocked" value={formatINR(kpis.fraudBlocked)} icon="Shield" />
              <KPICard title="High-Risk Flags" value={kpis.highRisk} icon="AlertTriangle" />
              <KPICard title="Active Users" value={kpis.activeUsers} icon="Users" />
            </motion.section>

            {/* Charts */}
            <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              <div className="xl:col-span-2">
                <TransactionChart />
              </div>
              <div className="space-y-6">
                <SystemHealth />
                <GeographicRisk />
              </div>
            </motion.section>

            {/* Table */}
            <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
            >
              <SecurityAlertsTable />
            </motion.section>
          </main>
        </div>
      </div>
  )
}


