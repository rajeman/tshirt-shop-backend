module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      discounted_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        default: 0.0
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image_2: {
        type: DataTypes.STRING,
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
      },
      display: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.ProductCategory, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};
