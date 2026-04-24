import express from 'express';
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from '../controllers/milestoneController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getMilestones)
  .post(createMilestone);

router.route('/:id')
  .put(updateMilestone)
  .delete(deleteMilestone);

export default router;
