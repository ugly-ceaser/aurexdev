import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Deposit from '@/models/Deposit';
import User from '@/models/User';
import Package from '@/models/Package';

export async function GET() {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const deposits = await Deposit.find({})
      .populate('userId', 'name email balance')
      .populate('packageId', 'name minAmount maxAmount roiPercentage')
      .sort({ createdAt: -1 });
    
    console.log('Deposits fetched:', deposits.length);
    return NextResponse.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { depositId, status } = await req.json();
    
    if (!depositId || !status) {
      return NextResponse.json({ error: 'Missing depositId or status' }, { status: 400 });
    }

    // Validate status
    if (!['pending', 'approved', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be pending, approved, or declined' }, { status: 400 });
    }

    await dbConnect();
    
    // Get the deposit before updating
    const existingDeposit = await Deposit.findById(depositId);
    if (!existingDeposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    const previousStatus = existingDeposit.status;

    // Update deposit status
    const deposit = await Deposit.findByIdAndUpdate(
      depositId,
      { status },
      { new: true }
    ).populate('userId', 'name email balance')
     .populate('packageId', 'name roiPercentage');
    
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    // If approving a deposit, optionally update user's investment tracking
    // (You can add balance update here if needed)
    if (status === 'approved' && previousStatus !== 'approved') {
      console.log(`Deposit ${depositId} approved. User: ${deposit.userId.name}, Amount: $${deposit.amount}`);
      // Optional: Update user balance or create investment record
      // const user = await User.findById(deposit.userId._id);
      // user.balance += deposit.amount;
      // await user.save();
    }

    // If declining after approval, reverse any changes
    if (status === 'declined' && previousStatus === 'approved') {
      console.log(`Deposit ${depositId} declined after approval. May need to reverse balance changes.`);
      // Optional: Reverse balance update if needed
    }

    console.log(`Deposit ${depositId} status updated from ${previousStatus} to ${status}`);
    
    return NextResponse.json({ 
      success: true,
      deposit,
      message: `Deposit ${status} successfully`,
      previousStatus 
    });
  } catch (error) {
    console.error('Error updating deposit:', error);
    return NextResponse.json({ error: 'Failed to update deposit' }, { status: 500 });
  }
}

// DELETE: Cancel a deposit (only if pending)
export async function DELETE(req: Request) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const depositId = searchParams.get('depositId');
    
    if (!depositId) {
      return NextResponse.json({ error: 'Missing depositId' }, { status: 400 });
    }

    await dbConnect();
    
    const deposit = await Deposit.findById(depositId);
    
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    // Only allow deletion of pending deposits
    if (deposit.status !== 'pending') {
      return NextResponse.json({ 
        error: `Cannot delete ${deposit.status} deposits. Only pending deposits can be cancelled.` 
      }, { status: 400 });
    }

    await Deposit.findByIdAndDelete(depositId);
    
    console.log(`Deposit ${depositId} cancelled and deleted`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Deposit cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling deposit:', error);
    return NextResponse.json({ error: 'Failed to cancel deposit' }, { status: 500 });
  }
}
