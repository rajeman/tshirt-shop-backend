module.exports = (sequelize, DataTypes) => {
  const ProductAttribute = sequelize.define(
    'ProductAttribute',
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      attribute_value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'product_attribute'
    }
  );

  ProductAttribute.associate = (models) => {
    ProductAttribute.belongsTo(models.AttributeValue, {
      foreignKey: 'attribute_value_id',
      onDelete: 'CASCADE'
    });
    ProductAttribute.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };

  return ProductAttribute;
};
