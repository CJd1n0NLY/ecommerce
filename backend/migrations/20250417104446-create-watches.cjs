'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_watches', {
      watch_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      watch_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      watch_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      watch_characteristic: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_preferences',
          key: 'preference_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      watch_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      watch_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_watches');
  }
};
