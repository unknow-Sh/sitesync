import fs from 'fs';
import path from 'path';

const pagesDir = '/home/pc/Anti/CustomSoftware/Frontend/src/pages';
const filesToModify = [
  {
    file: 'LabourTracker.jsx',
    store: 'useLabourStore',
    action: 'fetchWorkers',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchWorkers(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'MaterialLog.jsx',
    store: 'useMaterialStore',
    action: 'fetchMaterials',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchMaterials(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'Milestones.jsx',
    store: 'useMilestoneStore',
    action: 'fetchMilestones',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchMilestones(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'EquipmentTracker.jsx',
    store: 'useEquipmentStore',
    action: 'fetchEquipment',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchEquipment(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'DocumentVault.jsx',
    store: 'useDocumentStore',
    action: 'fetchDocuments',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchDocuments(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'BudgetTracker.jsx',
    store: 'useBudgetStore',
    action: 'fetchBudget',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchBudget(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'Subcontractors.jsx',
    store: 'useSubcontractorStore',
    action: 'fetchSubcontractors',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchSubcontractors(projectId);\n  }, [projectId]);\n`
  },
  {
    file: 'LiveDashboard.jsx',
    store: 'useUpdatesStore',
    action: 'fetchUpdates',
    hookStr: `  useEffect(() => {\n    if (projectId) fetchUpdates(projectId);\n  }, [projectId]);\n`
  }
];

filesToModify.forEach((mod) => {
  const filePath = path.join(pagesDir, mod.file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ensure useEffect is imported from React
  if (!content.includes('useEffect')) {
    content = content.replace(/import React(.*?)from 'react';/, "import React, { useEffect$1} from 'react';");
    if (!content.includes('useEffect')) {
      content = content.replace(/import React from 'react';/, "import React, { useEffect } from 'react';");
    }
  }

  // Add the fetch action to the store destructuring
  const regex = new RegExp('const \\{ .*? \\} = ' + mod.store + '\\(\\);');
  const match = content.match(regex);
  if (match) {
    if (!match[0].includes(mod.action)) {
      content = content.replace(match[0], match[0].replace('} =', ', ' + mod.action + ' } ='));
    }
  }
  
  // Inject the useEffect hook after the store definitions (e.g. after 'const { projectId } = useParams();')
  if (!content.includes(mod.action + '(projectId)')) {
    content = content.replace(/const { projectId } = useParams\(\);/, "const { projectId } = useParams();\n" + mod.hookStr);
    // Or if it doesn't have useParams explicitly in the same predictable place:
    if (!content.includes(mod.hookStr.trim())) {
      const functionStartRegex = /export default function [a-zA-Z]+\(\) \{/;
      const startMatch = content.match(functionStartRegex);
      if (startMatch) {
         // Insert after the first few const statements inside the function body
         content = content.replace(functionStartRegex, startMatch[0] + "\n" + mod.hookStr);
      }
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Modified ${mod.file}`);
});

// Layout needs fetchProjects
const layoutPath = '/home/pc/Anti/CustomSoftware/Frontend/src/layouts/DashboardLayout.jsx';
if (fs.existsSync(layoutPath)) {
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (!layoutContent.includes('fetchProjects')) {
    layoutContent = layoutContent.replace(/const { activeProject } = useProjectStore\(\);/, "const { activeProject, fetchProjects } = useProjectStore();\n  useEffect(() => { fetchProjects(); }, []);");
    layoutContent = layoutContent.replace(/import React, { useState } from 'react';/, "import React, { useState, useEffect } from 'react';");
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('Modified DashboardLayout.jsx');
  }
}
