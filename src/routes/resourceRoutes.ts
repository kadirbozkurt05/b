import { Router } from 'express';
import multer from 'multer';
import { createResource, getResources } from '../controllers/resourceController';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.post('/', upload.single('file'), createResource);
router.get('/', getResources);

export default router;