"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); // eslint-disable-line
const router = new (0, _express.Router)();

var _LoginController = require('../controllers/LoginController'); var _LoginController2 = _interopRequireDefault(_LoginController);

router.post('/', _LoginController2.default.login);

exports. default = router;
