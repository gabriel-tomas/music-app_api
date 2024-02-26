import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import loginController from '../controllers/LoginController';

router.post('/', loginController.login);

export default router;
