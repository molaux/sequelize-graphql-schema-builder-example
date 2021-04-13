/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-04-13 19:01:50.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Rental extends Model {
}

module.exports = (sequelize, extend) => {
  Rental.init(extend({
    rentalId: {
      type: DataTypes.INTEGER,
      field: 'rental_id',
      primaryKey: true,
      autoIncrement: true
    },
    rentalDate: {
      type: DataTypes.DATE,
      field: 'rental_date',
      allowNull: false
    },
    returnDate: {
      type: DataTypes.DATE,
      field: 'return_date'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      field: 'last_update',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }), {
    sequelize: sequelize,
    modelName: 'Rental',
    tableName: 'rental',
    indexes: [
      {
        name: 'rental_date',
        fields: ['rental_date', 'inventory_id', 'customer_id'],
        unique: true
      },
      {
        name: 'idx_fk_inventory_id',
        fields: ['inventory_id']
      },
      {
        name: 'idx_fk_customer_id',
        fields: ['customer_id']
      },
      {
        name: 'idx_fk_staff_id',
        fields: ['staff_id']
      }
    ],
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Rental.associate = () => {
    // 1 <=> N association
    Rental.hasMany(sequelize.models.Payment, {
      foreignKey: {
        name: 'rentalId',
        allowNull: true
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      targetKey: 'rentalId',
      as: 'Payments'
    })

    // N <=> 1 association
    Rental.belongsTo(sequelize.models.Inventory, {
      foreignKey: {
        name: 'inventoryId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'inventoryId'
    })

    // N <=> 1 association
    Rental.belongsTo(sequelize.models.Customer, {
      foreignKey: {
        name: 'customerId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'customerId'
    })

    // N <=> 1 association
    Rental.belongsTo(sequelize.models.Staff, {
      foreignKey: {
        name: 'staffId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'staffId'
    })
  }

  return Rental
}
