// Script to test password update feature
// Usage: node scripts/test-password-update.js <email> <oldPassword> <newPassword>

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['investor', 'admin'], default: 'investor' },
  walletAddress: { type: String, required: true },
  balance: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationTokenExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function testPasswordUpdate(email, oldPassword, newPassword) {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  Password Update Test');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find user
    console.log(`🔍 Finding user: ${email}`);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`✗ User not found: ${email}`);
      process.exit(1);
    }
    
    console.log(`✓ User found: ${user.name}\n`);

    // Test 1: Verify old password
    console.log('📝 Test 1: Verifying old password...');
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    
    if (!isOldPasswordCorrect) {
      console.log('✗ Old password is incorrect!');
      console.log('   This is the error users would see: "Incorrect old password"');
      process.exit(1);
    }
    
    console.log('✓ Old password is correct\n');

    // Test 2: Check new password length
    console.log('📝 Test 2: Validating new password...');
    if (newPassword.length < 6) {
      console.log('✗ New password is too short (minimum 6 characters)');
      process.exit(1);
    }
    console.log(`✓ New password length is valid (${newPassword.length} characters)\n`);

    // Test 3: Update password
    console.log('📝 Test 3: Updating password in database...');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    console.log('✓ Password updated successfully\n');

    // Test 4: Verify new password works
    console.log('📝 Test 4: Verifying new password...');
    const updatedUser = await User.findById(user._id);
    const isNewPasswordCorrect = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (!isNewPasswordCorrect) {
      console.log('✗ New password verification failed!');
      process.exit(1);
    }
    console.log('✓ New password works correctly\n');

    // Test 5: Verify old password no longer works
    console.log('📝 Test 5: Verifying old password no longer works...');
    const oldStillWorks = await bcrypt.compare(oldPassword, updatedUser.password);
    
    if (oldStillWorks) {
      console.log('✗ Old password still works! Something went wrong.');
      process.exit(1);
    }
    console.log('✓ Old password no longer works\n');

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ✓ All Tests Passed!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n✅ Password update feature is working correctly!');
    console.log('\nUser Details:');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`   Name:          ${user.name}`);
    console.log(`   Email:         ${user.email}`);
    console.log(`   Role:          ${user.role}`);
    console.log(`   Balance:       $${user.balance.toLocaleString()}`);
    console.log(`   Wallet:        ${user.walletAddress || 'Not set'}`);
    console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
    console.log('─────────────────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
  }
}

// Get arguments
const email = process.argv[2];
const oldPassword = process.argv[3];
const newPassword = process.argv[4];

if (!email || !oldPassword || !newPassword) {
  console.error('Usage: node scripts/test-password-update.js <email> <oldPassword> <newPassword>');
  console.error('\nExample:');
  console.error('  node scripts/test-password-update.js "user@example.com" "oldPass123" "newPass456"');
  process.exit(1);
}

testPasswordUpdate(email, oldPassword, newPassword);
