import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import express from 'express'; // eslint-disable-line
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { resolve } from 'path';

import playlistsRoutes from './routes/playlistsRoutes';
import registerRoutes from './routes/registerRoutes';
import loginRoutes from './routes/loginRoutes';
import checkLoginRoutes from './routes/checkLoginRoutes';

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
    this.sessions();
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

  sessions() {
    const sessionOptions = session({
      secret: process.env.SECRET,
      store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
      },
    });
    this.app.use(sessionOptions);
  }

  middleware() {
    this.app.use(cookieParser());
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, '..', 'uploads')));
  }

  routes() {
    this.app.use('/checklogin', checkLoginRoutes);
    this.app.use('/register', registerRoutes);
    this.app.use('/login', loginRoutes);
    this.app.use('/playlists', playlistsRoutes);
  }
}

export default new App().app;
