module.exports = (sequelize, DataTypes) => {
  const ShippingRegion = sequelize.define(
    'ShippingRegion',
    {
      shipping_region_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      shipping_region: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'shipping_region'
    }
  );

  return ShippingRegion;
};
