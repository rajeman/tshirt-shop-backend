import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;
const { Department } = models;

export default {
  async getSingleDepartment(req, res) {
    return res.send(req.department);
  },

  async getAllDepartments(req, res) {
    const cached = await getAsync('department:all');
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const allDepartments = await Department.findAll();
    client.set('department:all', JSON.stringify(allDepartments));
    return res.send(allDepartments);
  }
};
