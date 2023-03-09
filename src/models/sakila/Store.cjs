/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.2.2-dev (node-Sequelize6 dev) on 2023-03-09 10:38:38.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes } = require('sequelize')


module.exports = (sequelize, extend) => {
  const Model = sequelize.define('Store', extend({
    storeId: {
      type: DataTypes.SMALLINT,
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

  Model.associate = () => {
    // 1 <=> N association
    Model.hasMany(sequelize.models.Customer, {
      foreignKey: {
        name: 'storeId',
        field: 'store_id',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'storeId',
      as: 'Customers'
    })

    // 1 <=> N association
    Model.hasMany(sequelize.models.Inventory, {
      foreignKey: {
        name: 'storeId',
        field: 'store_id',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'storeId',
      as: 'Inventories'
    })

    // 1 <=> N association
    Model.hasMany(sequelize.models.Staff, {
      foreignKey: {
        name: 'storeId',
        field: 'store_id',
        allowNull: false
      },
      targetKey: 'storeId',
      constraints: false
    })

    // N <=> 1 association
    Model.belongsTo(sequelize.models.Staff, {
      foreignKey: {
        name: 'managerStaffId',
        field: 'manager_staff_id',
        allowNull: false
      },
      targetKey: 'staffId',
      as: 'ManagerStaff',
      constraints: false
    })

    // N <=> 1 association
    Model.belongsTo(sequelize.models.Address, {
      foreignKey: {
        name: 'addressId',
        field: 'address_id',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'addressId'
    })
  }

  return Model
}
