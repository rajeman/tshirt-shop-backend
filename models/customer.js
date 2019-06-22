import bcrypt from 'bcrypt';
import crypto from 'crypto';

const cardKey = process.env.CARD_ENCRYPTION_KEY;
const cardEncryptionAlgorithm = process.env.CARD_ENCRYPTION_ALGORITHM;

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
        beforeUpdate: customer => customer.password && customer.hashPassword(),
        afterFind: customer => customer && customer.credit_card && customer.decryptCard()
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

  Customer.prototype.decryptCard = function decryptCard() {
    const decipher = crypto.createDecipher(cardEncryptionAlgorithm, cardKey);
    let dec = decipher.update(this.credit_card, 'hex', 'utf8');
    dec += decipher.final('utf8');
    this.credit_card = `******${dec
      .replace(/"/g, '')
      .substr(dec.length - 6, dec.length)}`;
    return this.credit_card;
  };

  return Customer;
};
