import mongoose, { Document, Schema } from 'mongoose';

interface IQuestion {
  id: number;
  text: string;
  options: string[];
  correct: string;
}

export interface IExam extends Document {
  title: string;
  subject: string;
  keywords: string[];
  grade: number;
  duration: number;
  questionCount: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  createdAt: Date;
  questions: IQuestion[];
}

const QuestionSchema = new Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correct: { type: String, required: true }
});

const ExamSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  keywords: { type: [String], required: true },
  grade: { type: Number, required: true },
  duration: { type: Number, required: true },
  questionCount: { type: Number },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Kolay', 'Orta', 'Zor']
  },
  questions: { type: [QuestionSchema], required: true }
}, {
  timestamps: true
});

export default mongoose.model<IExam>('Exam', ExamSchema);