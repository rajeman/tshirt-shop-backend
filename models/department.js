module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
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

  return Department;
};
