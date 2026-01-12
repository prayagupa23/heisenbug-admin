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

function formatINR(amount = 0) {
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(2)} Cr`
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState({
    totalVolume: 0,
    fraudBlocked: 0,
    highRisk: 0,
    activeUsers: 0
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      try {
        // ✅ Admin check
        const allowed = await isAdminUser()
        if (!allowed) {
          window.location.href = '/login'
          return
        }

        // ✅ Fetch ONE dashboard_metrics row
        const { data, error } = await supabase
            .from('dashboard_metrics')
            .select(`
            total_volume,
            fraud_blocked,
            high_risk_count,
            active_users_count
          `)
            .eq('period', 'all_time') // 🔥 must match DB exactly
            .order('calculated_at', { ascending: false })
            .limit(1)
            .single()

        if (error) throw error

        if (mounted) {
          setKpis({
            totalVolume: Number(data.total_volume) || 0,
            fraudBlocked: Number(data.fraud_blocked) || 0,
            highRisk: Number(data.high_risk_count) || 0,
            activeUsers: Number(data.active_users_count) || 0
          })
          setLoading(false)
        }
      } catch (err) {
        console.error('Dashboard error:', err)
        if (mounted) {
          setError('Failed to load dashboard metrics')
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
              <p className="text-destructive">{error}</p>
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

            {/* KPI CARDS */}
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

            {/* CHARTS */}
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

            {/* TABLE */}
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



