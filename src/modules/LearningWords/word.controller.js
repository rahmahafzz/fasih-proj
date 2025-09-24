import catchAsync from '../../utils/catchAsync.js';
import Word from './word.model.js';
import { z } from 'zod';

// validation layer 
const wordSchema = z.object({
  arabic: z.string().min(1, 'Arabic word is required').trim(),
  english: z.string().min(1, 'English word is required').trim(),
  category: z.enum(['learned', 'favorite']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  createdAt: z.date().optional(),
  lastReviewed: z.date().optional()

});

const updateWordSchema = wordSchema.partial();


export const getWords = catchAsync(async (req, res) => {
  const { category, search, difficulty } = req.query;
  
  let filter = { userId: req.user._id };
  
  // Add category filter
  if (category && ['learned', 'favorite'].includes(category)) {
    filter.category = category;
  }
  
  // Add difficulty filter
  if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
    filter.difficulty = difficulty;
  }
  
  // Add search filter
  if (search) {
    filter.$or = [
      { arabic: { $regex: search, $options: 'i' } },
      { english: { $regex: search, $options: 'i' } }
    ];
  }
  
  const words = await Word.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);
  
  res.json({
    success: true,
    count: words.length,
    data: words
  });
});

//   Get words by category
export const getWordsByCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  
  if (!['learned', 'favorite'].includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category. Must be "learned" or "favorite"'
    });
  }
  
  const words = await Word.find({ 
    userId: req.user._id, 
    category 
  }).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: words.length,
    data: words
  });
});

//   Create new word

export const createWord = catchAsync(async (req, res) => {
  try {
    const validatedData = wordSchema.parse(req.body);
    
    // Check if word already exists for this user
    const existingWord = await Word.findOne({
      userId: req.user._id,
      $or: [
        { arabic: validatedData.arabic },
        { english: validatedData.english }
      ]
    });
    
    if (existingWord) {
      return res.status(400).json({
        success: false,
        message: 'Word already exists in your vocabulary'
      });
    }
    
    const word = await Word.create({
      ...validatedData,
      userId: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Word added successfully',
      data: word
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    throw error;
  }
});

//   Update word

export const updateWord = catchAsync(async (req, res) => {
  try {
    const validatedData = updateWordSchema.parse(req.body);
    
    const word = await Word.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Word not found'
      });
    }
    
    Object.assign(word, validatedData);
    await word.save();
    
    res.json({
      success: true,
      message: 'Word updated successfully',
      data: word
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    throw error;
  }
});

//   Delete word

export const deleteWord = catchAsync(async (req, res) => {
  const word = await Word.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!word) {
    return res.status(404).json({
      success: false,
      message: 'Word not found'
    });
  }
  
  await word.deleteOne();
  
  res.json({
    success: true,
    message: 'Word deleted successfully'
  });
});

//   Move word between categories

export const moveWordCategory = catchAsync(async (req, res) => {
  const { category } = req.body;
  
  if (!['learned', 'favorite'].includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category'
    });
  }
  
  const word = await Word.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!word) {
    return res.status(404).json({
      success: false,
      message: 'Word not found'
    });
  }
  
  word.category = category;
  word.lastReviewed = new Date();
  await word.save();
  
  res.json({
    success: true,
    message: `Word moved to ${category}`,
    data: word
  });
});

//   Get vocabulary statistics

export const getVocabularyStats = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const stats = await Word.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: userId,
        totalWords: { $sum: 1 },
        learnedCount: {
          $sum: { $cond: [{ $eq: ['$category', 'learned'] }, 1, 0] }
        },
        favoriteCount: {
          $sum: { $cond: [{ $eq: ['$category', 'favorite'] }, 1, 0] }
        },
        easyCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] }
        },
        mediumCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] }
        },
        hardCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] }
        }
      }
    }
  ]);
  
  const result = stats[0] || {
    totalWords: 0,
    learnedCount: 0,
    favoriteCount: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0
  };
  
  res.json({
    success: true,
    data: result
  });
});