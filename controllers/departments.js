import models from '../models';

const { Department } = models;

export default {
  async getSingleDepartment(req, res) {
    const department = await Department.findByPk(req.params.department_id);
    return res.send(department);
  },
  async getAllDepartments(req, res) {
    const allDepartments = await Department.findAll();
    return res.send(allDepartments);
  }
};
