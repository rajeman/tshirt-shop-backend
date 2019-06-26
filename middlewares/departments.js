import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;
const { Department } = models;

export default {
  async verifyDepartmentExists(req, res, next) {
    const departmentId = req.params.department_id;
    const cached = await getAsync(`department:${departmentId}`);
    if (cached) {
      req.department = JSON.parse(cached);
      return next();
    }
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'department with the supplied department_id not found',
        department_id: req.params.department_id,
        status: 500
      });
    }
    client.set(`department:${departmentId}`, JSON.stringify(department));
    req.department = department;
    next();
  }
};
