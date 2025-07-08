module.exports = (sequelize, DataTypes) => {
  const Charge = sequelize.define('Charge', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chargeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentUrl: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: true,
  });

  Charge.associate = (models) => {
    Charge.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });
    Charge.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Charge;
};
