import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import loginRequired from '../middlewares/loginRequired';

import playlistsController from '../controllers/PlaylistsController';

router.get('/', loginRequired, playlistsController.index);
router.post('/create', loginRequired, playlistsController.create);
router.post('/delete', loginRequired, playlistsController.delete);
router.post('/add', loginRequired, playlistsController.add);
router.post('/remove', loginRequired, playlistsController.remove);

export default router;
