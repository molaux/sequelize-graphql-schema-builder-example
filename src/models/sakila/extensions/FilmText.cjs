module.exports = {
  associate: (sequelize) => function (FilmText) {
    console.log('FT association')
    FilmText.belongsTo(sequelize.models.Film, {
      foreignKey: 'filmId',
      targetKey: 'filmId'
    })
  }
}
