/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-02-13 20:33:54.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Payment extends Model {
}

module.exports = (sequelize, extend) => {
  Payment.init(extend({
    paymentId: {
      type: DataTypes.SMALLINT,
      field: 'payment_id',
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'amount',
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      field: 'payment_date',
      allowNull: false
    },
    lastUpdate: {
      type: DataTypes.DATE,
      field: 'last_update',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }), {
    sequelize: sequelize,
    modelName: 'Payment',
    tableName: 'payment',
    indexes: [
      {
        name: 'idx_fk_payment_staff_id',
        fields: ['staff_id']
      },
      {
        name: 'idx_fk_payment_customer_id',
        fields: ['customer_id']
      },
      {
        name: 'fk_payment_rental',
        fields: ['rental_id']
      }
    ],
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Payment.associate = () => {
    // N <=> 1 association
    Payment.belongsTo(sequelize.models.Customer, {
      foreignKey: {
        name: 'customerId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      tarketKey: 'customerId'
    })

    // N <=> 1 association
    Payment.belongsTo(sequelize.models.Staff, {
      foreignKey: {
        name: 'staffId',
        allowNull: false
      },
      onUpdate: 'RESTRICT',
      tarketKey: 'staffId'
    })

    // N <=> 1 association
    Payment.belongsTo(sequelize.models.Rental, {
      foreignKey: {
        name: 'rentalId',
        allowNull: true
      },
      onUpdate: 'SET NULL',
      tarketKey: 'rentalId'
    })
  }

  return Payment
}
