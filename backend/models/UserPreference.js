import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserPreference = sequelize.define('tbl_user_preferences', {
  user_preference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_users',
      key: 'user_id',
    },
  },
  preference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_preferences',
      key: 'preference_id',
    },
  },
}, {
  tableName: 'tbl_user_preferences',
  timestamps: false,
});

UserPreference.associate = (models) => {
    UserPreference.belongsTo(models.User, { foreignKey: 'user_id' });
    UserPreference.belongsTo(models.Preference, { foreignKey: 'preference_id' });
};

export default UserPreference;