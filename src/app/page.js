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

  useEffect(() => {
    if (typeof window === 'undefined') return

    async function load() {
      const allowed = await isAdminUser()
      if (!allowed) {
        window.location.href = '/login'
        return
      }

      // fetch dashboard data AFTER auth
    }

    load()
  }, [])


  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center text-muted-foreground">
          Loading analytics…
        </div>
    )
  }

  return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto p-8 space-y-10">

            {/* KPI SECTION */}
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

            {/* CHART */}
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

