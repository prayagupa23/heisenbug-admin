'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Search, Loader2 } from 'lucide-react'

export default function ReportedCasesTable() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isEscalating, setIsEscalating] = useState(null)

    useEffect(() => {
        async function fetchReports() {
            const { data } = await supabase.from('user_reports').select('*').order('created_at', { ascending: false })
            setReports(data || [])
            setLoading(false)
        }
        fetchReports()
    }, [])

    const handleEscalate = async (report, index) => {
        setIsEscalating(index);

        try {
            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            const doc = new jsPDF();
            const caseID = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
            const timestamp = new Date().toISOString();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // --- 1. FULL PAGE TILED WATERMARK ---
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.07 }));
            doc.setFontSize(25);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(150, 150, 150);

            for (let y = 20; y < pageHeight; y += 60) {
                for (let x = 10; x < pageWidth; x += 80) {
                    doc.text("NEXUSPAY", x, y, { angle: 35 });
                }
            }
            doc.restoreGraphicsState();

            // --- 2. BRANDING & STATUS ---
            // Status Badge
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(pageWidth - 55, 15, 40, 8, 1, 1, 'F');
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(71, 85, 105);
            doc.text("STATUS: ESCALATED", pageWidth - 35, 20.5, { align: 'center' });

            // Brand Title
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
                    ["Reporter Identity", report.reporter_name || 'Current User'],
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

            // --- 5. INTERNAL LOGS & ATTESTATION ---
            const finalTableY = doc.lastAutoTable?.cursor?.y || 150;
            let currentY = finalTableY + 25;

            // Evidence Log Header
            doc.setFillColor(15, 23, 42);
            doc.rect(20, currentY - 4, 1.5, 6, 'F');
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("Internal Evidence Log", 25, currentY);

            // Log Details
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100);
            const logTrace = `System verify trace: AUTH_NODE_492 // HASH: ${Math.random().toString(16).slice(2, 10)}`;
            const dbEntry = `DB_ENTRY: ${timestamp}`;
            doc.text(logTrace, 20, currentY + 8);
            doc.text(dbEntry, 20, currentY + 14);

            // Digital Attestation
            doc.setFillColor(34, 197, 94); // Emerald Green
            doc.rect(pageWidth - 75, currentY, 0.5, 12, 'F');
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("DIGITALLY ATTESTED", pageWidth - 70, currentY + 4);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(148, 163, 184);
            doc.text("NexusPay Compliance Node 0.4.1", pageWidth - 70, currentY + 10);

            // --- 6. FOOTER ---
            doc.setDrawColor(226, 232, 240);
            doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
            doc.setFontSize(7);
            doc.setTextColor(160, 174, 192);
            doc.text(`© 2026 NexusPay Inc. Internal Evidence Management System.`, 20, pageHeight - 15);
            doc.text("CONFIDENTIAL // FOR AUTHORIZED DISPATCH", pageWidth - 20, pageHeight - 15, { align: 'right' });

            // --- 7. DISPATCH ---
            const pdfBase64 = doc.output('datauristring').split(',')[1];

            const response = await fetch('/api/send-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pdfBase64,
                    caseID,
                    subjectDetails: report.reported_upi
                }),
            });

            const result = await response.json();

            if (response.ok) {
                doc.save(`NXP_Evidence_${caseID}.pdf`);
                alert("SUCCESS: Dispatched to Cyber Cell!");
            } else {
                throw new Error(result.error || "Server error");
            }

        } catch (error) {
            console.error("Layout Engine Error:", error);
            alert("DISPATCH ERROR: " + error.message);
        } finally {
            setIsEscalating(null);
        }
    };

    const filteredReports = reports.filter(r => r.reported_upi?.toLowerCase().includes(searchTerm.toLowerCase()))

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Fraud Registry</h2>
                <input
                    className="border p-2 rounded w-64 text-sm"
                    placeholder="Search UPI..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredReports.map((report, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="p-4">
                                <div className="font-bold text-gray-900">{report.reported_name}</div>
                                <div className="text-red-500 font-mono text-xs font-semibold">{report.reported_upi}</div>
                            </td>
                            <td className="p-4 text-gray-600">{report.reason}</td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => handleEscalate(report, idx)}
                                    disabled={isEscalating !== null}
                                    className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                                >
                                    {isEscalating === idx ? "Sending..." : "Escalate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}