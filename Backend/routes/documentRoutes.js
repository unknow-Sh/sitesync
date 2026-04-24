import express from 'express';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '../controllers/documentController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getDocuments)
  .post(createDocument);

router.route('/:id')
  .put(updateDocument)
  .delete(deleteDocument);

export default router;
