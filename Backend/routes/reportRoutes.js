import express from 'express';
import { generateReportPdf } from '../controllers/reportController.js';

const router = express.Router({ mergeParams: true });

router.get('/generate-pdf', generateReportPdf);

export default router;
