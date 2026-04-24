import express from 'express';
import { getClaims, createClaim, updateClaim, deleteClaim } from '../controllers/claimController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getClaims)
  .post(createClaim);

router.route('/:id')
  .put(updateClaim)
  .delete(deleteClaim);

export default router;
