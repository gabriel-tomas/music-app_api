import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import playlistsController from '../controllers/PlaylistsController';

router.get('/', playlistsController.index);
router.post('/create', playlistsController.create);
router.post('/add', playlistsController.add);
router.post('/remove', playlistsController.remove);

export default router;
