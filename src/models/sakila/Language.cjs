/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.2.2-dev (node-Sequelize6 dev) on 2023-03-08 17:24:12.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes } = require('sequelize')


module.exports = (sequelize, extend) => {
  const Model = sequelize.define('Language', extend({
    languageId: {
      type: DataTypes.SMALLINT,
      field: 'language_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
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
    modelName: 'Language',
    tableName: 'language',
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Model.associate = () => {
    // 1 <=> N association
    Model.hasMany(sequelize.models.Film, {
      foreignKey: {
        name: 'languageId',
        allowNull: false
      },
      targetKey: 'languageId',
      as: 'Films',
      constraints: false
    })

    // 1 <=> N association
    Model.hasMany(sequelize.models.Film, {
      foreignKey: {
        name: 'originalLanguageId',
        allowNull: true
      },
      targetKey: 'languageId',
      as: 'OriginalLanguageFilms',
      constraints: false
    })
  }

  return Model
}
