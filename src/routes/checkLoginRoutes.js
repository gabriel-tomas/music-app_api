import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import checkLoginController from '../controllers/CheckLoginController';

router.get('/', checkLoginController.index);

export default router;
