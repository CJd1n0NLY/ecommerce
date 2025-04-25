import express from 'express'
import auth from '../middleware/auth.js'
import transactionController from '../controllers/transactionController.js'

const router = express.Router()

router.post('/checkout-cart', auth, transactionController.createCheckoutCart)
router.post('/checkout', auth, transactionController.createCheckoutSingle)
router.get('/', auth, transactionController.getUserTransactions)
router.get('/:id', auth, transactionController.getTransactionById)

export default router
