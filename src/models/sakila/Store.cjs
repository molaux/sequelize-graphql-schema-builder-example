/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-02-13 20:33:54.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Store extends Model {
}

module.exports = (sequelize, extend) => {
  Store.init(extend({
    storeId: {
      type: DataTypes.TINYINT,
      field: 'store_id',
      primaryKey: true,
      autoIncrement: true
    },
    lastUpdate: {
      type: DataTypes.DATE,
      field: 'last_update',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }), {
    sequelize: sequelize,
    modelName: 'Store',
    tableName: 'store',
    indexes: [
      {
        name: 'idx_unique_manager',
        fields: ['manager_staff_id'],
        unique: true
      },
      {
        name: 'idx_fk_address_id',
        fields: ['address_id']
      }
    ],
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Store.associate = () => {
    // 1 <=> N association
    Store.hasMany(sequelize.models.Customer, {
      foreignKey: {
        name: 'storeId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      tarketKey: 'storeId'
    })

    // 1 <=> N association
    Store.hasMany(sequelize.models.Inventory, {
      foreignKey: {
        name: 'storeId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      tarketKey: 'storeId'
    })

    // 1 <=> N association
    Store.hasMany(sequelize.models.Staff, {
      foreignKey: {
        name: 'storeId',
        allowNull: false
      },
      tarketKey: 'storeId',
      constraints: false
    })

    // N <=> 1 association
    Store.belongsTo(sequelize.models.Staff, {
      foreignKey: {
        name: 'managerStaffId',
        allowNull: false
      },
      tarketKey: 'staffId',
      as: 'Manager',
      constraints: false
    })

    // N <=> 1 association
    Store.belongsTo(sequelize.models.Address, {
      foreignKey: {
        name: 'addressId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      tarketKey: 'addressId'
    })
  }

  return Store
}
