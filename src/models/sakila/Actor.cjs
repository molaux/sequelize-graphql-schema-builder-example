/**
 * Auto generated by MySQL Workbench Schema Exporter.
 * Version 3.1.5-dev (node-Sequelize6 dev) on 2021-03-09 17:04:37.
 * Goto
 * https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter
 * for more information.
 */

const { DataTypes, Model } = require('sequelize')

class Actor extends Model {
}

module.exports = (sequelize, extend) => {
  Actor.init(extend({
    actorId: {
      type: DataTypes.SMALLINT,
      field: 'actor_id',
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(45),
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(45),
      field: 'last_name',
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
    modelName: 'Actor',
    tableName: 'actor',
    indexes: [
      {
        name: 'idx_actor_last_name',
        fields: ['last_name']
      }
    ],
    timestamps: false,
    underscored: true,
    syncOnAssociation: false
  })

  Actor.associate = () => {
    // N <=> M association
    Actor.belongsToMany(sequelize.models.Film, {
      through: 'film_actor',
      foreignKey: {
        name: 'actor_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      targetKey: 'filmId',
      as: 'Films'
    })
  }

  return Actor
}
