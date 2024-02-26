import registerController from '../controllers/RegisterController';
import { Router } from 'express'; // eslint-disable-line
const router = new Router();

router.post('/', registerController.create);

export default router;
