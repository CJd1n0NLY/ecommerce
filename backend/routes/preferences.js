import express from 'express';
import preferenceController from '../controllers/preferenceController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', preferenceController.getAllPreferences); 
router.get('/:id', preferenceController.getPreferenceById);
router.post('/', auth, preferenceController.createPreference); 
router.put('/:id', auth, preferenceController.updatePreference);
router.delete('/:id', auth, preferenceController.deletePreference); 

export default router;
