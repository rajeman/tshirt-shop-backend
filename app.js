import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  productRoutes,
  categoryRoutes,
  attributeRoutes,
  departmentRoutes,
  customerRoutes,
  shoppingCartRoutes,
  shippingRegionRoutes,
  taxRoutes,
  stripeRoutes,
  orderRoutes
} from './routes';

dotenv.config();

const app = express();

app.enable('trust proxy');
app.use(cors());

app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/attributes', attributeRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/shoppingcart', shoppingCartRoutes);
app.use('/api/v1/shipping', shippingRegionRoutes);
app.use('/api/v1/tax', taxRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1/orders', orderRoutes);

export default app;
