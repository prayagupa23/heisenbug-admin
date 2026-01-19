import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Server-side Supabase client with proper error handling
export function createSupabaseClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are missing on server')
    }
    
    return createClient(supabaseUrl, supabaseAnonKey)
}
