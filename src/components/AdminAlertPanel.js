'use client';
import { useState } from 'react';
import { Send, ShieldCheck, AlertTriangle, Wrench, ChevronRight } from 'lucide-react';

export default function AdminAlertPanel() {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [verified, setVerified] = useState(false);

    const templates = [
        {
            label: 'UPI Security Advisory',
            content:
                'SECURITY ADVISORY: NexusPay will never request your UPI PIN for crediting funds. Do not share your PIN with any third party under any circumstances.',
        },
        {
            label: 'Phishing / Fake Domain Alert',
            content:
                'PHISHING ALERT: Unauthorized domain(s) detected (e.g. nexus-pay-secure.co). All official NexusPay operations are conducted exclusively through our mobile application and verified domain.',
        },
        {
            label: 'Scheduled Maintenance',
            content:
                'SERVICE NOTICE: Scheduled gateway maintenance & optimization is planned for 02:00 IST. Minor transaction delays may occur during this window (approx. 30–45 minutes).',
        },
    ];

    const handleBroadcast = async () => {
        if (!message.trim()) return;
        setSending(true);

        try {
            const res = await fetch('/api/broadcast-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminMessage: message.trim() }),
            });

            if (res.ok) {
                alert('Broadcast message successfully queued for global distribution.');
                setMessage('');
                setVerified(false);
            } else {
                alert('Failed to send broadcast. Please try again.');
            }
        } catch (err) {
            console.error('Broadcast error:', err);
            alert('An error occurred while sending the broadcast.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
            {/* Header - similar to dashboard overview style */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Security & Compliance Broadcast</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Create and dispatch global user advisories</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                        <ShieldCheck size={16} />
                        <span>System Secure</span>
                    </div>
                </div>
            </div>

            {/* Main Card Container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {/* Left - Templates */}
                    <div className="lg:col-span-1 bg-gray-50/40 p-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5">
                            Quick Response Templates
                        </h3>

                        <div className="space-y-3">
                            {templates.map((template, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setMessage(template.content);
                                        setVerified(false);
                                    }}
                                    className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {template.label}
                    </span>
                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right - Editor */}
                    <div className="lg:col-span-2 p-6 lg:p-8 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Broadcast Message
                                </label>
                                <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {message.length} / 160
                </span>
                            </div>

                            <textarea
                                className="w-full h-48 p-4 bg-white border border-gray-300 rounded-md text-sm text-gray-700
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                           resize-none placeholder:text-gray-400"
                                placeholder="Select a template above or compose your advisory message here..."
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    setVerified(false);
                                }}
                                maxLength={160}
                            />
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ShieldCheck size={14} className="text-blue-600" />
                                <span>Messages are sent via secure, auditable broadcast channel</span>
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                                {!verified ? (
                                    <button
                                        onClick={() => setVerified(true)}
                                        disabled={!message.trim()}
                                        className="px-7 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Review & Verify
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleBroadcast}
                                        disabled={sending || !message.trim()}
                                        className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {sending ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <Send size={14} />
                                                Send Broadcast
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}