import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Profit from '@/models/Profit';
import Deposit from '@/models/Deposit';
import Package from '@/models/Package';
import mongoose from 'mongoose';

// GET: Fetch all profits with optional filters
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const packageId = searchParams.get('packageId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = {};
    if (userId) query.userId = userId;
    if (packageId) query.packageId = packageId;

    const profits = await Profit.find(query)
      .populate('userId', 'name email')
      .populate('packageId', 'name roiPercentage')
      .populate('depositId', 'amount')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(profits);
  } catch (error: any) {
    console.error('Error fetching profits:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch profits' 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { userId, amount, packageId, depositId, updateBalance = true } = await req.json();
    
    // Validate required fields
    if (!userId || !amount || !packageId || !depositId) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, amount, packageId, or depositId' 
      }, { status: 400 });
    }

    // Validate amount is positive
    const profitAmount = Number(amount);
    if (profitAmount <= 0) {
      return NextResponse.json({ 
        error: 'Profit amount must be greater than 0' 
      }, { status: 400 });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify deposit exists and is approved
    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    if (deposit.status !== 'approved') {
      return NextResponse.json({ 
        error: 'Deposit must be approved before adding profit' 
      }, { status: 400 });
    }

    // Verify deposit belongs to the user
    if (deposit.userId.toString() !== userId) {
      return NextResponse.json({ 
        error: 'Deposit does not belong to the selected user' 
      }, { status: 400 });
    }

    // Verify package exists
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Generate transaction hash
    const txHash = `profit-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create profit record
    const profit = await Profit.create({
      userId: new mongoose.Types.ObjectId(userId),
      packageId: new mongoose.Types.ObjectId(packageId),
      depositId: new mongoose.Types.ObjectId(depositId),
      amount: profitAmount,
      txHash,
      date: new Date()
    });

    // Update user balance if requested
    if (updateBalance) {
      user.balance = (user.balance || 0) + profitAmount;
      await user.save();
    }

    // Populate the profit record for response
    await profit.populate([
      { path: 'userId', select: 'name email' },
      { path: 'packageId', select: 'name roiPercentage' },
      { path: 'depositId', select: 'amount' }
    ]);

    return NextResponse.json({ 
      success: true, 
      profit,
      message: `Profit of $${profitAmount} added successfully${updateBalance ? ' and user balance updated' : ''}`,
      newBalance: user.balance
    });

  } catch (error: any) {
    console.error('Error adding profit:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to add profit' 
    }, { status: 500 });
  }
}
