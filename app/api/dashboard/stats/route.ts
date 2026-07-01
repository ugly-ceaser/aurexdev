import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
// Import Package first to ensure it's registered before other models that reference it
import Package from '@/models/Package';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import Withdrawal from '@/models/Withdrawal';
import Profit from '@/models/Profit';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Ensure Package model is registered
    if (!mongoose.models.Package) {
      await import('@/models/Package');
    }

    const userId = session.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get user balance
    const user = await User.findById(userObjectId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get total deposits (approved only)
    const approvedDeposits = await Deposit.find({ 
      userId: userObjectId, 
      status: 'approved' 
    });
    const totalDeposits = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);

    // Get total withdrawals (approved only)
    const approvedWithdrawals = await Withdrawal.find({ 
      userId: userObjectId, 
      status: 'approved' 
    });
    const totalWithdrawals = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);

    // Get total profits
    const allProfits = await Profit.find({ userId: userObjectId });
    const totalProfits = allProfits.reduce((sum, p) => sum + p.amount, 0);

    // Get active package (most recent approved deposit)
    const activeDeposit = await Deposit.findOne({
      userId: userObjectId,
      status: 'approved'
    }).populate('packageId').sort({ createdAt: -1 });

    const activePackage = activeDeposit?.packageId?.name || null;

    // Get pending deposits count
    const pendingDeposits = await Deposit.countDocuments({
      userId: userObjectId,
      status: 'pending'
    });

    // Get pending withdrawals count and amount
    const pendingWithdrawalsList = await Withdrawal.find({ 
      userId: userObjectId, 
      status: 'pending' 
    });
    const pendingWithdrawals = pendingWithdrawalsList.length;
    const pendingWithdrawalsAmount = pendingWithdrawalsList.reduce((sum, w) => sum + w.amount, 0);

    // Get recent transactions (last 5 of each type)
    const recentDeposits = await Deposit.find({ userId: userObjectId })
      .populate('packageId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean() as any[];

    const recentWithdrawals = await Withdrawal.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean() as any[];

    const recentProfits = await Profit.find({ userId: userObjectId })
      .populate('packageId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean() as any[];

    // Combine and sort all transactions
    const allTransactions = [
      ...recentDeposits.map((d: any) => ({
        _id: d._id.toString(),
        type: 'deposit' as const,
        amount: d.amount,
        status: d.status,
        createdAt: d.createdAt,
        packageName: d.packageId?.name || 'N/A',
        txHash: d.txHash,
      })),
      ...recentWithdrawals.map((w: any) => ({
        _id: w._id.toString(),
        type: 'withdrawal' as const,
        amount: w.amount,
        status: w.status,
        createdAt: w.createdAt,
      })),
      ...recentProfits.map((p: any) => ({
        _id: p._id.toString(),
        type: 'profit' as const,
        amount: p.amount,
        status: 'completed',
        createdAt: p.createdAt,
        packageName: p.packageId?.name || 'N/A',
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const response = {
      balance: user.balance,
      totalDeposits,
      totalWithdrawals,
      totalProfits,
      activePackage,
      pendingDeposits,
      pendingWithdrawals,
      pendingWithdrawalsAmount,
      recentTransactions: allTransactions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}