import { Request, Response } from 'express';
import Exam from '../models/Exam';

export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const examData = req.body;
    
    // Assign IDs to questions before creating the exam
    examData.questions = examData.questions.map((question: any, index: number) => ({
      ...question,
      id: index + 1
    }));

    // Set question count
    examData.questionCount = examData.questions.length;
    
    // Create new exam document
    const exam = new Exam(examData);
    await exam.save();

    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { grade } = req.query;
    
    // Create query object
    const query: any = {};
    
    // Add grade filter if provided
    if (grade) {
      query.grade = parseInt(grade as string);
    }

    const exams = await Exam.find(query).sort({ createdAt: -1 });
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: 'Server error' });
  }
};