import mongoose from 'mongoose';

mongoose.plugin((schema) => {
  schema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; }});
  schema.set('toObject', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; }});
});

// 1. User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  company: String,
  avatar: String,
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 2. Project
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: String,
  location: String,
  type: String,
  budget: Number,
  spent: Number,
  startDate: String,
  endDate: String,
  completion: Number,
  status: String,
  risk: Number,
  workers: Number,
  activeTasks: Number,
  lat: Number,
  lng: Number
});
const Project = mongoose.model('Project', projectSchema);

// 3. Worker (Labour)
const workerSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: String,
  skill: String,
  dailyRate: Number,
  photo: String,
  status: String // present, absent, half-day
});
const Worker = mongoose.model('Worker', workerSchema);

// 4. Material Delivery
const materialDeliverySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  material: String,
  qty: Number,
  unit: String,
  supplier: String,
  rate: Number,
  date: String,
  challan: String
});
const MaterialDelivery = mongoose.model('MaterialDelivery', materialDeliverySchema);

// 5. Material Consumption
const materialConsumptionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  material: String,
  qty: Number,
  unit: String,
  task: String,
  date: String
});
const MaterialConsumption = mongoose.model('MaterialConsumption', materialConsumptionSchema);

// 6. Milestone
const milestoneSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: String,
  plannedStart: String,
  plannedEnd: String,
  actualEnd: String,
  completion: Number,
  status: String,
  delayDays: Number
});
const Milestone = mongoose.model('Milestone', milestoneSchema);

// 7. Budget Item
const budgetItemSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  category: String,
  budget: Number,
  spent: Number
});
const BudgetItem = mongoose.model('BudgetItem', budgetItemSchema);

// 8. Expense
const expenseSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  desc: String,
  amount: Number,
  category: String,
  date: String,
  payee: String
});
const Expense = mongoose.model('Expense', expenseSchema);

// 9. Live Update
const liveUpdateSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  task: String,
  status: String,
  note: String,
  time: String,
  user: String,
  gps_ok: Boolean,
  photo: Boolean
});
const LiveUpdate = mongoose.model('LiveUpdate', liveUpdateSchema);

// 10. Equipment
const equipmentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: String,
  supplier: String,
  dailyRate: Number,
  operator: String,
  status: String,
  idleHours: Number
});
const Equipment = mongoose.model('Equipment', equipmentSchema);

// 11. Document
const documentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: String,
  category: String,
  expiry: String,
  status: String,
  version: Number
});
const Document = mongoose.model('Document', documentSchema);

// 12. Subcontractor
const subcontractorSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: String,
  trade: String,
  rateType: String,
  rate: Number,
  status: String,
  totalClaimed: Number,
  paid: Number
});
const Subcontractor = mongoose.model('Subcontractor', subcontractorSchema);

// 13. Claim
const claimSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  scId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcontractor' },
  desc: String,
  qty: Number,
  unit: String,
  amount: Number,
  status: String, // approved, pending, revision
  date: String,
  rejectionReason: String
});
const Claim = mongoose.model('Claim', claimSchema);

export {
  User, Project, Worker, MaterialDelivery, MaterialConsumption,
  Milestone, BudgetItem, Expense, LiveUpdate, Equipment,
  Document, Subcontractor, Claim
};
