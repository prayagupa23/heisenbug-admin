import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { pdfBase64, caseID, subjectDetails } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"NexusPay Security & Compliance" <${process.env.EMAIL_USER}>`,
            to: 'visheshy2k17@gmail.com',
            subject: `OFFICIAL DISPATCH: Fraud Incident Report [${caseID}]`,
            html: `
                <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        
                        <div style="background-color: #0f172a; padding: 30px; text-align: left;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">NEXUSPAY</h1>
                            <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Security & Compliance Division</p>
                        </div>

                        <div style="padding: 40px; color: #1e293b;">
                            <div style="display: inline-block; padding: 4px 12px; background-color: #fee2e2; color: #b91c1c; border-radius: 9999px; font-size: 11px; font-weight: bold; margin-bottom: 20px;">
                                PRIORITY: HIGH / ESCALATED
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #0f172a;">Official Incident Dispatch</h2>
                            
                            <p style="line-height: 1.6; margin-bottom: 30px; font-size: 15px;">
                                An automated escalation has been triggered for a potential fraud incident. The internal investigation logs and verified evidence are attached to this correspondence for your immediate review.
                            </p>

                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; width: 140px;">Case Reference</td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 13px; font-weight: bold;">${caseID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Flagged Identifier</td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #e11d48; font-size: 13px; font-weight: bold; font-family: monospace;">${subjectDetails}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Dispatch Timestamp</td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 13px;">${new Date().toUTCString()}</td>
                                </tr>
                            </table>

                            <div style="background-color: #f8fafc; border-left: 4px solid #0f172a; padding: 15px; margin-bottom: 30px;">
                                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                                    <strong>Confidentiality Notice:</strong> This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed.
                                </p>
                            </div>
                        </div>

                        <div style="background-color: #f1f5f9; padding: 20px 40px; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                                © 2026 NexusPay Inc. Internal Evidence Management System<br>
                                Automated Security Dispatch Node 0.4.1
                            </p>
                        </div>
                    </div>
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
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("SMTP ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}