"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config();

var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _expresssession = require('express-session'); var _expresssession2 = _interopRequireDefault(_expresssession);
var _connectmongo = require('connect-mongo'); var _connectmongo2 = _interopRequireDefault(_connectmongo);
var _express = require('express'); var _express2 = _interopRequireDefault(_express); // eslint-disable-line
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _helmet = require('helmet'); var _helmet2 = _interopRequireDefault(_helmet);

var _path = require('path');

var _playlistsRoutes = require('./routes/playlistsRoutes'); var _playlistsRoutes2 = _interopRequireDefault(_playlistsRoutes);
var _registerRoutes = require('./routes/registerRoutes'); var _registerRoutes2 = _interopRequireDefault(_registerRoutes);
var _loginRoutes = require('./routes/loginRoutes'); var _loginRoutes2 = _interopRequireDefault(_loginRoutes);
var _checkLoginRoutes = require('./routes/checkLoginRoutes'); var _checkLoginRoutes2 = _interopRequireDefault(_checkLoginRoutes);

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
};

class App {
  constructor() {
    this.app = _express2.default.call(void 0, );
    this.databaseConnection();
    this.sessions();
    this.middleware();
    this.routes();
  }

  databaseConnection() {
    _mongoose2.default.connect(process.env.CONNECTIONSTRING)
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
    const sessionOptions = _expresssession2.default.call(void 0, {
      secret: process.env.SECRET,
      store: _connectmongo2.default.create({ mongoUrl: process.env.CONNECTIONSTRING }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      },
    });
    this.app.use(sessionOptions);
  }

  middleware() {
    this.app.use(_cors2.default.call(void 0, corsOptions));
    this.app.use(_helmet2.default.call(void 0, ));
    this.app.use(_express2.default.urlencoded({ extended: true }));
    this.app.use(_express2.default.json());
    this.app.use(_express2.default.static(_path.resolve.call(void 0, __dirname, '..', 'uploads')));
  }

  routes() {
    this.app.use('/checklogin', _checkLoginRoutes2.default);
    this.app.use('/register', _registerRoutes2.default);
    this.app.use('/login', _loginRoutes2.default);
    this.app.use('/playlists', _playlistsRoutes2.default);
  }
}

exports. default = new App().app;
