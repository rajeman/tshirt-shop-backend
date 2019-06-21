import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      credit_card: {
        type: DataTypes.STRING
      },
      address_1: {
        type: DataTypes.STRING
      },
      address_2: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      region: {
        type: DataTypes.STRING
      },
      postal_code: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      shipping_region_id: {
        type: DataTypes.INTEGER
      },
      day_phone: {
        type: DataTypes.STRING
      },
      eve_phone: {
        type: DataTypes.STRING
      },
      mob_phone: {
        type: DataTypes.STRING
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      hooks: {
        beforeCreate: customer => customer.password && customer.hashPassword(),
        beforeUpdate: customer => customer.password && customer.hashPassword()
      }
    }
  );

  Customer.prototype.hashPassword = async function hashPassword() {
    const saltRounds = 9;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return this.password;
  };

  Customer.prototype.validPassword = function validPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return Customer;
};
