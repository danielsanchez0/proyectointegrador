'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Horario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Horario.belongsToMany(models.Grupo, {
        through: models.Grupo_horario,
        foreignKey: 'horario_id'
      })

      Horario.belongsTo(models.Espacio, {
        foreignKey: 'espacio',
        onDelete: 'CASCADE'
      })
    }
  }
  Horario.init({
    dia: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isIn: [['lunes', 'martes', 'miércoles', 'jueves', 'sábado', 'domingo']]
      }
    },
    hora_inicio: {
      type: DataTypes.TIME,
      validate: {
        notEmpty: true,
      }
    },
    hora_final: {
      type: DataTypes.TIME,
      validate: {
        notEmpty: true,
      }
    },
    espacio: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Horario',
  });
  return Horario;
};