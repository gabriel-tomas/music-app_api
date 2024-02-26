import { Router } from 'express'; // eslint-disable-line
const router = new Router();

import registerController from '../controllers/RegisterController';

router.post('/', registerController.create);

export default router;
