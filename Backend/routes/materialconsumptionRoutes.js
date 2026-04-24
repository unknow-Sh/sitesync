import express from 'express';
import { getMaterialConsumptions, createMaterialConsumption, updateMaterialConsumption, deleteMaterialConsumption } from '../controllers/materialconsumptionController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getMaterialConsumptions)
  .post(createMaterialConsumption);

router.route('/:id')
  .put(updateMaterialConsumption)
  .delete(deleteMaterialConsumption);

export default router;
