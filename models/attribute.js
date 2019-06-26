module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define(
    'Attribute',
    {
      attribute_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'attribute'
    }
  );

  return Attribute;
};
