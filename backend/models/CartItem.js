import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cart from './Cart.js';
import Watch from './Watch.js';

const CartItem = sequelize.define('tbl_cart_items', {
  cart_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cart,
      key: 'cart_id'
    }
  },
  watch_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Watch,
      key: 'watch_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'tbl_cart_items',
  timestamps: false
});

export default CartItem;
