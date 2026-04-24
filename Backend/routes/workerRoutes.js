import express from 'express';
import { getWorkers, createWorker, updateWorker, deleteWorker } from '../controllers/workerController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getWorkers)
  .post(createWorker);

router.route('/:id')
  .put(updateWorker)
  .delete(deleteWorker);

export default router;
