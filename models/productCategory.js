module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'product_category'
    }
  );

  ProductCategory.associate = (models) => {
    ProductCategory.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });

    ProductCategory.belongsTo(models.Category, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE'
    });
  };

  return ProductCategory;
};
