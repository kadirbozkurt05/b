import { Router } from 'express';
import { generateStudyPlan, explainConcept } from '../controllers/aiController';

const router = Router();

router.post('/study-plan', generateStudyPlan);
router.post('/concept-explainer', explainConcept);

export default router;