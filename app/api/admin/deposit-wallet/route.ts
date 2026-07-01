import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';

const DEPOSIT_WALLET_KEY = 'depositWalletAddress';
const DEPOSIT_COIN_KEY = 'depositCoinType';
const DEPOSIT_NETWORK_KEY = 'depositTransferNetwork';

// GET: Fetch the deposit wallet address, coin type, and network (accessible to all authenticated users)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Any authenticated user can view the wallet details
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const settingAddress = await Settings.findOne({ key: DEPOSIT_WALLET_KEY });
    const settingCoin = await Settings.findOne({ key: DEPOSIT_COIN_KEY });
    const settingNetwork = await Settings.findOne({ key: DEPOSIT_NETWORK_KEY });
    
    return NextResponse.json({ 
      address: settingAddress?.value || '',
      coinType: settingCoin?.value || 'USDT',
      network: settingNetwork?.value || 'TRC20'
    });
  } catch (error) {
    console.error('Error fetching deposit details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposit details' },
      { status: 500 }
    );
  }
}

// POST: Update the deposit wallet address, coin type, and network
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can update this
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { address, coinType, network } = await request.json();
    
    await dbConnect();
    
    if (address !== undefined && typeof address === 'string') {
      await Settings.findOneAndUpdate(
        { key: DEPOSIT_WALLET_KEY },
        { value: address },
        { new: true, upsert: true }
      );
    }

    if (coinType !== undefined && typeof coinType === 'string') {
      await Settings.findOneAndUpdate(
        { key: DEPOSIT_COIN_KEY },
        { value: coinType },
        { new: true, upsert: true }
      );
    }

    if (network !== undefined && typeof network === 'string') {
      await Settings.findOneAndUpdate(
        { key: DEPOSIT_NETWORK_KEY },
        { value: network },
        { new: true, upsert: true }
      );
    }
    
    const settingAddress = await Settings.findOne({ key: DEPOSIT_WALLET_KEY });
    const settingCoin = await Settings.findOne({ key: DEPOSIT_COIN_KEY });
    const settingNetwork = await Settings.findOne({ key: DEPOSIT_NETWORK_KEY });

    return NextResponse.json({ 
      success: true,
      address: settingAddress?.value || '',
      coinType: settingCoin?.value || 'USDT',
      network: settingNetwork?.value || 'TRC20'
    });
  } catch (error) {
    console.error('Error updating deposit details:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit details' },
      { status: 500 }
    );
  }
}
