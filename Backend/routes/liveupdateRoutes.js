import express from 'express';
import { getLiveUpdates, createLiveUpdate, updateLiveUpdate, deleteLiveUpdate } from '../controllers/liveupdateController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getLiveUpdates)
  .post(createLiveUpdate);

router.route('/:id')
  .put(updateLiveUpdate)
  .delete(deleteLiveUpdate);

export default router;
