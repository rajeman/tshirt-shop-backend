export default {
  ensureRequiredFields(req, requiredFields) {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      // eslint-disable-next-line no-prototype-builtins
      if (!req.body[field]) {
        return field;
      }
    }
  }
};
