// Script to delete package by name
// Usage: node scripts/delete-package.js "Diamond"

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

async function deletePackage(packageName) {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find package by name (case-insensitive)
    const pkg = await Package.findOne({ 
      name: { $regex: new RegExp(`^${packageName}$`, 'i') } 
    });

    if (!pkg) {
      console.log(`✗ Package "${packageName}" not found`);
      process.exit(1);
    }

    console.log('Found package:');
    console.log('─────────────────────────────────────');
    console.log(`ID:           ${pkg._id}`);
    console.log(`Name:         ${pkg.name}`);
    console.log(`Min Amount:   $${pkg.minAmount}`);
    console.log(`Max Amount:   $${pkg.maxAmount}`);
    console.log(`ROI:          ${pkg.roiPercentage}%`);
    console.log(`Duration:     ${pkg.durationDays} days`);
    console.log(`Is Active:    ${pkg.isActive}`);
    console.log('─────────────────────────────────────\n');

    // Delete the package
    await Package.findByIdAndDelete(pkg._id);
    console.log(`✓ Package "${pkg.name}" has been deleted successfully!`);

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

// Get package name from command line arguments
const packageName = process.argv[2];

if (!packageName) {
  console.error('Usage: node scripts/delete-package.js "PackageName"');
  console.error('Example: node scripts/delete-package.js "Diamond"');
  process.exit(1);
}

deletePackage(packageName);
