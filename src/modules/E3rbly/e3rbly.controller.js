import { aiAnalysisSchema , predictMeterSchema} from './e3rbly.validation.js';
import { ArabicMeterModel } from './arabicMeter.model.js';
import * as aiService from './e3rbly.service.js';
import arabicParsingService from './e3rbly.service.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

export const handleAiAnalysis = async (req, res, next) => {
  try {
    const { type, inputText   } = aiAnalysisSchema.parse(req.body);
    if (!type || !inputText) {
    return res.status(400).json({
      status: 'fail',
      message: 'جميع الحقول مطلوبة.'
    });
  }

  // const userId = req.user?._id;
  // if (!userId) {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'يجب تسجيل الدخول أولاً.'
  //   });
  // }

    const result = await aiService.handleAIRequest({  type, inputText  });
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleMorphologyAnalysis = catchAsync(async (req, res, next) => {
  
  try {
  // const userId = req.user?._id;
  const { inputText , type} = req.body;
    if (!type || !inputText) {
    return res.status(400).json({
      status: 'fail',
      message: 'جميع الحقول مطلوبة.'
    });
  }

  // if (!userId) {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'يجب تسجيل الدخول أولاً.'
  //   });
  // }
  const result = await aiService.analyzeMorphology({  inputText , type });

  res.status(200).json({
    status: 'success',
    message: result.message,
    analysis: result.analysis
  });
  } catch (err) {
    next(err);
  }
});

export const analyzeWordMeaning = catchAsync(async (req, res) => {
  const { word, type } = req.body;
  

 const result = await aiService.wordMeaningService.analyzeAndStore({  word, type });


  res.status(200).json({
    status: 'success',
    data: result,
  });
});  

export const parseArabicSentence = catchAsync(async (req, res, next) => {
  const { sentence, format } = req.body;

  if (!sentence) throw new AppError('يرجى إدخال الجملة المراد إعرابها', 400);

  const result = await arabicParsingService.parseArabicSentence(sentence);

  res.status(200).json({
    status: 'success',
    message: 'تم تحليل الجملة بنجاح',
    data: {
      sentence: result.sentence,
      wordCount: result.wordCount,
      analysis: format === 'structured' ? result.formatted : result.analysis,
      structured: format === 'structured',
      timestamp: result.timestamp
    }
  });
});

export const getParsingStatus = catchAsync(async (req, res, next) => {
  try {
    await arabicParsingService.parseArabicSentence('الولد يلعب');
    res.status(200).json({
      status: 'success',
      service: 'online',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'offline',
      message: 'خدمة الإعراب غير متاحة حالياً',
      timestamp: new Date().toISOString()
    });
  }
});

export const predictMeter = async (req, res, next) => {
  try {
    const { text } = predictMeterSchema.parse(req.body);
    // const userId = req.user._id;
    if (!text || typeof text !== 'string') {
    return res.status(400).json({
      status: 'fail',
      message: 'النص الشعري مطلوب',
    });
  }
    const prediction = await aiService.predictArabicMeter(text );

    res.status(200).json({
      status: 'success',
      message: "بحر الشعر هو ",
      prediction
    });
  } catch (error) {
    next(error);
  }
};

export const getUserMeterHistory = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const predictions = await ArabicMeterModel.find({ userId }).sort('-createdAt');

  return res.status(200).json({
    status: 'success',
    count: predictions.length,
    data: predictions,
  });
});

