import express from 'express';
import { getSubcontractors, createSubcontractor, updateSubcontractor, deleteSubcontractor } from '../controllers/subcontractorController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getSubcontractors)
  .post(createSubcontractor);

router.route('/:id')
  .put(updateSubcontractor)
  .delete(deleteSubcontractor);

export default router;
