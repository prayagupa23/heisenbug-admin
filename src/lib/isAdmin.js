'use client'

import { supabase } from './supabaseClient'

export async function isAdminUser() {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) return false

    const { data: admin } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('id', data.user.id)
        .single()

    return Boolean(admin?.is_active)
}
