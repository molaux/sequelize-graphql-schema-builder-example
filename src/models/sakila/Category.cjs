/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.2.2-dev (node-Sequelize6 dev) on 2023-03-09 10:38:38.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes } = require('sequelize')


module.exports = (sequelize, extend) => {
  const Model = sequelize.define('Category', extend({
    categoryId: {
      type: DataTypes.SMALLINT,
      field: 'category_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(25),
      field: 'name',
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
    modelName: 'Category',
    tableName: 'category',
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Model.associate = () => {
    // N <=> M association
    Model.belongsToMany(sequelize.models.Film, {
      through: 'film_category',
      foreignKey: {
        name: 'category_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'filmId',
      as: 'Films'
    })
  }

  return Model
}
