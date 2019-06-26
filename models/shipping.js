module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define(
    'Shipping',
    {
      shipping_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      shipping_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shipping_cost: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shipping_region_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'shipping'
    }
  );

  return Shipping;
};
