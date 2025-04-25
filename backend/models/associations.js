import User from './User.js';
import Preference from './Preference.js';
import CartItem from './CartItem.js';
import Watch from './Watch.js';
import Transaction from './Transaction.js';
import TransactionItem from './TransactionItem.js';

User.belongsToMany(Preference, {
  through: 'tbl_user_preferences',
  foreignKey: 'user_id',
  otherKey: 'preference_id',
  as: 'preferences'
});
Preference.belongsToMany(User, {
  through: 'tbl_user_preferences',
  foreignKey: 'preference_id',
  otherKey: 'user_id',
  as: 'users'
});

Watch.hasMany(CartItem, { foreignKey: 'watch_id', as: 'cartItems' });
CartItem.belongsTo(Watch, { foreignKey: 'watch_id', as: 'watch' });

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Transaction.hasMany(TransactionItem, { foreignKey: 'transaction_id', as: 'items' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });

Watch.hasMany(TransactionItem, { foreignKey: 'watch_id', as: 'transactionItems' });
TransactionItem.belongsTo(Watch, { foreignKey: 'watch_id', as: 'watch' });

export {
  User,
  Preference,
  Watch,
  CartItem,
  Transaction,
  TransactionItem
};