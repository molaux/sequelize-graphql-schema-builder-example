/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.2.2-dev (node-Sequelize6 dev) on 2023-03-08 17:24:12.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes } = require('sequelize')


module.exports = (sequelize, extend) => {
  const Model = sequelize.define('Country', extend({
    countryId: {
      type: DataTypes.SMALLINT,
      field: 'country_id',
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: DataTypes.STRING(50),
      field: 'country',
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
    modelName: 'Country',
    tableName: 'country',
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Model.associate = () => {
    // 1 <=> N association
    Model.hasMany(sequelize.models.City, {
      foreignKey: {
        name: 'countryId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'countryId',
      as: 'Cities'
    })
  }

  return Model
}
