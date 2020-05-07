import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import errorHandler from 'errorhandler';
const app = express();

mongoose.connect('mongodb://localhost/AuthDatabase');
mongoose.connection.on('error', (error) => console.log(error));
mongoose.Promise = global.Promise;

require('./models/user');
require('./auth/auth');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);
app.use(errorHandler());
app.use((err: any, _req, res: any) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(9000, () => console.log('Server started'));
