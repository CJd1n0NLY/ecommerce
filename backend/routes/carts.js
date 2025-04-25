import express from 'express';
import cartController from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', cartController.findByUserId); 
router.get('/:cartId/items', cartController.getCartItems);  
router.post('/:userId', cartController.addToCart);
router.put('/:cartItemId', cartController.updateCartItem); 
router.delete('/items/:cartItemId', cartController.removeFromCart);
router.delete('/:cartId', cartController.clearCart); 

export default router;
