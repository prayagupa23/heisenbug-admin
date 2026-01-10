'use client'

import { supabase } from './supabaseClient'

export async function isAdminUser() {
    try {
        console.log('Checking admin status...')
        
        // Get the current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !sessionData?.session) {
            console.log('No active session found')
            return false
        }
        
        console.log('User session found, checking admin status...')
        
        // Get the user from the session
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError || !userData?.user) {
            console.error('Error getting user:', userError?.message || 'No user data')
            return false
        }
        
        console.log('Fetching admin status for user:', userData.user.id)
        
        // Check if user is admin
        const { data: admin, error: adminError } = await supabase
            .from('admin_users')
            .select('is_active')
            .eq('id', userData.user.id)
            .single()
            
        if (adminError) {
            console.error('Error checking admin status:', adminError)
            return false
        }
        
        const isAdmin = Boolean(admin?.is_active)
        console.log('User is admin:', isAdmin)
        
        return isAdmin
    } catch (error) {
        console.error('Error in isAdminUser:', error)
        return false
    }
}
