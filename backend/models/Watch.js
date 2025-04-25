import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Preference from './Preference.js';

const Watch = sequelize.define('tbl_watches', {
  watch_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  watch_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  watch_image: {
    type: DataTypes.STRING
  },
  watch_characteristic: {
    type: DataTypes.INTEGER,
    references: {
      model: Preference,
      key: 'preference_id'
    }
  },
  watch_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  watch_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'tbl_watches',
  timestamps: false
});

export default Watch;
