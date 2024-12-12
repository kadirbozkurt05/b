import { Router } from 'express';
import { createExam, getExams } from '../controllers/examController';
import { auth, checkRole } from '../middleware/auth';

const router = Router();

router.post('/', auth, checkRole(['admin', 'teacher']), createExam);
router.get('/', getExams);

export default router;