import express from 'express';
import { getBudgetItems, createBudgetItem, updateBudgetItem, deleteBudgetItem } from '../controllers/budgetitemController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getBudgetItems)
  .post(createBudgetItem);

router.route('/:id')
  .put(updateBudgetItem)
  .delete(deleteBudgetItem);

export default router;
