import { I3rabModel } from './e3rbly.model.js';
import { ArabicMeterModel } from './arabicMeter.model.js';
import axios from 'axios';
import AppError from '../../utils/appError.js';

export const handleAIRequest = async ({  type, inputText  }) => {
  if (type !== 'poetry') {
    throw new Error(`النوع "${type}" غير مدعوم حاليًا. فقط poetry مفعل.`);
  }

  const { data } = await axios.post(
    'https://malak-hossam-generate-poetry.hf.space/generate',
    {
      seed_text: inputText,
      sequence_length: 5,
      // max_words,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!data.generated_poem) {
    throw new Error('فشل في توليد الشعر من الموديل.');
  }

  const savedResult = await I3rabModel.create({
    type,
    inputText,
    generated_poem: data.generated_poem,
    // sequence_length,
  });

  return savedResult;
};


export const analyzeMorphology = async ({ inputText , type }) => {

  if (type !== 'morphology') {
    throw new Error(`النوع "${type}" غير مدعوم حاليًا. فقط grammar مفعل.`);
  }

  let aiResponse;
  try {
    const { data, status } = await axios.post('https://malak-hossam-morpology.hf.space/morphology'
      , { text:inputText }
      , { headers: { 'Content-Type': 'application/json' } });
    if (status !== 200 || !data?.result?.length) {
       console.error("AI Response:", data);
       throw new AppError('فشل تحليل النص من النموذج الذكي.', 500);
     }
    aiResponse = data.result; // array of morphology results
  } catch (err) {
    throw new AppError('حدث خطأ أثناء الاتصال بالنموذج الذكي.', 500);
  }

 
  const grammarResult = aiResponse.map(item => ({
    word: item['الكلمة'],
    type: item['الصنف الصرفي'],
    state: item['الحالة'],
    root: item['الجذر']
  }));

  // Save in MongoDB using I3rabModel
  const doc = await I3rabModel.create({
    type: 'morphology',
    inputText ,
    grammarResult
  });

  return {
    message: 'تم تحليل النص بنجاح.',
    analysis: grammarResult,
    savedRecord: doc
  };
};


export const wordMeaningService = {
  analyzeAndStore: async ({ word, type  }) => {
    if (!['synonyms', 'antonyms', 'plural'].includes(type)) {
      throw new AppError('نوع التحليل غير صالح', 400);
    }

    const aiResponse = await axios.post('https://malak-hossam-word-meaning.hf.space/analyze/', { word, type }, {
      headers: { 'Content-Type': 'application/json' },
    }).catch((err) => {
      console.error('AI Response:', err.response?.aiResponse);
      throw new AppError('فشل الاتصال بنموذج الذكاء الاصطناعي', err.response?.status || 500);
    });

    const result = aiResponse?.data?.result;
    if (!result) {
      throw new AppError('لم يتم استلام نتيجة صالحة من النموذج', 400);
    }

    const record = await I3rabModel.create({
      type: type,
      inputText: word,
      meaningSchema: result, // keep field naming consistent
    });

    return {
      word,
      meaningType: type,
      result,
      saved: record.meaningSchema,
    };
  }
};

class ArabicParsingService {
  constructor() {
    this.apiUrl = 'https://aseelsa-my-gemini-api.hf.space/parse';
    this.timeout = 30000;
  }

  async parseArabicSentence(sentence) {
    if (!sentence || typeof sentence !== 'string') {
      throw new AppError('يرجى إدخال جملة صحيحة', 400);
    }

    const trimmed = sentence.trim();
    if (!trimmed) throw new AppError('الجملة لا يمكن أن تكون فارغة', 400);
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount > 10) throw new AppError('الجملة يجب ألا تتجاوز 10 كلمات', 400);

    try {
      const response = await axios.post(this.apiUrl, { prompt: trimmed }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: this.timeout,
      });

      if (!response.data || typeof response.data.analysis !== 'string') {
        console.log(response.data.analysis);
        throw new AppError('استجابة غير صحيحة من خدمة التحليل', 500);
      }

      return {
        success: true,
        sentence: trimmed,
        wordCount,
        analysis: response.data.analysis,
        formatted: this.formatAnalysis(response.data.analysis),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error.isAxiosError) {
        const msg = error.response?.data?.analysis || 'فشل في الاتصال بخدمة التحليل';
        throw new AppError(msg, error.response?.status || 503);
      }
      if (error instanceof AppError) throw error;
      throw new AppError('حدث خطأ غير متوقع في التحليل', 500);
    }
  }

  formatAnalysis(analysis) {
    return analysis
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [word, ...desc] = line.split(':');
        return {
          word: word.trim(),
          parsing: desc.length ? desc.join(':').trim() : 'غير مصنف'
        };
      });
  }
}

export default new ArabicParsingService();



export const predictArabicMeter = async (text ) => {
const AI_ENDPOINT = 'https://aseelsa-fastapi-project.hf.space/predict';  
  try {
    const response = await axios.post(AI_ENDPOINT, { text });
    if (response.status === 200 && response.data?.prediction) {
      const prediction = response.data.prediction;

      // حفظ في قاعدة البيانات
      await ArabicMeterModel.create({
        text,
        predictedMeter: prediction
    ,
      });

      return prediction;
    }
    throw new AppError('فشل في الحصول على نتيجة البحر الشعري', 500);
  } catch (error) {
    console.error(' AI Prediction Error:', error.response?.data || error.message);
    throw new AppError('حدث خطأ أثناء تحليل البحر الشعري', 500);
  }
};
