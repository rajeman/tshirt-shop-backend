module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    'OrderDetail',
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attributes: {
        type: DataTypes.STRING,
        allowNull: false
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unit_cost: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'order_detail'
    }
  );

  return OrderDetail;
};
