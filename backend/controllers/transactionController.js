import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';
import Transaction from '../models/Transaction.js';
import TransactionItem from '../models/TransactionItem.js';
import CartItem from '../models/CartItem.js';
import Watch from '../models/Watch.js';

const transactionController = {
  createCheckoutCart: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userId = req.user.id;
      const { cartId } = req.body;  
  
      if (!cartId) {
        return res.status(400).json({ message: 'Cart ID is required' });
      }
  
      const cartItems = await CartItem.findAll({
        where: { cart_id: cartId }, 
        include: [{ model: Watch, as: 'watch', attributes: ['watch_price'] }],
        transaction: t
      });
  
      if (cartItems.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      let total = 0;
      cartItems.forEach(item => {
        total += parseFloat(item.watch.watch_price) * item.quantity;
      });
  
      const transaction = await Transaction.create({
        user_id: userId,
        transaction_total: total,
        status: 'pending',
        payment_method: req.body.payment_method || null,
        shipping_address: req.body.shipping_address || null
      }, { transaction: t });
  
      const txItems = cartItems.map(item => ({
        transaction_id: transaction.transaction_id,
        watch_id: item.watch_id,
        unit_price: item.watch.watch_price,
        quantity: item.quantity,
        subtotal: parseFloat(item.watch.watch_price) * item.quantity
      }));
  
      await TransactionItem.bulkCreate(txItems, { transaction: t });
      await CartItem.destroy({ where: { cart_id: cartId }, transaction: t });
  
      await t.commit();
      return res.status(201).json({ transaction, items: txItems });
    } catch (error) {
      await t.rollback();
      console.error('CheckoutCart error:', error);
      return res.status(500).json({ message: 'Checkout failed', error: error.message });
    }
  },

  createCheckoutSingle: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userId = req.user.id;
      const { watchId, quantity = 1 } = req.body;

      const watch = await Watch.findByPk(watchId, { transaction: t });
      if (!watch) {
        await t.rollback();
        return res.status(404).json({ message: 'Watch not found' });
      }

      const unitPrice = parseFloat(watch.watch_price);
      const subtotal = unitPrice * quantity;

      const transaction = await Transaction.create({
        user_id: userId,
        transaction_total: subtotal,
        status: 'pending',
        payment_method: req.body.payment_method || null,
        shipping_address: req.body.shipping_address || null
      }, { transaction: t });

      const txItem = await TransactionItem.create({
        transaction_id: transaction.transaction_id,
        watch_id: watchId,
        unit_price: watch.watch_price,
        quantity,
        subtotal
      }, { transaction: t });

      await t.commit();
      return res.status(201).json({ transaction, item: txItem });
    } catch (error) {
      await t.rollback();
      console.error('CheckoutSingle error:', error);
      return res.status(500).json({ message: 'Checkout failed', error: error.message });
    }
  },

  getUserTransactions: async (req, res) => {
    try {
      const userId = req.user.id;
      const transactions = await Transaction.findAll({
        where: { user_id: userId },
        include: [{ model: TransactionItem, as: 'items', include: [{ model: Watch, as: 'watch' }] }]
      });
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('getUserTransactions error:', error);
      return res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const transaction = await Transaction.findOne({
        where: { transaction_id: id, user_id: userId },
        include: [{ model: TransactionItem, as: 'items', include: [{ model: Watch, as: 'watch' }] }]
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      console.error('getTransactionById error:', error);
      return res.status(500).json({ message: 'Failed to fetch transaction', error: error.message });
    }
  }
};

export default transactionController;
