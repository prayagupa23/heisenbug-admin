import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        // Log to terminal to verify the API is even being hit
        console.log("API Triggered: Preparing email...");

        const { pdfBase64, caseID, subjectDetails } = await req.json();

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing ENV Variables");
            return NextResponse.json({ error: "Server configuration missing credentials" }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // 16-digit App Password
            },
        });

        const mailOptions = {
            from: `"NexusPay Security" <${process.env.EMAIL_USER}>`,
            to: 'sparthsalunke@gmail.com',
            subject: `🚨 Official Fraud Dispatch: ${caseID}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #e11d48;">NEXUSPAY SECURITY ALERT</h2>
                    <p><strong>Case ID:</strong> ${caseID}</p>
                    <p><strong>Accused UPI:</strong> ${subjectDetails}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #64748b;">The attached official evidence log has been generated via the NexusPay Admin Registry.</p>
                </div>
            `,
            attachments: [
                {
                    filename: `NXP_Evidence_${caseID}.pdf`,
                    content: pdfBase64,
                    encoding: 'base64',
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Detailed SMTP Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}