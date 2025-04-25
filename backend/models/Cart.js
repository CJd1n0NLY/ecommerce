import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Cart = sequelize.define('tbl_carts', {
  cart_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'tbl_carts',
  timestamps: false
});

export default Cart;
