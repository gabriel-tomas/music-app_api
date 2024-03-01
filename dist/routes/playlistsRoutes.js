"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); // eslint-disable-line
const router = new (0, _express.Router)();

var _PlaylistsController = require('../controllers/PlaylistsController'); var _PlaylistsController2 = _interopRequireDefault(_PlaylistsController);

router.get('/', _PlaylistsController2.default.index);
router.post('/create', _PlaylistsController2.default.create);
router.post('/delete', _PlaylistsController2.default.delete);
router.post('/add', _PlaylistsController2.default.add);
router.post('/remove', _PlaylistsController2.default.remove);

exports. default = router;
