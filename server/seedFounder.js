const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Wallet = require('./models/Wallet');

const seedFounderAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Founder Seeding...');

    const founderEmail = 'mdhassanraza0879@gmail.com';

    let founder = await User.findOne({ email: founderEmail });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('HassanAdmin@2026', salt);

    if (!founder) {
      founder = await User.create({
        name: 'Mohammad Hassan Raza',
        email: founderEmail,
        password: hashedPassword,
        role: 'client',
        companyName: 'FreelanceHub Inc.',
        username: 'hassanraza_founder',
        isVerified: true,
        isPremium: true,
        rating: 5.0,
        profileViews: 1250,
      });
      console.log('✅ Founder Super Admin account created!');
    } else {
      founder.name = 'Mohammad Hassan Raza';
      founder.password = hashedPassword;
      founder.isVerified = true;
      founder.isPremium = true;
      await founder.save();
      console.log('✅ Founder Super Admin account updated & verified!');
    }

    // Ensure Founder Wallet exists with Platform Revenue Balance
    let wallet = await Wallet.findOne({ user: founder._id });
    if (!wallet) {
      await Wallet.create({
        user: founder._id,
        balance: 50000,
        pendingPayouts: 12000,
        totalWithdrawn: 150000,
        bankDetails: {
          accountHolderName: 'Mohammad Hassan Raza',
          accountNumber: '987654321098',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          upiId: 'MdHassanRaza0879@gmail.com',
        },
        transactions: [
          {
            transactionId: 'PROFIT_FEE_9812',
            amount: 2500,
            type: 'credit',
            description: 'Platform 5% Revenue Share on Completed Client Contract',
            status: 'completed',
          },
          {
            transactionId: 'PREMIUM_SUB_4412',
            amount: 499,
            type: 'credit',
            description: 'Client Pro Monthly Membership Fee Settled',
            status: 'completed',
          },
        ],
      });
      console.log('✅ Founder Wallet with platform profit tracking initialized!');
    }

    console.log('\n==========================================');
    console.log('🎉 FOUNDER ACCOUNT CREATED & ACTIVE:');
    console.log(`Email:    ${founderEmail}`);
    console.log(`Password: HassanAdmin@2026`);
    console.log('==========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Founder Seeding Error:', err);
    process.exit(1);
  }
};

seedFounderAccount();
