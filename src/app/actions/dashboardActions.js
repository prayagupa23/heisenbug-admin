'use server'

import { createSupabaseClient } from '@/lib/supabaseServer'

export async function getDashboardMetrics() {
    const supabase = createSupabaseClient()
    const last24h = new Date(Date.now() - 86400000).toISOString()

    const { data: volume } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', last24h)

    const totalVolume = volume?.reduce((s, t) => s + t.amount, 0) || 0

    const { data: blocked } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'blocked')

    const fraudBlocked = blocked?.reduce((s, t) => s + t.amount, 0) || 0

    const { count: highRisk } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('risk_level', 'high')

    const { count: users } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

    return { totalVolume, fraudBlocked, highRisk, users }
}
