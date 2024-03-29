/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-04-13 19:01:50.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Address extends Model {
}

module.exports = (sequelize, extend) => {
  Address.init(extend({
    addressId: {
      type: DataTypes.SMALLINT,
      field: 'address_id',
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING(50),
      field: 'address',
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING(50),
      field: 'address2'
    },
    district: {
      type: DataTypes.STRING(20),
      field: 'district',
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING(10),
      field: 'postal_code'
    },
    phone: {
      type: DataTypes.STRING(20),
      field: 'phone',
      allowNull: false
    },
    lastUpdate: {
      type: DataTypes.DATE,
      field: 'last_update',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }), {
    sequelize: sequelize,
    modelName: 'Address',
    tableName: 'address',
    indexes: [
      {
        name: 'idx_fk_city_id',
        fields: ['city_id']
      }
    ],
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Address.associate = () => {
    // 1 <=> N association
    Address.hasMany(sequelize.models.Customer, {
      foreignKey: {
        name: 'addressId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'addressId',
      as: 'Customers'
    })

    // 1 <=> N association
    Address.hasMany(sequelize.models.Staff, {
      foreignKey: {
        name: 'addressId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'addressId'
    })

    // 1 <=> N association
    Address.hasMany(sequelize.models.Store, {
      foreignKey: {
        name: 'addressId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'addressId',
      as: 'Stores'
    })

    // N <=> 1 association
    Address.belongsTo(sequelize.models.City, {
      foreignKey: {
        name: 'cityId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      targetKey: 'cityId'
    })
  }

  return Address
}
