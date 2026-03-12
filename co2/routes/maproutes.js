import express from 'express';
import { getRoutes } from '../controllers/mapController.js';

const router = express.Router();

router.post('/routes', getRoutes);

export default router;