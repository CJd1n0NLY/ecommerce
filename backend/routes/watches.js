import express from 'express';
import watchController from '../controllers/watchController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', watchController.getAllWatches); 
router.get('/:id', watchController.getWatchById);
router.get('/preference/:preferenceId', watchController.getWatchesByPreference);
router.post('/', auth, watchController.createWatch); 
router.put('/:id', auth, watchController.updateWatch); 
router.delete('/:id', auth, watchController.deleteWatch);

export default router;
