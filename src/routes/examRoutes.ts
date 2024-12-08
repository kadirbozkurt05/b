import { Router } from 'express';
import { createExam, getExams } from '../controllers/examController';

const router = Router();

router.post('/', createExam);
router.get('/', getExams);

export default router;