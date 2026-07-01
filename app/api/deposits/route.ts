import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deposit from '@/models/Deposit';
import Package from '@/models/Package';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch all deposits for the logged-in user
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }
  const deposits = await Deposit.find({ userId: session.user.id }).populate('packageId').sort({ createdAt: -1 });
  return NextResponse.json(deposits);
}

// POST: Create a new deposit (manual)
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { packageId, amount, transactionHash } = await req.json();
  if (!packageId || !amount || !transactionHash) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Validate package exists
  const pkg = await Package.findById(packageId);
  if (!pkg) {
    return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
  }
  // Create deposit
  const deposit = await Deposit.create({
    userId: session.user.id,
    packageId: packageId,
    amount,
    txHash: transactionHash,
    status: 'pending',
  });
  await deposit.populate('packageId');
  return NextResponse.json(deposit);
}
