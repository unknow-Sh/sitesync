import express from 'express';
import { getEquipments, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getEquipments)
  .post(createEquipment);

router.route('/:id')
  .put(updateEquipment)
  .delete(deleteEquipment);

export default router;
