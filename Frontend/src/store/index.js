import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api';

// ─── Projects Store ───────────────────────────────────────
export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProject: null,
  fetchProjects: async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      set({ projects: data });
    } catch (e) { console.error('Failed to fetch projects', e); }
  },
  setActiveProject: (id) => set({ activeProject: get().projects.find(p => p.id === id) || null }),
  updateProject: async (id, payload) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      set(state => ({
        projects: state.projects.map(p => p.id === id ? data : p),
        activeProject: state.activeProject?.id === id ? data : state.activeProject,
      }));
    } catch (e) { console.error('Failed to update project', e); }
  },
}));

// ─── Labour Store ─────────────────────────────────────────
export const useLabourStore = create((set) => ({
  workers: {},
  fetchWorkers: async (projectId) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/workers`);
      const data = await res.json();
      set(state => ({ workers: { ...state.workers, [projectId]: data } }));
    } catch (e) { console.error(e); }
  },
  updateWorkerStatus: async (projectId, workerId, status) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/workers/${workerId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      const data = await res.json();
      set(state => ({
        workers: {
          ...state.workers,
          [projectId]: (state.workers[projectId] || []).map(w => w.id === workerId ? data : w),
        },
      }));
    } catch (e) { console.error(e); }
  },
  addWorker: async (projectId, worker) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/workers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(worker)
      });
      const data = await res.json();
      set(state => ({
        workers: {
          ...state.workers,
          [projectId]: [...(state.workers[projectId] || []), data],
        },
      }));
    } catch (e) { console.error(e); }
  },
  deleteWorker: async (projectId, workerId) => {
    try {
      await fetch(`${API_URL}/projects/${projectId}/workers/${workerId}`, { method: 'DELETE' });
      set(state => ({
        workers: { ...state.workers, [projectId]: (state.workers[projectId] || []).filter(w => w.id !== workerId) }
      }));
    } catch (e) { console.error(e); }
  },
}));

// ─── Materials Store ──────────────────────────────────────
export const useMaterialStore = create((set) => ({
  deliveries: {},
  consumption: {},
  fetchMaterials: async (projectId) => {
    try {
      const [dRes, cRes] = await Promise.all([
        fetch(`${API_URL}/projects/${projectId}/material/deliveries`),
        fetch(`${API_URL}/projects/${projectId}/material/consumption`)
      ]);
      const dData = await dRes.json();
      const cData = await cRes.json();
      set(state => ({
        deliveries: { ...state.deliveries, [projectId]: dData },
        consumption: { ...state.consumption, [projectId]: cData }
      }));
    } catch (e) { console.error(e); }
  },
  addDelivery: async (projectId, delivery) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/material/deliveries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(delivery)
      });
      const data = await res.json();
      set(state => ({ deliveries: { ...state.deliveries, [projectId]: [...(state.deliveries[projectId] || []), data] } }));
    } catch (e) { console.error(e); }
  },
  deleteDelivery: async (projectId, id) => {
    try {
      await fetch(`${API_URL}/projects/${projectId}/material/deliveries/${id}`, { method: 'DELETE' });
      set(state => ({ deliveries: { ...state.deliveries, [projectId]: (state.deliveries[projectId] || []).filter(d => d.id !== id) } }));
    } catch (e) { console.error(e); }
  },
  addConsumption: async (projectId, entry) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/material/consumption`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry)
      });
      const data = await res.json();
      set(state => ({ consumption: { ...state.consumption, [projectId]: [...(state.consumption[projectId] || []), data] } }));
    } catch (e) { console.error(e); }
  },
}));

// ─── Milestones Store ─────────────────────────────────────
export const useMilestoneStore = create((set) => ({
  milestones: {},
  fetchMilestones: async (projectId) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/milestones`);
      const data = await res.json();
      set(state => ({ milestones: { ...state.milestones, [projectId]: data } }));
    } catch (e) { console.error(e); }
  },
}));

// ─── Budget Store ─────────────────────────────────────────
export const useBudgetStore = create((set) => ({
  budgets: {},
  fetchBudget: async (projectId) => {
    try {
      const [itemsRes, expRes] = await Promise.all([
        fetch(`${API_URL}/projects/${projectId}/budget-items`),
        fetch(`${API_URL}/projects/${projectId}/expenses`)
      ]);
      const items = await itemsRes.json();
      const expenses = await expRes.json();
      const total = items.reduce((sum, item) => sum + (item.budget || 0), 0);
      set(state => ({
        budgets: { ...state.budgets, [projectId]: { total, items, expenses } }
      }));
    } catch (e) { console.error(e); }
  },
  addExpense: async (projectId, expense) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/expenses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expense)
      });
      const data = await res.json();
      set(state => {
        const projBudget = state.budgets[projectId] || { total: 0, items: [], expenses: [] };
        return { budgets: { ...state.budgets, [projectId]: { ...projBudget, expenses: [...projBudget.expenses, data] } } };
      });
    } catch (e) { console.error(e); }
  },
}));

// ─── Live Updates Store (Module 01) ──────────────────────
export const useUpdatesStore = create((set) => ({
  updates: [],
  fetchUpdates: async (projectId) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/updates`);
      const data = await res.json();
      set({ updates: data.sort((a, b) => new Date(b.time) - new Date(a.time)) });
    } catch (e) { console.error(e); }
  },
  addUpdate: async (projectId, update) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/updates`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(update)
      });
      const data = await res.json();
      // Only prepend if we're currently viewing the same project
      set(state => ({ updates: [data, ...state.updates] }));
    } catch (e) { console.error(e); }
  },
}));

// ─── Equipment Store ──────────────────────────────────────
export const useEquipmentStore = create((set) => ({
  equipment: {},
  fetchEquipment: async (projectId) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/equipment`);
      const data = await res.json();
      set(state => ({ equipment: { ...state.equipment, [projectId]: data } }));
    } catch (e) { console.error(e); }
  },
}));

// ─── Documents Store ──────────────────────────────────────
export const useDocumentStore = create((set) => ({
  documents: {},
  fetchDocuments: async (projectId) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/documents`);
      const data = await res.json();
      set(state => ({ documents: { ...state.documents, [projectId]: data } }));
    } catch (e) { console.error(e); }
  },
}));

// ─── Subcontractor Store ──────────────────────────────────
export const useSubcontractorStore = create((set) => ({
  subcontractors: {},
  claims: {},
  fetchSubcontractors: async (projectId) => {
    try {
      const [scRes, clRes] = await Promise.all([
        fetch(`${API_URL}/projects/${projectId}/subcontractors`),
        fetch(`${API_URL}/projects/${projectId}/claims`)
      ]);
      const scData = await scRes.json();
      const clData = await clRes.json();
      set(state => ({
        subcontractors: { ...state.subcontractors, [projectId]: scData },
        claims: { ...state.claims, [projectId]: clData }
      }));
    } catch (e) { console.error(e); }
  },
}));
