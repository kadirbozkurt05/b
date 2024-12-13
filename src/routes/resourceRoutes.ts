import { Router } from 'express';
import multer from 'multer';
import { createResource, getResources, deleteResource } from '../controllers/resourceController';
import { auth, checkRole } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.post('/', auth, checkRole(['admin', 'teacher']), upload.single('file'), createResource);
router.get('/', getResources);
router.delete('/:id', auth, checkRole(['admin', 'teacher']), deleteResource);

export default router;