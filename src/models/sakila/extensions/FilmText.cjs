module.exports = {
  associate: (sequelize) => function (FilmText) {
    FilmText.belongsTo(sequelize.models.Film, {
      foreignKey: 'filmId',
      targetKey: 'filmId'
    })
  }
}
