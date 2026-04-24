import {
  User, Project, Worker, MaterialDelivery, MaterialConsumption,
  Milestone, BudgetItem, Expense, LiveUpdate, Equipment,
  Document, Subcontractor, Claim
} from './models/index.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDatabase = async () => {
  await connectDB();
  
  try {
    console.log('Clearing old data...');
    await Promise.all([
      User.deleteMany({}), Project.deleteMany({}), Worker.deleteMany({}),
      MaterialDelivery.deleteMany({}), MaterialConsumption.deleteMany({}),
      Milestone.deleteMany({}), BudgetItem.deleteMany({}), Expense.deleteMany({}),
      LiveUpdate.deleteMany({}), Equipment.deleteMany({}), Document.deleteMany({}),
      Subcontractor.deleteMany({}), Claim.deleteMany({})
    ]);

    console.log('Inserting Mock Projects...');
    const p1 = new Project({
      name: 'Andheri Residency Tower', client: 'Mr. Mehta', location: 'Andheri West, Mumbai', type: 'Residential',
      budget: 8500000, spent: 5200000, startDate: '2025-01-15', endDate: '2026-06-30',
      completion: 62, status: 'active', risk: 42, workers: 34, activeTasks: 8, lat: 19.1136, lng: 72.8697
    });
    await p1.save();

    console.log('Inserting Mock User...');
    const u1 = new User({
      name: 'Rajesh Kumar', email: 'owner@sitesync.in', role: 'owner', company: 'Kumar Constructions', password: 'demo123'
    });
    await u1.save();
    
    console.log('Inserting Mock Worker...');
    const w1 = new Worker({
      projectId: p1._id, name: 'Raju Dev', skill: 'Mason', dailyRate: 850, status: 'present'
    });
    await w1.save();

    console.log('Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
