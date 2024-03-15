import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import loginRequired from '../middlewares/loginRequired';

import userController from '../controllers/UserController';

router.get('/', loginRequired, userController.show);
router.put('/', loginRequired, userController.update);
router.delete('/', loginRequired, userController.delete);

export default router;
