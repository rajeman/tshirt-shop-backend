import Sequelize from 'sequelize';

const { like } = Sequelize.Op;
export default {
  ensureRequiredFields(req, requiredFields) {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (req.body[field] === undefined || req.body[field] === null) {
        return field;
      }
    }
  },
  verifyFieldLength(value, min, max) {
    if (`${value}`.trim().length < min || `${value}`.trim().length > max) {
      return value;
    }
  },
  verifyCustomerEmail(email) {
    if (
      // eslint-disable-next-line no-useless-escape
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        `${email}`.trim()
      )
      || `${email}`.trim().length > 40
    ) {
      return email;
    }
  },
  async verifyFieldInUse(field, value, model) {
    const user = await model.findOne({
      where: { [field]: { [like]: `${value}`.trim() } }
    });
    return user;
  },
  verifyOptionalFieldsLength(req, fields, min, max) {
    for (let i = 0; i < fields.length; i++) {
      const field = req.body[fields[i]];
      if (field) {
        const invalidFieldLength = this.verifyFieldLength(field, min, max);
        if (invalidFieldLength) {
          return fields[i];
        }
      }
    }
  }
};
