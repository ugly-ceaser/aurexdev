import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

// GET: Fetch all withdrawals for the logged-in user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }
  await dbConnect();
  const withdrawals = await Withdrawal.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(withdrawals);
}

// POST: Create a new withdrawal request
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  const { amount, walletAddress, coinType, transferNetwork } = await request.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Fetch the user
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const finalWallet = user.walletAddress || walletAddress;
  const finalCoin = user.coinType || coinType;
  const finalNetwork = user.transferNetwork || transferNetwork;

  if (!finalWallet || !finalCoin || !finalNetwork) {
    return NextResponse.json({ 
      error: 'Payout configurations (Wallet address, Coin Type, Network) are mandatory to initialize settlement.' 
    }, { status: 400 });
  }

  // Save details back to User document if not already configured
  let profileUpdated = false;
  if (!user.walletAddress && walletAddress) {
    user.walletAddress = walletAddress;
    profileUpdated = true;
  }
  if (!user.coinType && coinType) {
    user.coinType = coinType;
    profileUpdated = true;
  }
  if (!user.transferNetwork && transferNetwork) {
    user.transferNetwork = transferNetwork;
    profileUpdated = true;
  }
  if (profileUpdated) {
    await user.save();
  }

  // Create withdrawal request
  const withdrawal = await Withdrawal.create({
    userId: session.user.id,
    amount,
    status: 'pending',
  });
  
  return NextResponse.json(withdrawal);
}
