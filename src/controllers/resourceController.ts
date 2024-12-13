import { Request, Response } from 'express';
import Resource from '../models/Resource';
import { uploadFileToFirebase } from '../utils/fileUpload';
import Category from '../models/Category'

export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, image, grade, category, tags } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'File size exceeds 5MB limit' });
      return;
    }

    try {
      // Upload file to Firebase Storage
      const uploadResult = await uploadFileToFirebase(file);

      // Add category if it doesn't exist
      await Category.findOneAndUpdate(
        { name: category },
        { name: category },
        { upsert: true }
      );

      const resource = new Resource({
        title,
        fileName: uploadResult.fileName,
        image,
        grade,
        category,
        tags: Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim()),
        fileUrl: uploadResult.fileUrl,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize
      });

      await resource.save();
      res.status(201).json(resource);
    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      res.status(500).json({ error: 'File upload failed' });
      return;
    }
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const grade = parseInt(req.query.grade as string);

    let query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (grade) {
      query.grade = grade;
    }

    const resources = await Resource.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
};