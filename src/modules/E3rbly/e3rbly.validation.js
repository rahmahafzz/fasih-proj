import { z } from 'zod';

export const aiAnalysisSchema = z.object({
  type: z.enum(['poetry', 'grammar', 'plural', 'antonyms', 'synonyms']),
  inputText: z.string().min(1, 'النص مطلوب للتحليل'),

});

export const predictMeterSchema = z.object({
  text: z.string({ required_error: 'يرجى إدخال بيت شعري' }).min(4, 'البيت قصير جدًا')
});  
