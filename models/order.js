module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'orders',
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      created_on: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shipped_on: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      comments: {
        type: DataTypes.STRING,
        allowNull: true
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      auth_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true
      },
      shipping_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tax_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      timestamps: false
    }
  );

  return Order;
};
