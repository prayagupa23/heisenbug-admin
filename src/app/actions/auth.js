// app/actions/auth.js
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function login(formData) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch (error) {
                        // Ignore cookie errors in Server Actions
                        // (common when middleware handles session refresh)
                        console.warn('Cookie set warning:', error.message)
                    }
                },
            },
        }
    )

    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Supabase login error:', error.message)
        return { error: error.message }
    }

    // Success path
    console.log('Login successful for:', data.user?.email)

    // Force refresh root layout and all dependent data
    // This helps the dashboard see the new session immediately
    revalidatePath('/', 'layout')

    // Perform the redirect (must NOT be in try/catch)
    redirect('/')
}

// Optional: Logout action
export async function logout() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch {}
                },
            },
        }
    )

    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}