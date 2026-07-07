import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// GET: Check waitlist status for logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ joined: !!user.requestedCardWaitlist });
  } catch (error) {
    console.error('Error fetching waitlist status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Join the waitlist for logged-in user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.requestedCardWaitlist = true;
    await user.save();

    // Send confirmation email
    try {
      const { sendMail } = await import('@/lib/mailer');
      const { getEmailTemplate } = await import('@/lib/emailTemplate');
      await sendMail({
        to: user.email,
        subject: 'Waitlist Confirmed - Virtual USD Card',
        html: getEmailTemplate({
          subject: 'Virtual USD Card Waitlist',
          message: `Hi ${user.name},<br/><br/>You have successfully joined the waitlist for the upcoming Aurex Capital Virtual USD Card!<br/><br/>Your priority status is confirmed. We will notify you immediately once the virtual card is ready for activation.`
        })
      });
    } catch (emailError) {
      console.error('Error sending waitlist confirmation email:', emailError);
    }

    return NextResponse.json({ success: true, joined: true });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
