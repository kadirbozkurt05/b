import mongoose, { Document, Schema } from 'mongoose';

export interface IWordGame extends Document {
  words: string[];
}

const WordGameSchema = new Schema({
  words: {
    type: [String],
    required: true,
    validate: {
      validator: function(words: string[]) {
        // Check for duplicates using Set
        return new Set(words).size === words.length;
      },
      message: 'Duplicate words are not allowed'
    }
  }
});

export default mongoose.model<IWordGame>('WordGame', WordGameSchema);