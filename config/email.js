import nodemailer from 'nodemailer';

const {
  USER_EMAIL, USER_PASS, EMAIL_HOST, EMAIL_PORT
} = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS
  }
});

export default transporter;
