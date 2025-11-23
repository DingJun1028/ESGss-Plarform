
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Book, HealthMetrics, ReportParams, IntelligenceData, RegenerativeLayer, GroundingSource, AgentAction, TabId, IntegrationState, MemoryFact, Tag } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const modelId = 'gemini-2.5-flash';

const navigationTool: FunctionDeclaration = {
  name: 'navigate_to_section',
  description: 'Navigate the user to a specific section (tab) of the application.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectionId: {
        type: Type.STRING,
        enum: ['dashboard', 'health', 'services', 'intelligence', 'netzero', 'report', 'regenerative', 'academy', 'salon', 'about']
      }
    },
    required: ['sectionId']
  }
};

// --- Mock Integrations ---
export const fetchFlowluProjects = async (apiKey: string): Promise<string> => {
  return `[Flowlu 同步] 專案: 太陽能一期 (進行中), 員工 DEI 工作坊 (已完成), 供應鏈稽核 (規劃中)`;
};

export const fetchBlueCCData = async (apiKey: string): Promise<{ scope3: number, suppliers: number }> => {
  return { scope3: 4500, suppliers: 128 };
};

// --- Tagging System ---
export const generateTags = async (content: string, existingTags: Tag[]): Promise<Tag[]> => {
  if (!process.env.API_KEY) return [{ id: 't1', name: 'ESG', color: 'bg-green-100 text-green-700' }];

  const existingNames = existingTags.map(t => t.name).join(', ');
  const prompt = `
    為內容生成 3 個標籤。
    優先使用現有標籤: [${existingNames}]。
    若需新標籤，請創造並指定 Tailwind 顏色 (bg-*-100 text-*-700)。
    格式: JSON 陣列 [{"name": "...", "color": "..."}]。
    內容: "${content.substring(0, 150)}..."
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const raw = JSON.parse(response.text || '[]');
    return raw.map((t: any, i: number) => ({ id: `tag_${Date.now()}_${i}`, ...t }));
  } catch (e) {
    return [];
  }
};

export const generateHealthDiagnosis = async (metrics: HealthMetrics): Promise<string> => {
  if (!process.env.API_KEY) return "請配置 API Key。";
  const prompt = `顧問角色：針對 E:${metrics.e}, S:${metrics.s}, G:${metrics.g} 給出 100 字內的繁體中文策略診斷與再生建議。`;
  const response = await ai.models.generateContent({ model: modelId, contents: prompt });
  return response.text || "";
};

export const generateBookGuide = async (book: Book): Promise<string> => {
  if (!process.env.API_KEY) return "請配置 API Key。";
  const prompt = `為書名《${book.title}》生成繁體中文導讀：1.核心理念 2.討論題綱 3.行動洞察。Markdown 格式，200字內。`;
  const response = await ai.models.generateContent({ model: modelId, contents: prompt });
  return response.text || "";
};

export const generateDailyMissions = async (userLevel: number): Promise<any[]> => {
  if (!process.env.API_KEY) return [
    { id: 'm1', title: '閱讀氣候新聞', desc: '了解 COP 最新決議', reward: 50, completed: false, type: 'daily' },
    { id: 'm2', title: '零廢棄午餐', desc: '紀錄垃圾量', reward: 100, completed: false, type: 'daily' },
    { id: 'm3', title: '讚賞同事', desc: '感謝同事貢獻', reward: 80, completed: false, type: 'daily' },
  ];

  const prompt = `
    為 Level ${userLevel} 用戶生成 3 個 ESG 任務 (JSON)。
    欄位: title, desc, reward (50-150)。
    主題: 減碳, 社會, 治理。繁體中文。
  `;
  try {
    const res = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const missions = JSON.parse(res.text || '[]');
    return missions.map((m: any, i: number) => ({ ...m, id: `ai_${Date.now()}_${i}`, completed: false, type: 'daily' }));
  } catch (e) { return []; }
};

export const chatWithJunAi = async (
  message: string, 
  context: { currentTab: string, userRole: string, memory: MemoryFact[], integrations: IntegrationState }
): Promise<{ text: string, sources?: GroundingSource[], action?: AgentAction }> => {
   if (!process.env.API_KEY) return { text: "請配置 API Key。" };

   const prompt = `
    角色: JunAi，ESG Sunshine 萬能代理。
    情境: ${context.currentTab}, 角色: ${context.userRole}。
    記憶: ${context.memory.map(m => m.content).join('; ')}。
    工具: googleSearch (查新知), navigate_to_section (導航)。
    語言: 繁體中文 (台灣)。
    用戶: ${message}
   `;

   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }, { functionDeclarations: [navigationTool] }] }
    });

    const text = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text || "思考中...";
    const sources: GroundingSource[] = [];
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((c: any) => {
      if (c.web?.uri) sources.push({ title: c.web.title, uri: c.web.uri });
    });

    let action: AgentAction | undefined;
    const fc = response.functionCalls?.[0];
    if (fc?.name === 'navigate_to_section') {
      action = { type: 'NAVIGATE', payload: { tabId: (fc.args as any).sectionId } };
    }

    return { text, sources, action };
   } catch (e) { return { text: "連線異常。" }; }
};

export const generateESGReport = async (params: ReportParams): Promise<string> => {
  if (!process.env.API_KEY) return "請配置 API Key。";
  const prompt = `
    撰寫 ESG 報告草稿。
    公司: ${params.companyName}, 產業: ${params.industry}, 框架: ${params.framework}。
    數據: ${params.rawData}。
    章節: ${params.selectedSections.join(', ') || '標準全套'}。
    標籤: ${params.tags?.map(t => t.name).join(', ')}。
    要求: 繁體中文 Markdown，專業語氣。
  `;
  const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return res.text || "生成失敗";
};

export const refineESGReport = async (report: string, instruction: string): Promise<string> => {
  if (!process.env.API_KEY) return report;
  const prompt = `
    優化此 ESG 報告片段。
    指令: ${instruction}。
    原文: ${report}
    要求: 保持 Markdown，繁體中文。
  `;
  const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return res.text || report;
};

export const generateIntelligenceAnalysis = async (topic: string): Promise<IntelligenceData> => {
  if (!process.env.API_KEY) return { 
    topic, sentiment: 60, 
    stakeholders: { government: 50, ngo: 50, investors: 50, supplyChain: 50, consumers: 50 }, 
    insights: ["API Key 未配置"], tags: []
  };

  const prompt = `
    分析主題 "${topic}" 的 ESG 趨勢。使用 googleSearch。
    輸出 JSON: { sentiment(0-100), stakeholders:{government, ngo, investors, supplyChain, consumers}, insights: [3 strings] }。
  `;
  try {
    const res = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json' }
    });
    // Handle potentially wrapped JSON code blocks
    const text = res.text || '{}';
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);
    return { topic, tags: [], ...data };
  } catch (e) { return { topic, sentiment: 0, stakeholders: {government:0,ngo:0,investors:0,supplyChain:0,consumers:0}, insights: ["分析錯誤"], tags: [] }; }
};

export const generateRegenerativeAnalysis = async (context: string): Promise<RegenerativeLayer[]> => {
  if (!process.env.API_KEY) return [];
  const prompt = `分析 "${context}" 的再生 ESG 模型 (JSON Array): [{layer, score, analysis}]。`;
  const res = await ai.models.generateContent({ model: modelId, contents: prompt, config: { responseMimeType: 'application/json' } });
  return JSON.parse(res.text || '[]');
};
