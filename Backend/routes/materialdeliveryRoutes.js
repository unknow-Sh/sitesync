import express from 'express';
import { getMaterialDeliverys, createMaterialDelivery, updateMaterialDelivery, deleteMaterialDelivery } from '../controllers/materialdeliveryController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getMaterialDeliverys)
  .post(createMaterialDelivery);

router.route('/:id')
  .put(updateMaterialDelivery)
  .delete(deleteMaterialDelivery);

export default router;
