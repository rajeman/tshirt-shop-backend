import app from './app';

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to tshirt shop'
  });
});
const port = process.env.PORT || 3005;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
