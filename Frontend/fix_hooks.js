const fs = require('fs');
const path = require('path');

const pagesDir = '/home/pc/Anti/CustomSoftware/Frontend/src/pages';
const stores = [
  { file: 'LabourTracker.jsx', store: 'useLabourStore', action: 'fetchWorkers' },
  { file: 'MaterialLog.jsx', store: 'useMaterialStore', action: 'fetchMaterials' },
  { file: 'Milestones.jsx', store: 'useMilestoneStore', action: 'fetchMilestones' },
  { file: 'EquipmentTracker.jsx', store: 'useEquipmentStore', action: 'fetchEquipment' },
  { file: 'DocumentVault.jsx', store: 'useDocumentStore', action: 'fetchDocuments' },
  { file: 'BudgetTracker.jsx', store: 'useBudgetStore', action: 'fetchBudget' },
  { file: 'Subcontractors.jsx', store: 'useSubcontractorStore', action: 'fetchSubcontractors' },
  { file: 'LiveDashboard.jsx', store: 'useUpdatesStore', action: 'fetchUpdates' }
];

stores.forEach(mod => {
  const filePath = path.join(pagesDir, mod.file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace direct call with getState() call to avoid dependency missing
  const badCall = `if (projectId) ${mod.action}(projectId);`;
  const goodCall = `if (projectId) ${mod.store}.getState().${mod.action}(projectId);`;
  content = content.replace(badCall, goodCall);
  
  // Fix the bad destructuring where fetchAction was added incorrectly.
  // Actually, we can just leave it or strip it. Let's just strip it to be clean.
  content = content.replace(`, ${mod.action} } =`, '} =');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', mod.file);
});

// Fix DashboardLayout
const layoutPath = '/home/pc/Anti/CustomSoftware/Frontend/src/layouts/DashboardLayout.jsx';
if (fs.existsSync(layoutPath)) {
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  layoutContent = layoutContent.replace('useEffect(() => { fetchProjects(); }, []);', 'useEffect(() => { useProjectStore.getState().fetchProjects(); }, []);');
  layoutContent = layoutContent.replace(', fetchProjects } = useProjectStore', '} = useProjectStore');
  fs.writeFileSync(layoutPath, layoutContent);
  console.log('Fixed DashboardLayout');
}

