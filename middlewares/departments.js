import models from '../models';

const { Department } = models;

export default {
  async verifyDepartmentExists(req, res, next) {
    const department = await Department.findByPk(req.params.department_id);
    if (!department) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'department with the supplied department_id not found',
        department_id: req.params.department_id,
        status: 500
      });
    }
    next();
  }
};
