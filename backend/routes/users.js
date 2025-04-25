// backend/routes/users.js
import express from 'express';
import userController from '../controllers/userController.js'; 
import auth from '../middleware/auth.js'; 

const router = express.Router();

router.get('/allUsersByAdmin', userController.getAllUsersByAdmin);  // Fetch all users

router.post('/register', userController.register);  // Register a new user
router.post('/login', userController.login);  // Login a user
router.get('/profile', auth, userController.getUserProfile);
router.put('/preferences', userController.updateUserPreferences);  // Update user preferences (requires authentication)
router.put('/:id', userController.updateUser);  

export default router;
