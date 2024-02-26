import loginController from '../controllers/LoginController';
import { Router } from 'express'; // eslint-disable-line
const router = new Router();

router.post('/', loginController.login);

export default router;
