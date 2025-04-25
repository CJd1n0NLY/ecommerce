import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('tbl_users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_activeStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  user_role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  user_name: {
    type: DataTypes.STRING,  
    allowNull: true,  
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'tbl_users',
  timestamps: false
});

export default User;