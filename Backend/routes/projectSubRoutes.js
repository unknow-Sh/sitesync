import express from 'express';
import workerRoutes from './workerRoutes.js';
import materialdeliveryRoutes from './materialdeliveryRoutes.js';
import materialconsumptionRoutes from './materialconsumptionRoutes.js';
import milestoneRoutes from './milestoneRoutes.js';
import budgetitemRoutes from './budgetitemRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import liveupdateRoutes from './liveupdateRoutes.js';
import equipmentRoutes from './equipmentRoutes.js';
import documentRoutes from './documentRoutes.js';
import subcontractorRoutes from './subcontractorRoutes.js';
import claimRoutes from './claimRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = express.Router({ mergeParams: true });

router.use('/:projectId/workers', workerRoutes);
router.use('/:projectId/material/deliveries', materialdeliveryRoutes);
router.use('/:projectId/material/consumption', materialconsumptionRoutes);
router.use('/:projectId/milestones', milestoneRoutes);
router.use('/:projectId/budget-items', budgetitemRoutes);
router.use('/:projectId/expenses', expenseRoutes);
router.use('/:projectId/updates', liveupdateRoutes);
router.use('/:projectId/equipment', equipmentRoutes);
router.use('/:projectId/documents', documentRoutes);
router.use('/:projectId/subcontractors', subcontractorRoutes);
router.use('/:projectId/claims', claimRoutes);
router.use('/:projectId/report', reportRoutes);

export default router;
