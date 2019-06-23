module.exports = (sequelize, DataTypes) => {
  const ShoppingCart = sequelize.define(
    'ShoppingCart',
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cart_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER
      },
      attributes: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER
      },
      buy_now: {
        type: DataTypes.BOOLEAN
      },
      added_on: {
        type: DataTypes.STRING
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'shopping_cart'
    }
  );

  ShoppingCart.associate = (models) => {
    ShoppingCart.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };

  return ShoppingCart;
};
