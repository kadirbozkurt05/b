import { Router } from 'express';
import { addWords, getWords } from '../controllers/gameControllers/wordGameController';

const router = Router();

// Word game routes
router.post('/words', addWords);
router.get('/words', getWords);

export default router;