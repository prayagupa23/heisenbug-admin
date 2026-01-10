'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // ✅ wait a moment for session to persist
        setTimeout(() => {
            window.location.href = '/'
        }, 500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <form
                onSubmit={handleLogin}
                className="bg-card p-6 rounded-lg shadow-md w-full max-w-sm"
            >
                <h1 className="text-xl font-semibold mb-4 text-center">
                    Admin Login
                </h1>

                {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-3 p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded"
                >
                    {loading ? 'Signing in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}
