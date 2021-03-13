module.exports = {
  associate: (sequelize) => function (Film) {
    Film.hasOne(sequelize.models.FilmText, {
      foreignKey: 'filmId',
      targetKey: 'filmId'
    })
  }
}
