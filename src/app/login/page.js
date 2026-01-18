'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            setTimeout(() => {
                window.location.href = '/'
            }, 600)
        } catch (err) {
            setError(err.message || 'Authentication failed.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">

            <div className="w-full max-w-[380px] bg-white rounded-[24px] shadow-2xl shadow-slate-200/60 p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">

                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        NexusPay
                    </h1>
                    <p className="text-base font-medium text-slate-600 mt-4">
                        Log In to your account
                    </p>
                </div>

                {/* Increased spacing from space-y-5 to space-y-8 */}
                <form onSubmit={handleLogin} className="space-y-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-[11px] py-2.5 px-3 rounded-lg border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="relative group">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@nexuspay.in"
                            className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            required
                        />
                    </div>

                    {/* The space-y-8 on the form adds significant gap here */}
                    <div className="relative group">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="flex justify-between items-center -mt-4">
                        <div /> {/* Spacer */}
                        <button type="button" className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition-colors">
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#FF4D30] hover:bg-[#E6452B] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#FF4D30]/25 transition-all active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100"
                    >
                        {loading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-6">
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        Secure Admin Gateway
                    </p>
                </div>
            </div>
        </div>
    )
}