// Script to list all packages
// Usage: node scripts/list-packages.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Package Schema
const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  roiPercentage: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

async function listPackages() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Get all packages
    const packages = await Package.find().sort({ minAmount: 1 });

    if (packages.length === 0) {
      console.log('No packages found in database.');
      process.exit(0);
    }

    console.log(`Found ${packages.length} package(s):\n`);
    console.log('═══════════════════════════════════════════════════════════════════════');

    packages.forEach((pkg, index) => {
      console.log(`\n${index + 1}. ${pkg.name}`);
      console.log('───────────────────────────────────────────────────────────────────────');
      console.log(`   ID:           ${pkg._id}`);
      console.log(`   Min Amount:   $${pkg.minAmount.toLocaleString()}`);
      console.log(`   Max Amount:   $${pkg.maxAmount.toLocaleString()}`);
      console.log(`   ROI:          ${pkg.roiPercentage}% daily`);
      console.log(`   Duration:     ${pkg.durationDays} days`);
      console.log(`   Active:       ${pkg.isActive ? '✓ Yes' : '✗ No'}`);
      console.log(`   Created:      ${pkg.createdAt?.toLocaleString() || 'N/A'}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

listPackages();
