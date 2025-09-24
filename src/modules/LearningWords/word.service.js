import mongoose from 'mongoose';
import Word from './word.model.js';
import AppError from '../../utils/appError.js';

class WordsService {
  // Get user's vocabulary summary
  static async getVocabularySummary(userId) {
    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          words: { $push: '$$ROOT' }
        }
      }
    ];
    
    const result = await Word.aggregate(pipeline);
    
    return {
      learned: result.find(r => r._id === 'learned') || { count: 0, words: [] },
      favorite: result.find(r => r._id === 'favorite') || { count: 0, words: [] }
    };
  }
  
  // Get random words for practice
  static async getRandomWordsForPractice(userId, count = 10) {
    return await Word.aggregate([
      { $match: { userId } },
      { $sample: { size: count } }
    ]);
  }
  
  // Search words with advanced filters
  static async searchWords(userId, options = {}) {
    const {
      query,
      category,
      difficulty,
      sortBy = 'createdAt',
      sortOrder = -1,
      limit = 50,
      skip = 0
    } = options;
    
    let filter = { userId };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (query) {
      filter.$or = [
        { arabic: { $regex: query, $options: 'i' } },
        { english: { $regex: query, $options: 'i' } }
      ];
    }
    
    return await Word.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(skip);
  }
  
  // Import bulk words
  static async importBulkWords(userId, wordsData) {
    const words = wordsData.map(word => ({
      ...word,
      userId
    }));
    
    return await Word.insertMany(words, { ordered: false });
  }
}

export default WordsService;
