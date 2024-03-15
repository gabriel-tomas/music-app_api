import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import express from 'express'; // eslint-disable-line
import cors from 'cors';
import helmet from 'helmet';
import { resolve } from 'path';
import cronJob from './cron';

import playlistsRoutes from './routes/playlistsRoutes';
import registerRoutes from './routes/registerRoutes';
import loginRoutes from './routes/loginRoutes';
import userRoutes from './routes/userRoutes';

const whiteList = [
  process.env.WHITE_LIST_MAIN_URL,
];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

class App {
  constructor() {
    this.app = express();
    this.databaseConnection();
    cronJob.start();
    this.middleware();
    this.routes();
  }

  databaseConnection() {
    mongoose.connect(process.env.CONNECTIONSTRING)
      .then(() => {
        console.log('Conexão com DB obtida com sucesso!');
        this.app.emit('database_connected');
      })
      .catch((error) => {
        console.log('ERROR: erro na conexão com o DB');
        console.log(error);
      });
  }

  middleware() {
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, '..', 'uploads')));
  }

  routes() {
    this.app.use('/register', registerRoutes);
    this.app.use('/login', loginRoutes);
    this.app.use('/playlists', playlistsRoutes);
    this.app.use('/user', userRoutes);
  }
}

export default new App().app;
