"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _app = require('./app'); var _app2 = _interopRequireDefault(_app);

const port = process.env.APP_PORT;
_app2.default.on('database_connected', () => {
  _app2.default.listen(port, () => {
    console.log(`Access http://localhost:${port}`);
    console.log(`Server running on port ${port}`);
  });
});
