module.exports = (sequelize, DataTypes) => {
  const AttributeValue = sequelize.define(
    'AttributeValue',
    {
      attribute_value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      value: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'attribute_value'
    }
  );

  AttributeValue.associate = (models) => {
    AttributeValue.belongsTo(models.Attribute, {
      foreignKey: 'attribute_id',
      onDelete: 'CASCADE'
    });
  };

  return AttributeValue;
};
