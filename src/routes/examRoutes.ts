import { Router } from 'express';
import { createExam, getExams, deleteExam } from '../controllers/examController';
import { auth, checkRole } from '../middleware/auth';

const router = Router();

router.post('/', auth, checkRole(['admin', 'teacher']), createExam);
router.get('/', getExams);
router.delete('/:id', auth, checkRole(['admin', 'teacher']), deleteExam);

export default router;