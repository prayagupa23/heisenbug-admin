import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
    try {
        const { adminMessage } = await req.json();

        // Hackathon Team Numbers
        const teamNumbers = [
            'whatsapp:+918104584661',
            'whatsapp:+918169342724',
            'whatsapp:+919321486739'
        ];

        // Send messages
        const sendPromises = teamNumbers.map(number =>
            client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER, // Matches your .env
                to: number,
                body: `🚨 *NEXUSPAY SECURITY ALERT*\n\n${adminMessage}\n\n_Sent via Admin Console_`
            })
        );

        await Promise.all(sendPromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Twilio Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}