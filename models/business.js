module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    wallets: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  });

  Business.associate = (models) => {
    Business.belongsTo(models.User, { foreignKey: 'userId' });
    Business.hasMany(models.Charge, {
      foreignKey: 'businessId',
      as: 'charges',
    });
  };

  return Business;
};
