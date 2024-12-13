import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController';
import { auth, checkRole } from '../middleware/auth';

const router = Router();

router.get('/', auth, checkRole(['admin', 'teacher']), getUsers);
router.put('/:id', auth, checkRole(['admin', 'teacher']), updateUserRole);
router.delete('/:id', auth, checkRole(['admin']), deleteUser); // Only admin can delete users

export default router;