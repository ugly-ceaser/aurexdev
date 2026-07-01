import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import Withdrawal from '@/models/Withdrawal';
import Profit from '@/models/Profit';
import bcrypt from 'bcryptjs';

// GET - Get detailed user information (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const userId = params.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user statistics
    const deposits = await Deposit.find({ userId }).populate('packageId', 'name');
    const withdrawals = await Withdrawal.find({ userId });
    const profits = await Profit.find({ userId });

    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
    const approvedDeposits = deposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0);
    const pendingDeposits = deposits.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
    
    const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);
    
    const totalProfits = profits.reduce((sum, p) => sum + p.amount, 0);

    // Active package (most recent approved deposit)
    const activeDeposit = deposits
      .filter(d => d.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const response = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        balance: user.balance,
        isBlocked: user.isBlocked,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Note: Password is hashed and cannot be decrypted
        passwordHash: user.password.substring(0, 20) + '...', // Show partial hash only
      },
      statistics: {
        totalDeposits,
        approvedDeposits,
        pendingDeposits,
        totalWithdrawals,
        approvedWithdrawals,
        pendingWithdrawals,
        totalProfits,
        netPosition: approvedDeposits + totalProfits - approvedWithdrawals,
        activePackage: activeDeposit?.packageId?.name || null,
      },
      recentActivity: {
        deposits: deposits.slice(0, 5).map(d => ({
          _id: d._id,
          amount: d.amount,
          status: d.status,
          package: d.packageId?.name,
          createdAt: d.createdAt,
        })),
        withdrawals: withdrawals.slice(0, 5).map(w => ({
          _id: w._id,
          amount: w.amount,
          status: w.status,
          createdAt: w.createdAt,
        })),
        profits: profits.slice(0, 5).map(p => ({
          _id: p._id,
          amount: p.amount,
          createdAt: p.createdAt,
        })),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Reset user password (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const userId = params.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send password reset email to user
    const { sendMail } = await import('@/lib/mailer');
    const { getEmailTemplate } = await import('@/lib/emailTemplate');
    
    await sendMail({
      to: user.email,
      subject: 'Your Password Has Been Reset',
      html: getEmailTemplate({
        subject: 'Password Reset by Admin',
        message: `Hi ${user.name},<br/><br/>Your password has been reset by an administrator.<br/><br/>Your new password is: <strong>${newPassword}</strong><br/><br/>Please log in and change this password immediately for security.`
      })
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      temporaryPassword: newPassword, // Return to admin for reference
    });
  } catch (error) {
    console.error('Error resetting user password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
