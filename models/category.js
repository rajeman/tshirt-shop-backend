module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );

  Category.associate = (models) => {
    Category.belongsTo(models.Department, {
      foreignKey: 'department_id',
      onDelete: 'CASCADE'
    });
    Category.hasMany(models.ProductCategory, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE'
    });
  };

  return Category;
};
