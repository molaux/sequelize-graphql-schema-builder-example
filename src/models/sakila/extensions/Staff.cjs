const deepmerge = require('deepmerge')
const { DataTypes } = require('sequelize')

module.exports = sequelize => function (baseDefinition) {
  return deepmerge(baseDefinition, {
    lastName: {
      get() {
        const rawValue = this.getDataValue('lastName');
        return rawValue ? rawValue.toUpperCase() : null;
      }
    },
    fullName: {
      type: DataTypes.VIRTUAL(DataTypes.STRING, ['firstName', 'lastName']),
      get() {
        return `${this.firstName} ${this.lastName}`
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!')
      }
    }
  }, { clone: false })
} 