import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  productRoutes,
  categoryRoutes,
  attributeRoutes,
  departmentRoutes,
  customerRoutes,
  shoppingCartRoutes
} from './routes';
import { errorHandler } from './middlewares';

dotenv.config();

const app = express();

app.enable('trust proxy');
app.use(cors());

app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: 'tshirt-shop',
    cookie: { maxAge: 50000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/attributes', attributeRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/shoppingcart', shoppingCartRoutes);
app.use(errorHandler);

export default app;
