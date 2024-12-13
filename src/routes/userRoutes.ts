import { Router } from 'express';
import { getUsers, updateUserRole } from '../controllers/userController';
import { auth, checkRole } from '../middleware/auth';

const router = Router();

router.get('/', auth, checkRole(['admin', 'teacher']), getUsers);
router.put('/:id', auth, checkRole(['admin', 'teacher']), updateUserRole);

export default router;