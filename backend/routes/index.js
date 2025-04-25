import express from 'express';
import userRoutes from './users.js';
import cartRoutes from './carts.js';
import preferenceRoutes from './preferences.js';
import transactionRoutes from './transactions.js';
import watchRoutes from './watches.js';

const router = express.Router();

// Use the individual route files
router.use('/users', userRoutes);
router.use('/carts', cartRoutes);
router.use('/preferences', preferenceRoutes);
router.use('/transactions', transactionRoutes);
router.use('/watches', watchRoutes);

export default router;
