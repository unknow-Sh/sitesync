import { create } from 'zustand';

// ─── Projects Store ───────────────────────────────────────
export const useProjectStore = create((set, get) => ({
  projects: [
    {
      id: 'p1', name: 'Andheri Residency Tower', client: 'Mr. Mehta',
      location: 'Andheri West, Mumbai', type: 'Residential',
      budget: 8500000, spent: 5200000,
      startDate: '2025-01-15', endDate: '2026-06-30',
      completion: 62, status: 'active', risk: 42,
      workers: 34, activeTasks: 8,
      lat: 19.1136, lng: 72.8697,
    },
    {
      id: 'p2', name: 'Bandra Commercial Complex', client: 'Shah Enterprises',
      location: 'Bandra East, Mumbai', type: 'Commercial',
      budget: 18500000, spent: 6800000,
      startDate: '2025-06-01', endDate: '2027-03-31',
      completion: 28, status: 'active', risk: 25,
      workers: 56, activeTasks: 14,
      lat: 19.0596, lng: 72.8397,
    },
    {
      id: 'p3', name: 'Powai IT Campus – Phase 2', client: 'TechHub Pvt Ltd',
      location: 'Powai, Mumbai', type: 'Industrial',
      budget: 32000000, spent: 31200000,
      startDate: '2024-03-01', endDate: '2026-05-15',
      completion: 91, status: 'at-risk', risk: 74,
      workers: 12, activeTasks: 3,
      lat: 19.1197, lng: 72.9068,
    },
  ],
  activeProject: null,
  setActiveProject: (id) => set({ activeProject: get().projects.find(p => p.id === id) || null }),
  updateProject: (id, data) => set(state => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...data } : p),
    activeProject: state.activeProject?.id === id ? { ...state.activeProject, ...data } : state.activeProject,
  })),
}));

// ─── Labour Store ─────────────────────────────────────────
export const useLabourStore = create((set) => ({
  workers: {
    p1: [
      { id: 'w1', name: 'Raju Dev', skill: 'Mason', dailyRate: 850, photo: null, status: 'present' },
      { id: 'w2', name: 'Suresh Kumar', skill: 'Carpenter', dailyRate: 900, photo: null, status: 'present' },
      { id: 'w3', name: 'Mohan Lal', skill: 'Helper', dailyRate: 600, photo: null, status: 'absent' },
      { id: 'w4', name: 'Ramesh Yadav', skill: 'Electrician', dailyRate: 1100, photo: null, status: 'present' },
      { id: 'w5', name: 'Dinesh Patel', skill: 'Plumber', dailyRate: 1000, photo: null, status: 'half-day' },
      { id: 'w6', name: 'Anil Sharma', skill: 'Mason', dailyRate: 850, photo: null, status: 'present' },
    ],
    p2: [
      { id: 'w7', name: 'Vijay Singh', skill: 'Mason', dailyRate: 900, photo: null, status: 'present' },
      { id: 'w8', name: 'Prakash Mehta', skill: 'Helper', dailyRate: 650, photo: null, status: 'present' },
    ],
    p3: [
      { id: 'w9', name: 'Ashok Verma', skill: 'Electrician', dailyRate: 1150, photo: null, status: 'present' },
    ],
  },
  attendance: {},
  updateWorkerStatus: (projectId, workerId, status) =>
    set(state => ({
      workers: {
        ...state.workers,
        [projectId]: (state.workers[projectId] || []).map(w =>
          w.id === workerId ? { ...w, status } : w
        ),
      },
    })),
  addWorker: (projectId, worker) =>
    set(state => ({
      workers: {
        ...state.workers,
        [projectId]: [...(state.workers[projectId] || []), { ...worker, id: `w_${Date.now()}` }],
      },
    })),
}));

// ─── Materials Store ──────────────────────────────────────
export const useMaterialStore = create((set) => ({
  deliveries: {
    p1: [
      { id: 'd1', material: 'Cement (OPC 53)', qty: 500, unit: 'bags', supplier: 'ACC Ltd', rate: 420, date: '2026-04-20', challan: 'CH-2024-0482' },
      { id: 'd2', material: 'TMT Steel (Fe-500)', qty: 12, unit: 'tonnes', supplier: 'TATA Steel', rate: 62000, date: '2026-04-21', challan: 'TS-2024-1134' },
      { id: 'd3', material: 'Coarse Aggregate', qty: 30, unit: 'tonnes', supplier: 'Local Crusher', rate: 1800, date: '2026-04-22', challan: 'LC-0091' },
    ],
    p2: [
      { id: 'd4', material: 'Ready-Mix Concrete M30', qty: 80, unit: 'cubic m', supplier: 'RMC Readymix', rate: 5800, date: '2026-04-22', challan: 'RMC-0332' },
    ],
    p3: [],
  },
  consumption: {
    p1: [
      { id: 'c1', material: 'Cement (OPC 53)', qty: 380, unit: 'bags', task: 'Column RCC - 4th Floor', date: '2026-04-22' },
      { id: 'c2', material: 'TMT Steel (Fe-500)', qty: 8.5, unit: 'tonnes', task: 'Column RCC - 4th Floor', date: '2026-04-22' },
    ],
    p2: [],
    p3: [],
  },
  addDelivery: (projectId, delivery) =>
    set(state => ({
      deliveries: {
        ...state.deliveries,
        [projectId]: [...(state.deliveries[projectId] || []), { ...delivery, id: `d_${Date.now()}` }],
      },
    })),
  addConsumption: (projectId, entry) =>
    set(state => ({
      consumption: {
        ...state.consumption,
        [projectId]: [...(state.consumption[projectId] || []), { ...entry, id: `c_${Date.now()}` }],
      },
    })),
}));

// ─── Milestones Store ─────────────────────────────────────
export const useMilestoneStore = create((set) => ({
  milestones: {
    p1: [
      { id: 'm1', name: 'Foundation & Excavation', plannedStart: '2025-01-15', plannedEnd: '2025-03-31', actualEnd: '2025-04-12', completion: 100, status: 'delayed', delayDays: 12 },
      { id: 'm2', name: 'Structural RCC Work', plannedStart: '2025-04-01', plannedEnd: '2025-08-31', actualEnd: null, completion: 80, status: 'in-progress', delayDays: 8 },
      { id: 'm3', name: 'Brickwork & Masonry', plannedStart: '2025-09-01', plannedEnd: '2025-11-30', actualEnd: null, completion: 0, status: 'upcoming', delayDays: 0 },
      { id: 'm4', name: 'Plastering & Finishing', plannedStart: '2025-12-01', plannedEnd: '2026-03-31', actualEnd: null, completion: 0, status: 'upcoming', delayDays: 0 },
      { id: 'm5', name: 'MEP Works', plannedStart: '2026-01-01', plannedEnd: '2026-05-15', actualEnd: null, completion: 0, status: 'upcoming', delayDays: 0 },
      { id: 'm6', name: 'Handover & Finishing', plannedStart: '2026-05-01', plannedEnd: '2026-06-30', actualEnd: null, completion: 0, status: 'upcoming', delayDays: 0 },
    ],
    p2: [
      { id: 'm7', name: 'Piling & Foundation', plannedStart: '2025-06-01', plannedEnd: '2025-09-30', actualEnd: '2025-10-05', completion: 100, status: 'delayed', delayDays: 5 },
      { id: 'm8', name: 'Basement & Podium', plannedStart: '2025-10-01', plannedEnd: '2026-03-31', actualEnd: null, completion: 45, status: 'in-progress', delayDays: 0 },
      { id: 'm9', name: 'Tower Structure', plannedStart: '2026-04-01', plannedEnd: '2026-12-31', actualEnd: null, completion: 0, status: 'upcoming', delayDays: 0 },
    ],
    p3: [
      { id: 'm10', name: 'Structural Shell', plannedStart: '2024-03-01', plannedEnd: '2024-10-31', actualEnd: '2024-11-15', completion: 100, status: 'delayed', delayDays: 15 },
      { id: 'm11', name: 'Internal Fit-out', plannedStart: '2024-11-01', plannedEnd: '2025-08-31', actualEnd: '2025-10-20', completion: 100, status: 'delayed', delayDays: 50 },
      { id: 'm12', name: 'MEP & Services', plannedStart: '2025-08-01', plannedEnd: '2026-03-31', actualEnd: null, completion: 90, status: 'at-risk', delayDays: 24 },
      { id: 'm13', name: 'Commissioning & Handover', plannedStart: '2026-03-01', plannedEnd: '2026-05-15', actualEnd: null, completion: 15, status: 'at-risk', delayDays: 0 },
    ],
  },
}));

// ─── Budget Store ─────────────────────────────────────────
export const useBudgetStore = create((set) => ({
  budgets: {
    p1: {
      total: 8500000,
      items: [
        { id: 'b1', category: 'Labour', budget: 2500000, spent: 1680000 },
        { id: 'b2', category: 'Structural Materials', budget: 3200000, spent: 2100000 },
        { id: 'b3', category: 'Finishing Materials', budget: 800000, spent: 420000 },
        { id: 'b4', category: 'Equipment Rental', budget: 600000, spent: 580000 },
        { id: 'b5', category: 'Professional Fees', budget: 400000, spent: 280000 },
        { id: 'b6', category: 'Contingency', budget: 1000000, spent: 140000 },
      ],
      expenses: [
        { id: 'e1', desc: 'Week 14 Labour Payment', amount: 185000, category: 'Labour', date: '2026-04-20', payee: 'Mohan Singh (Supervisor)' },
        { id: 'e2', desc: 'TMT Steel Invoice #4421', amount: 744000, category: 'Structural Materials', date: '2026-04-21', payee: 'TATA Steel Ltd' },
        { id: 'e3', desc: 'JCB Rental - April 1-15', amount: 270000, category: 'Equipment Rental', date: '2026-04-15', payee: 'Sharma Equipment' },
      ],
    },
    p2: {
      total: 18500000,
      items: [
        { id: 'b7', category: 'Labour', budget: 5000000, spent: 1900000 },
        { id: 'b8', category: 'Structural Materials', budget: 7500000, spent: 2800000 },
        { id: 'b9', category: 'Equipment Rental', budget: 2000000, spent: 900000 },
        { id: 'b10', category: 'Professional Fees', budget: 1500000, spent: 600000 },
        { id: 'b11', category: 'Contingency', budget: 2500000, spent: 600000 },
      ],
      expenses: [],
    },
    p3: {
      total: 32000000,
      items: [
        { id: 'b12', category: 'Labour', budget: 8000000, spent: 7900000 },
        { id: 'b13', category: 'Structural Materials', budget: 12000000, spent: 12800000 },
        { id: 'b14', category: 'Equipment Rental', budget: 4000000, spent: 4200000 },
        { id: 'b15', category: 'Professional Fees', budget: 3000000, spent: 2800000 },
        { id: 'b16', category: 'Contingency', budget: 5000000, spent: 3500000 },
      ],
      expenses: [],
    },
  },
  addExpense: (projectId, expense) =>
    set(state => ({
      budgets: {
        ...state.budgets,
        [projectId]: {
          ...state.budgets[projectId],
          expenses: [...(state.budgets[projectId]?.expenses || []),
            { ...expense, id: `e_${Date.now()}` }],
        },
      },
    })),
}));

// ─── Live Updates Store (Module 01) ──────────────────────
export const useUpdatesStore = create((set) => ({
  updates: [
    { id: 'u1', projectId: 'p1', task: 'Column RCC - Grid E4', status: 'done', note: 'Concreting completed. 4 columns done.', time: '2026-04-24T09:15:00', user: 'Mohan Singh', gps_ok: true, photo: true },
    { id: 'u2', projectId: 'p1', task: 'Shuttering - 5th Floor Slab', status: 'in-progress', note: 'Shuttering 60% complete, need 4 more carpenters.', time: '2026-04-24T08:30:00', user: 'Mohan Singh', gps_ok: true, photo: true },
    { id: 'u3', projectId: 'p2', task: 'Basement RCC Cover Blocks', status: 'blocked', note: 'Blocked: cover block material not delivered yet.', time: '2026-04-24T07:45:00', user: 'Rajesh Sharma', gps_ok: true, photo: false },
    { id: 'u4', projectId: 'p1', task: 'Steel Reinforcement - 5th Floor', status: 'in-progress', note: 'Bar bending 80% done, binding started.', time: '2026-04-24T07:00:00', user: 'Mohan Singh', gps_ok: true, photo: true },
  ],
  addUpdate: (update) =>
    set(state => ({
      updates: [{ ...update, id: `upd_${Date.now()}`, time: new Date().toISOString() }, ...state.updates],
    })),
}));

// ─── Equipment Store ──────────────────────────────────────
export const useEquipmentStore = create((set) => ({
  equipment: {
    p1: [
      { id: 'eq1', type: 'Tower Crane', supplier: 'Ace Equipment', dailyRate: 22000, operator: 'Ramkumar J.', status: 'active', idleHours: 0 },
      { id: 'eq2', type: 'Concrete Pump', supplier: 'PumpMate', dailyRate: 14000, operator: 'Sanjay K.', status: 'idle', idleHours: 4 },
      { id: 'eq3', type: 'Transit Mixer', supplier: 'RMC Ready', dailyRate: 8000, operator: 'Vijay P.', status: 'active', idleHours: 0 },
    ],
    p2: [
      { id: 'eq4', type: 'JCB Excavator', supplier: 'Sharma Equipment', dailyRate: 18000, operator: 'Dilip S.', status: 'active', idleHours: 0 },
    ],
    p3: [],
  },
}));

// ─── Documents Store ──────────────────────────────────────
export const useDocumentStore = create((set) => ({
  documents: {
    p1: [
      { id: 'doc1', name: 'Building Permit – MCGM', category: 'Building Permit', expiry: '2026-08-15', status: 'valid', version: 1 },
      { id: 'doc2', name: 'Structural Drawing Rev.6', category: 'Structural Drawing', expiry: null, status: 'current', version: 6 },
      { id: 'doc3', name: 'Contractor Insurance Certificate', category: 'Insurance Certificate', expiry: '2026-05-10', status: 'expiring-soon', version: 1 },
      { id: 'doc4', name: 'Soil Investigation Report', category: 'Soil Report', expiry: null, status: 'current', version: 1 },
    ],
    p2: [
      { id: 'doc5', name: 'RERA Registration', category: 'Building Permit', expiry: '2027-12-31', status: 'valid', version: 1 },
      { id: 'doc6', name: 'Architectural Drawing Rev.4', category: 'Architectural Drawing', expiry: null, status: 'current', version: 4 },
    ],
    p3: [
      { id: 'doc7', name: 'Completion Certificate', category: 'Completion Certificate', expiry: null, status: 'current', version: 1 },
      { id: 'doc8', name: 'Fire NOC', category: 'Engineer NOC', expiry: '2026-04-30', status: 'critical', version: 1 },
    ],
  },
}));

// ─── Subcontractor Store ──────────────────────────────────
export const useSubcontractorStore = create((set) => ({
  subcontractors: {
    p1: [
      { id: 'sc1', name: 'Mehta Tile Works', trade: 'Tiling', rateType: 'per sqft', rate: 85, status: 'active', totalClaimed: 340000, paid: 280000 },
      { id: 'sc2', name: 'Singh Electrical', trade: 'Electrical', rateType: 'lump sum', rate: 1200000, status: 'active', totalClaimed: 480000, paid: 360000 },
      { id: 'sc3', name: 'AquaPlumb Services', trade: 'Plumbing', rateType: 'lump sum', rate: 850000, status: 'active', totalClaimed: 200000, paid: 200000 },
    ],
    p2: [
      { id: 'sc4', name: 'Patel Waterproofing', trade: 'Waterproofing', rateType: 'per sqft', rate: 120, status: 'active', totalClaimed: 156000, paid: 100000 },
    ],
    p3: [],
  },
  claims: {
    p1: [
      { id: 'cl1', scId: 'sc1', desc: 'Tiling - Lobby & Corridors Floor 1-5', qty: 2800, unit: 'sqft', amount: 238000, status: 'approved', date: '2026-04-18' },
      { id: 'cl2', scId: 'sc2', desc: 'Electrical Rough Works - Floor 1-4', qty: 1, unit: 'lot', amount: 240000, status: 'pending', date: '2026-04-22' },
      { id: 'cl3', scId: 'sc1', desc: 'Tiling - Staircase & Common Area', qty: 1200, unit: 'sqft', amount: 102000, status: 'revision', date: '2026-04-20', rejectionReason: 'Measurements unclear, please resubmit with photos' },
    ],
    p2: [],
    p3: [],
  },
}));
