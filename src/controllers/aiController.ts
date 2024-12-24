import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StudyPlanRequest, ConceptExplainerRequest } from '../types/ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateStudyPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body as StudyPlanRequest;
    
    const prompt = `Ben bir ilkokul öğrencisiyim. Sana verdiğim bilgilerle bana kişiselleştirilmiş çalışma programı hazırla. 
    
 ${data.grade}. sınıfa gidiyorum.
${data.subjects.join(', ')} dersleriyle ilgili program hazırlamanı istiyorum.
Günde ${data.dailyHours} saat çalışabilirim.
${data.durationWeeks} haftalık program hazırlamanı istiyorum.
 ${data.excludedDays.join(', ')} günlerini boş bırak.
${data.preferredTopics ? ` ${data.preferredTopics} konularında eksiğim var` : ''}

Lütfen bu bilgilere göre bana bir ders çalışma programı oluştur..`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() + "\n\nLütfen bu sonuçları öğretmeninle paylaşıp ondan da onay almayı unutma.";
    
    res.status(200).send(text);
  } catch (error) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
};

export const explainConcept = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.body as ConceptExplainerRequest;
    
    const prompt = `"${topic}" konusunu bir ilkokul öğrencisine anlatır mısın? 
    
Lütfen:
1. En fazla 2 paragraf kullan
2. İlkokul seviyesinde, basit ve anlaşılır bir dil kullan
3. Mümkünse günlük hayattan örnekler ver
4. Karmaşık terimlerden kaçın`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() + "\n\nLütfen bu sonuçları öğretmeninle paylaşıp ondan da onay almayı unutma.";
    
    res.status(200).send(text);
  } catch (error) {
    console.error('Error explaining concept:', error);
    res.status(500).json({ error: 'Failed to explain concept' });
  }
};