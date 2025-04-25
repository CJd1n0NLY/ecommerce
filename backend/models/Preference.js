import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Preference = sequelize.define('tbl_preferences', {
  preference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  preference_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'tbl_preferences',
  timestamps: false
});

// Import will be moved to a separate associations.js file

export default Preference;