import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

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

export default app;
