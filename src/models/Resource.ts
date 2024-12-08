import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  fileName: string;
  image: string;
  grade: number;
  category: string;
  tags: string[];
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

const ResourceSchema = new Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  image: { type: String, required: true },
  grade: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IResource>('Resource', ResourceSchema);