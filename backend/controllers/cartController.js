import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Watch from "../models/Watch.js";
import sequelize from '../config/database.js';

export const findByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cartItems = await CartItem.findAll({
      where: { cart_id: cartId },
      include: [
        {
          model: Watch,  
          as: 'watch', 
          attributes: ['watch_name', 'watch_image', 'watch_price'], 
        }
      ]
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No items found in this cart' });
    }

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('Get cart items error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { watchId, quantity = 1 } = req.body;

    if (quantity <= 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    const watch = await Watch.findOne({ 
      where: { watch_id: watchId },
      transaction
    });
    
    if (!watch || watch.watch_stock < quantity) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ 
      where: { user_id: userId },
      transaction
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId }, { transaction });
    }

    let cartItem = await CartItem.findOne({
      where: { 
        cart_id: cart.cart_id,
        watch_id: watchId
      },
      transaction
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction });
    } else {
      cartItem = await CartItem.create({
        cart_id: cart.cart_id,
        watch_id: watchId,
        quantity
      }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json(cartItem);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const updatedItem = await CartItem.update({ quantity }, { where: { cart_item_id: cartItemId } });

    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await CartItem.destroy({ where: { cart_item_id: cartItemId } });

    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await CartItem.destroy({ where: { cart_id: cartId } });

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCartTotal = async (req, res) => {
  try {
    const { cartId } = req.params;
    const result = await CartItem.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('watch_price * quantity')), 'total']
      ],
      include: [
        {
          model: Watch,
          as: 'watch', 
          attributes: ['watch_price'],
        }
      ],
      where: { cart_id: cartId },
    });

    return res.status(200).json({ total: result[0]?.total || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { findByUserId, getCartItems, addToCart, updateCartItem, removeFromCart, clearCart, getCartTotal };
