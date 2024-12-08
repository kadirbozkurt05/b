import { Request, Response } from 'express';
import WordGame from '../../models/WordGame';

export const addWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const newWords: string[] = req.body.words;
    console.log(newWords);
    

    if (!Array.isArray(newWords)) {
      res.status(400).json({ error: 'Words must be provided as an array' });
      return;
    }

    // Convert all words to lowercase for consistency
    const normalizedWords = newWords.map(word => word.toLowerCase().trim());

    // Get the existing word document or create a new one if it doesn't exist
    let wordGame = await WordGame.findOne();
    
    if (!wordGame) {
      wordGame = new WordGame({ words: [] });
    }

    // Filter out words that already exist
    const uniqueNewWords = normalizedWords.filter(word => !wordGame.words.includes(word));

    if (uniqueNewWords.length === 0) {
      res.status(200).json({ 
        message: 'No new words to add',
        totalWords: wordGame.words.length
      });
      return;
    }

    // Add new unique words
    wordGame.words.push(...uniqueNewWords);
    await wordGame.save();

    res.status(201).json({
      message: 'Words added successfully',
      addedWords: uniqueNewWords,
      totalWords: wordGame.words.length
    });
  } catch (error) {
    console.error('Error adding words:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const wordGame = await WordGame.findOne();
    
    if (!wordGame) {
      res.status(200).json({ words: [] });
      return;
    }

    res.status(200).json({
      words: wordGame.words,
      totalWords: wordGame.words.length
    });
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Server error' });
  }
};