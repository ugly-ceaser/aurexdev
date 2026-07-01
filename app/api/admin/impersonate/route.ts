import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// POST - Admin login as user with master password
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { userEmail, masterPassword } = await request.json();

    if (!userEmail || !masterPassword) {
      return NextResponse.json(
        { error: 'User email and master password are required' },
        { status: 400 }
      );
    }

    // Verify master password (stored in environment variable)
    const MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD;

    if (!MASTER_PASSWORD) {
      return NextResponse.json(
        { error: 'Master password not configured' },
        { status: 500 }
      );
    }

    if (masterPassword !== MASTER_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid master password' },
        { status: 401 }
      );
    }

    // Find the user to impersonate
    const user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: 'This user account is blocked' },
        { status: 403 }
      );
    }

    // Generate a temporary login token
    const loginToken = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      adminEmail: session.user.email, // Track which admin logged in
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Successfully authorized to log in as ${user.name}`,
      loginToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error in admin impersonation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
