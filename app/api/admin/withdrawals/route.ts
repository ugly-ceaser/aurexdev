import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

// GET: List all withdrawals (Admin only)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const withdrawals = await Withdrawal.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  return NextResponse.json(withdrawals);
}

// PATCH: Approve or decline a withdrawal (Admin only)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { withdrawalId, status } = await request.json();
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) {
    return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
  }
  // Track previous status
  const previousStatus = withdrawal.status;
  withdrawal.status = status;
  await withdrawal.save();
  // If approved, deduct investor balance and send confirmation email
  if (status === 'approved') {
    const user = await User.findById(withdrawal.userId);
    if (user) {
      user.balance -= withdrawal.amount;
      await user.save();
      // Send withdrawal confirmation email
      const { sendMail } = await import('@/lib/mailer');
      const { getEmailTemplate } = await import('@/lib/emailTemplate');
      await sendMail({
        to: user.email,
        subject: 'Withdrawal Approved',
        html: getEmailTemplate({
          subject: 'Withdrawal Approved',
          message: `Dear ${user.name},<br/>Your withdrawal request of <b>$${withdrawal.amount}</b> has been approved and processed.<br/>Thank you for using our platform!`
        })
      });
    }
  }
  return NextResponse.json({ success: true, status, previousStatus });
}

// DELETE: Cancel/delete a pending withdrawal (Admin only)
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const withdrawalId = searchParams.get('withdrawalId');
  
  if (!withdrawalId) {
    return NextResponse.json({ error: 'Withdrawal ID is required' }, { status: 400 });
  }
  
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) {
    return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
  }
  
  // Only allow deletion of pending withdrawals
  if (withdrawal.status !== 'pending') {
    return NextResponse.json(
      { error: 'Only pending withdrawals can be cancelled' },
      { status: 400 }
    );
  }
  
  await Withdrawal.findByIdAndDelete(withdrawalId);
  return NextResponse.json({ success: true, message: 'Withdrawal cancelled successfully' });
}
