module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define(
    'Tax',
    {
      tax_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      tax_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tax_percentage: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'tax'
    }
  );

  return Tax;
};
