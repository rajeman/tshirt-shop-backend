import express from 'express';
import { departments } from '../controllers';
import { departmentsMiddleware } from '../middlewares';

const { getSingleDepartment, getAllDepartments } = departments;
const { verifyDepartmentExists } = departmentsMiddleware;

const departmentsRouter = express.Router();

departmentsRouter
  .route('/')
  .get(getAllDepartments);

departmentsRouter
  .route('/:department_id')
  .get(verifyDepartmentExists, getSingleDepartment);

export default departmentsRouter;
