// Script to verify a user's password
// Usage: node scripts/verify-password.js <email> <password>

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['investor', 'admin'], default: 'investor' },
  walletAddress: { type: String },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function verifyPassword(email, password) {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected\n');

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`✗ User not found: ${email}`);
      process.exit(1);
    }

    console.log('User Found:');
    console.log('───────────────────────────────────────');
    console.log(`Name:     ${user.name}`);
    console.log(`Email:    ${user.email}`);
    console.log(`Role:     ${user.role}`);
    console.log(`Balance:  $${user.balance.toLocaleString()}`);
    console.log('───────────────────────────────────────\n');

    // Verify password
    console.log('Verifying password...');
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('✅ Password is CORRECT!\n');
    } else {
      console.log('❌ Password is INCORRECT!\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

// Get arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/verify-password.js <email> <password>');
  console.error('\nExample:');
  console.error('  node scripts/verify-password.js "user@example.com" "myPassword123"');
  process.exit(1);
}

verifyPassword(email, password);
