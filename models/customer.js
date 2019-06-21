module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      credit_card: {
        type: DataTypes.STRING
      },
      address_1: {
        type: DataTypes.STRING
      },
      address_2: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      region: {
        type: DataTypes.STRING
      },
      postal_code: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      shipping_region: {
        type: DataTypes.STRING
      },
      day_phone: {
        type: DataTypes.STRING
      },
      eve_phone: {
        type: DataTypes.STRING
      },
      mov_phone: {
        type: DataTypes.STRING
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );

  return Customer;
};
