const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('Dog', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'http://localhost:3001/dogs/default-image'
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    heightMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    heightMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    life_spanMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    life_spanMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

  },
  {timestamps: false}
  );
};
