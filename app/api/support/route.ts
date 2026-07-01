import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { sendMail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aurexcapital.com';

    // Construct support email template
    const subject = `Support Ticket from ${name} [Aurex Capital]`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eaeaea; rounded: 8px;">
        <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">New Support Inquiry</h2>
        <p><strong>Sender Name:</strong> ${name}</p>
        <p><strong>Sender Email:</strong> ${email}</p>
        <p><strong>Date Received:</strong> ${new Date().toLocaleString()}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #7c3aed; margin-top: 20px; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #555;">Message:</p>
          <p style="margin-top: 8px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <footer style="margin-top: 30px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
          Aurex Capital Platform Support Telemetry Desk
        </footer>
      </div>
    `;

    await sendMail({
      to: adminEmail,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Support API route error:', error);
    return NextResponse.json(
      { error: 'Failed to send support inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
