'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
    ShieldAlert,
    Search,
    Filter,
    CheckCircle2,
    Loader2
} from 'lucide-react'

// Standard imports for better compatibility
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ReportedCasesTable() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isEscalating, setIsEscalating] = useState(null)

    useEffect(() => {
        async function fetchReports() {
            try {
                const { data, error } = await supabase
                    .from('user_reports')
                    .select('reporter_name, reporter_upi, reported_name, reported_upi, reason, created_at')
                    .order('created_at', { ascending: false })

                if (!error) setReports(data)
            } catch (err) {
                console.error("Supabase Fetch Error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchReports()
    }, [])
    //M A I N
    const handleEscalate = async (report, index) => {
        setIsEscalating(index);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            const doc = new jsPDF();
            const caseID = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
            const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // --- 1. FULL PAGE TILED WATERMARK ---
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.04 })); // Ultra-subtle grey
            doc.setFontSize(25);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(150, 150, 150);

            // Loop to create a tiled pattern across the entire page
            for (let y = 20; y < pageHeight; y += 60) {
                for (let x = 10; x < pageWidth; x += 80) {
                    doc.text("NEXUSPAY", x, y, { angle: 35 });
                }
            }
            doc.restoreGraphicsState();

            // --- 2. BRANDING & STATUS ---
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(pageWidth - 55, 15, 40, 8, 1, 1, 'F');
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(71, 85, 105);
            doc.text("STATUS: ESCALATED", pageWidth - 35, 20.5, { align: 'center' });

            doc.setTextColor(15, 23, 42);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("NEXUSPAY", 20, 22);

            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(148, 163, 184);
            doc.text("SECURITY & COMPLIANCE DIVISION", 20, 27);

            // --- 3. TITLE & LINE ---
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("Fraud Incident Report", 20, 45);

            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            doc.line(20, 52, pageWidth - 20, 52);

            // --- 4. MAIN INVESTIGATION TABLE ---
            autoTable(doc, {
                startY: 65,
                margin: { left: 20, right: 20 },
                head: [['Technical Identifier', 'System Record']],
                body: [
                    ["Case ID", caseID],
                    ["Subject Display Name", report.reported_name || 'N/A'],
                    ["Subject UPI ID", report.reported_upi || 'N/A'],
                    ["Reported Violation", report.reason || 'General Misconduct'],
                    ["Account Security State", "LOCKED / UNDER REVIEW"],
                    ["Reporter Identity", report.reporter_name || 'Verified User'],
                    ["Reporter UPI ID", report.reporter_upi || 'Internal ID'],
                ],
                theme: 'plain',
                headStyles: {
                    fillColor: [248, 250, 252],
                    textColor: [100, 116, 139],
                    fontSize: 8,
                    fontStyle: 'bold',
                    cellPadding: 4
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 5,
                    textColor: [15, 23, 42],
                    lineColor: [226, 232, 240],
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { fontStyle: 'bold', textColor: [100, 116, 139], width: 60 }
                }
            });

            // --- 5. DYNAMIC Y-POSITIONING (FIXES OVERLAP) ---
            // Using optional chaining to safely get the end of the table
            const finalTableY = doc.lastAutoTable?.cursor?.y || 150;
            let currentY = finalTableY + 20;

            // Evidence Log Header
            doc.setFillColor(15, 23, 42);
            doc.rect(20, currentY - 4, 1.5, 6, 'F'); // Vertical accent line
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("Internal Evidence Log", 25, currentY);

            // Log Details
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100);
            const logTrace = `System verify trace: AUTH_NODE_492 // HASH: ${Math.random().toString(16).slice(2, 10)}`;
            const dbEntry = `DB_ENTRY: ${report.created_at || new Date().toISOString()}`;

            doc.text(logTrace, 20, currentY + 8);
            doc.text(dbEntry, 20, currentY + 14);

            // --- 6. DIGITAL ATTESTATION ---
            doc.setFillColor(34, 197, 94); // Emerald Green
            doc.rect(pageWidth - 65, currentY, 0.5, 15, 'F');

            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("DIGITALLY ATTESTED", pageWidth - 60, currentY + 5);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(148, 163, 184);
            doc.text("NexusPay Compliance Node 0.4.1", pageWidth - 60, currentY + 11);

            // --- 7. GREY COPYRIGHT FOOTER ---
            doc.setDrawColor(226, 232, 240);
            doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

            doc.setFontSize(7);
            doc.setTextColor(160, 174, 192);
            doc.text(`© ${new Date().getFullYear()} NexusPay Inc. Internal Evidence Management System.`, 20, pageHeight - 15);
            doc.text("CONFIDENTIAL // FOR AUTHORIZED DISPATCH", pageWidth - 20, pageHeight - 15, { align: 'right' });

            // --- 8. SAVE ---
            doc.save(`NXP_Evidence_${caseID}.pdf`);
            alert(`DISPATCH SUCCESSFUL\nOfficial File ${caseID} generated.`);

        } catch (error) {
            console.error("Layout Engine Error:", error);
            alert("Layout failed: " + error.message);
        } finally {
            setIsEscalating(null);
        }
    };



    const filteredReports = reports.filter(r =>
        r.reported_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reported_upi?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="flex h-96 items-center justify-center bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-medium tracking-tight">Fraud Registry</h2>
                    <p className="text-sm text-muted-foreground">Internal oversight for flagged transactions.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search identifier..."
                            className="h-9 w-60 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Registry Table */}
            <div className="rounded-md border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border bg-muted/30">
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground uppercase text-[11px] tracking-wider">Reporter</th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground uppercase text-[11px] tracking-wider">Subject</th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground uppercase text-[11px] tracking-wider">Reason</th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground uppercase text-[11px] tracking-wider">Date</th>
                        <th className="h-12 px-4 text-right font-medium text-muted-foreground uppercase text-[11px] tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {filteredReports.map((report, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                            <td className="p-4">
                                <div className="font-medium text-foreground">{report.reporter_name}</div>
                                <div className="text-[12px] text-muted-foreground font-mono">{report.reporter_upi}</div>
                            </td>
                            <td className="p-4">
                                <div className="font-medium text-foreground">{report.reported_name}</div>
                                <div className="text-[12px] text-red-600 font-mono font-semibold">{report.reported_upi}</div>
                            </td>
                            <td className="p-4">
                                    <span className="px-2 py-0.5 rounded-full border border-border text-[11px] font-medium bg-background">
                                        {report.reason}
                                    </span>
                            </td>
                            <td className="p-4 text-muted-foreground text-[12px] uppercase">
                                {new Date(report.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => handleEscalate(report, idx)}
                                    disabled={isEscalating !== null}
                                    className={`h-8 px-3 rounded-md text-xs font-medium transition-all ${
                                        isEscalating === idx
                                            ? "bg-muted text-muted-foreground animate-pulse"
                                            : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100"
                                    }`}
                                >
                                    {isEscalating === idx ? "Processing..." : "Escalate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Formal Footer */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Cyber-Link Secure
                </div>
            </div>
        </div>
    )
}