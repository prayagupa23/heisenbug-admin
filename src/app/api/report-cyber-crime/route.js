import { jsPDF } from "jspdf";
import "jspdf-autotable";
import nodemailer from "nodemailer";

export async function POST(req) {
    const { report } = await req.json();

    // 1. Generate PDF
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL CYBER CRIME REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    const tableData = [
        ["Field", "Value"],
        ["Report ID", `REF-${Math.random().toString(36).toUpperCase().slice(2, 8)}`],
        ["Reporter Name", report.reporter_name],
        ["Reporter UPI", report.reporter_upi],
        ["Accused Name", report.reported_name],
        ["Accused UPI", report.reported_upi],
        ["Reason/Violation", report.reason],
    ];

    doc.autoTable({
        startY: 40,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid'
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // 2. Setup Nodemailer (Demo/Hackathon mode)
    // Use Mailtrap or a test Gmail account
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io", // Use Mailtrap for hackathon demos!
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    // 3. Send Email
    await transporter.sendMail({
        from: '"NexusPay Admin" <admin@nexuspay.com>',
        to: "cybercell-demo@gov.in",
        subject: `FRAUD ALERT: ${report.reported_upi}`,
        text: `Please find the attached fraud report for UPI ID: ${report.reported_upi}`,
        attachments: [
            {
                filename: `Report_${report.reported_upi}.pdf`,
                content: pdfBuffer
            }
        ]
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}