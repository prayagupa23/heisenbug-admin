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

    async function load() {
      try {
        console.log('Starting dashboard load...')
        
        const allowed = await isAdminUser()
        console.log('Admin check result:', allowed)
        
        if (!allowed) {
          console.log('User not authorized, redirecting to login...')
          window.location.href = '/login'
          return
        }

        // Mock data - Replace this with your actual data fetching logic
        const mockKpis = {
          totalVolume: 12500000, // 1.25 Cr
          fraudBlocked: 125000,  // 1.25 L
          highRisk: 18,
          activeUsers: 1243
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (isMounted) {
          setKpis(mockKpis)
          setLoading(false)
          console.log('Dashboard data loaded successfully')
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
        if (isMounted) {
          setError('Failed to load dashboard. Please try again.')
          setLoading(false)
        }
      }
    }

    load()

    // Cleanup function
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
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
            <div className="text-center space-y-4 max-w-md p-6 bg-card rounded-lg border border-destructive/20">
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-muted-foreground">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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

