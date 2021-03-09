/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-03-09 17:04:37.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class FilmText extends Model {
}

module.exports = (sequelize, extend) => {
  FilmText.init(extend({
    filmId: {
      type: DataTypes.SMALLINT,
      field: 'film_id',
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      field: 'title',
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    }
  }), {
    sequelize: sequelize,
    modelName: 'FilmText',
    tableName: 'film_text',
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  FilmText.associate = () => {
  }

  return FilmText
}
