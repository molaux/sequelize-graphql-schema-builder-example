/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-04-13 19:01:50.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Inventory extends Model {
}

module.exports = (sequelize, extend) => {
  Inventory.init(extend({
    inventoryId: {
      type: DataTypes.INTEGER,
      field: 'inventory_id',
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
    modelName: 'Inventory',
    tableName: 'inventory',
    indexes: [
      {
        name: 'idx_fk_inventory_film_id',
        fields: ['film_id']
      },
      {
        name: 'idx_store_id_film_id',
        fields: ['store_id', 'film_id']
      }
    ],
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Inventory.associate = () => {
    // 1 <=> N association
    Inventory.hasMany(sequelize.models.Rental, {
      foreignKey: {
        name: 'inventoryId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'inventoryId',
      as: 'Rentals'
    })

    // N <=> 1 association
    Inventory.belongsTo(sequelize.models.Film, {
      foreignKey: {
        name: 'filmId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'filmId'
    })

    // N <=> 1 association
    Inventory.belongsTo(sequelize.models.Store, {
      foreignKey: {
        name: 'storeId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'storeId'
    })
  }

  return Inventory
}
