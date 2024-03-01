"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); // eslint-disable-line
const router = new (0, _express.Router)();

var _CheckLoginController = require('../controllers/CheckLoginController'); var _CheckLoginController2 = _interopRequireDefault(_CheckLoginController);

router.get('/', _CheckLoginController2.default.index);

exports. default = router;
