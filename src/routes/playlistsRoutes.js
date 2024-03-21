import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import loginRequired from '../middlewares/loginRequired';

import playlistsController from '../controllers/PlaylistsController';

router.get('/', loginRequired, playlistsController.index);
router.get('/:name', loginRequired, playlistsController.show);
router.post('/create', loginRequired, playlistsController.create);
router.delete('/delete', loginRequired, playlistsController.delete);
router.patch('/edit', loginRequired, playlistsController.edit);
router.patch('/add', loginRequired, playlistsController.add);
router.patch('/remove', loginRequired, playlistsController.remove);

export default router;
