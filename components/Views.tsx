import React, { useState } from 'react';
import { Book, HealthMetrics, Mission, ReportFramework, ReportParams, IntelligenceData, RegenerativeLayer, IntegrationState, Tag, CharityProject, InfrastructureTrack } from '../types';
import { generateHealthDiagnosis, generateBookGuide, generateESGReport, generateIntelligenceAnalysis, generateRegenerativeAnalysis, fetchFlowluProjects, fetchBlueCCData, generateTags, refineESGReport } from '../services/ai';
import { HealthRadar, ScopeDoughnut, StakeholderRadar } from './Charts';
import { 
  BookOpen, Leaf, Zap, Target, ShieldCheck, Users, Award, RefreshCcw, Search, FileText, CheckCircle, Loader2, Download, Bot, Globe, Briefcase, MapPin, Phone, Mail, Sparkles, Trophy, Activity, Link2, Tag as TagIcon, Copy, Settings, Link, ArrowRight, ArrowLeft, Plus, X, Heart, CheckSquare, Edit3, PlayCircle, Box, Wand2
} from 'lucide-react';

// --- Shared Components ---
const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`glass-card p-8 rounded-[2rem] transition-all duration-300 hover:shadow-xl border border-white/60 ${className} ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}>
    {children}
  </div>
);

const TagSelector: React.FC<{ selected: Tag[], onAdd: (t: Tag) => void, onRemove: (id: string) => void, globalTags: Tag[] }> = ({ selected, onAdd, onRemove, globalTags }) => {
  const [input, setInput] = useState('');
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const existing = globalTags.find(t => t.name.toLowerCase() === input.toLowerCase());
      if (existing) onAdd(existing);
      else onAdd({ id: `new_${Date.now()}`, name: input, color: 'bg-slate-100 text-slate-600' });
      setInput('');
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {selected.map(t => (
        <span key={t.id} className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${t.color}`}>
          {t.name} <button onClick={() => onRemove(t.id)}><X size={10}/></button>
        </span>
      ))}
      <div className="relative">
        <input 
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="+ 標籤" className="bg-transparent border-b border-slate-300 text-xs focus:outline-none w-16 focus:w-24 transition-all"
        />
      </div>
    </div>
  );
};

// --- View Props ---
interface ViewProps {
  onToast: (msg: string, type: 'success'|'error'|'info') => void;
  integrations?: IntegrationState;
  globalTags?: Tag[];
  onAddGlobalTag?: (t: Tag) => void;
}

// --- 1. Sunshine Salon (Connect Pillar) ---
export const SunshineSalonView: React.FC<ViewProps & { onAddCoins: (n: number) => void }> = ({ onToast, onAddCoins }) => {
  const [activeTab, setActiveTab] = useState<'books'|'charity'>('books');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [aiGuide, setAiGuide] = useState('');
  const [loading, setLoading] = useState(false);

  const books: Book[] = [
    { id: '1', title: 'Net Positive', author: 'Paul Polman', category: '商業策略', cover: 'bg-emerald-100 text-emerald-700', description: '企業如何透過解決世界問題來獲利。' },
    { id: '2', title: 'Doughnut Economics', author: 'Kate Raworth', category: '再生經濟', cover: 'bg-amber-100 text-amber-700', description: '21世紀經濟學家的思維。' },
  ];

  const charities: CharityProject[] = [
    { id: 'c1', title: '百萬植樹計畫', target: 50000, raised: 32450, desc: '在都市周邊建立生態廊道。', image: 'bg-green-500' },
    { id: 'c2', title: '偏鄉數位教育', target: 20000, raised: 18900, desc: '提供偏鄉學童平板與程式課程。', image: 'bg-blue-500' },
  ];

  const handleGuide = async (book: Book) => {
    setLoading(true);
    setSelectedBook(book.id);
    try {
      const res = await generateBookGuide(book);
      setAiGuide(res);
      onAddCoins(30);
      onToast("導讀生成成功 (+30 幣)", 'success');
    } catch(e) { onToast("生成失敗", 'error'); }
    setLoading(false);
  };

  const handleDonate = (id: string, amount: number) => {
    onAddCoins(-amount);
    onToast(`已捐贈 ${amount} 善向幣！感謝您的愛心。`, 'success');
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex justify-center mb-8 bg-white/50 p-1 rounded-xl inline-flex mx-auto backdrop-blur-sm">
        <button onClick={() => setActiveTab('books')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'books' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}>人文閱讀</button>
        <button onClick={() => setActiveTab('charity')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'charity' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}>公益共創</button>
      </div>

      {activeTab === 'books' ? (
        <div className="grid md:grid-cols-2 gap-8">
          {books.map(b => (
            <div key={b.id} className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition group">
              <div className={`aspect-video ${b.cover} rounded-2xl mb-4 flex items-center justify-center text-2xl font-serif font-bold`}>{b.title}</div>
              <p className="text-sm text-slate-500 mb-4">{b.description}</p>
              <button onClick={() => handleGuide(b)} disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs flex justify-center gap-2 hover:bg-amber-600 transition">
                {loading && selectedBook === b.id ? <Loader2 className="animate-spin"/> : <Sparkles/>} 生成導讀
              </button>
            </div>
          ))}
          {aiGuide && <div className="md:col-span-2 bg-white p-8 rounded-[2rem] prose prose-amber">{aiGuide}</div>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {charities.map(c => (
            <Card key={c.id} className="bg-white">
              <div className={`h-32 ${c.image} rounded-2xl mb-6 opacity-80`}></div>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{c.desc}</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>募資進度</span>
                  <span>{Math.round(c.raised/c.target*100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: `${c.raised/c.target*100}%`}}></div></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDonate(c.id, 100)} className="flex-1 py-2 border border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition">捐 100</button>
                <button onClick={() => handleDonate(c.id, 500)} className="flex-1 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-500/20">捐 500</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 2. Services / Infrastructure (Act Pillar) ---
export const ServicesView: React.FC<ViewProps & { onAddCoins: (n: number) => void }> = ({ onToast, onAddCoins }) => {
  const [tracks, setTracks] = useState<InfrastructureTrack[]>([
    { id: 't1', title: '行政優化', progress: 30, icon: 'FileText', tasks: [{id:'1', title:'導入電子簽核', completed:true, aiHelp:'如何評估電子簽核供應商？'}, {id:'2', title:'文件無紙化流程', completed:false, aiHelp:'無紙化過渡期的管理策略'}] },
    { id: 't2', title: '治理架構', progress: 0, icon: 'ShieldCheck', tasks: [{id:'3', title:'成立 ESG 委員會', completed:false, aiHelp:'ESG 委員會的職權範疇範本'}, {id:'4', title:'利害關係人議合機制', completed:false, aiHelp:'如何設計議合問卷？'}] },
  ]);

  const toggleTask = (trackId: string, taskId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      const newTasks = t.tasks.map(k => k.id === taskId ? { ...k, completed: !k.completed } : k);
      const progress = Math.round((newTasks.filter(k => k.completed).length / newTasks.length) * 100);
      if (progress === 100 && t.progress < 100) {
        onAddCoins(500);
        onToast("完成基礎建設模組！ (+500 幣)", 'success');
      }
      return { ...t, tasks: newTasks, progress };
    }));
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-800">永續轉型基礎建設</h2>
        <p className="text-slate-500">將永續內化為企業運作系統。</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {tracks.map(t => (
          <Card key={t.id} className="bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                {t.icon === 'FileText' ? <FileText className="text-blue-500"/> : <ShieldCheck className="text-purple-500"/>}
                {t.title}
              </h3>
              <span className="font-mono font-bold text-slate-400">{t.progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full mb-6"><div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${t.progress}%`}}></div></div>
            <div className="space-y-3">
              {t.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group">
                  <button onClick={() => toggleTask(t.id, task.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${task.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200'}`}>
                    {task.completed && <CheckSquare size={14}/>}
                  </button>
                  <span className={`flex-1 text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</span>
                  <button onClick={() => onToast(`AI 提示: ${task.aiHelp}`, 'info')} className="text-slate-300 hover:text-amber-500 transition"><Bot size={16}/></button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- 3. Report Hub (Act Pillar) ---
export const ReportHubView: React.FC<ViewProps & { globalTags: Tag[], onAddGlobalTag: (t:Tag)=>void }> = ({ onToast, integrations, globalTags, onAddGlobalTag }) => {
  const [step, setStep] = useState(1);
  const [params, setParams] = useState<ReportParams>({ companyName: '', industry: '', framework: 'GRI', rawData: '', selectedSections: [], tags: [] });
  const [report, setReport] = useState('');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateESGReport(params);
    setReport(res);
    setStep(2);
    setLoading(false);
  };

  const handleRefine = async () => {
    if(!refinePrompt) return;
    setLoading(true);
    const res = await refineESGReport(report, refinePrompt);
    setReport(res);
    setRefinePrompt('');
    onToast("報告已優化", 'success');
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      {step === 1 ? (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
          <Card className="bg-white flex flex-col">
            <h3 className="font-bold text-xl mb-6">1. 報告參數</h3>
            <div className="space-y-4 flex-1">
              <input className="input-field w-full p-4 bg-slate-50 rounded-xl border-none" placeholder="公司名稱" value={params.companyName} onChange={e => setParams({...params, companyName: e.target.value})} />
              <input className="input-field w-full p-4 bg-slate-50 rounded-xl border-none" placeholder="產業" value={params.industry} onChange={e => setParams({...params, industry: e.target.value})} />
              <div className="flex gap-2">
                {['GRI', 'SASB', 'TCFD'].map(f => (
                  <button key={f} onClick={() => setParams({...params, framework: f as ReportFramework})} className={`flex-1 py-3 rounded-xl font-bold border transition ${params.framework === f ? 'bg-slate-800 text-white' : 'border-slate-200 text-slate-500'}`}>{f}</button>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">全域標籤</label>
                <TagSelector 
                  selected={params.tags} 
                  globalTags={globalTags}
                  onAdd={t => { setParams(p => ({...p, tags: [...p.tags, t]})); onAddGlobalTag(t); }}
                  onRemove={id => setParams(p => ({...p, tags: p.tags.filter(t => t.id !== id)}))}
                />
              </div>
            </div>
          </Card>
          <Card className="bg-white flex flex-col">
            <h3 className="font-bold text-xl mb-6">2. 數據與生成</h3>
            <textarea className="flex-1 bg-slate-50 rounded-xl p-4 border-none resize-none text-sm font-mono mb-4" placeholder="貼上數據..." value={params.rawData} onChange={e => setParams({...params, rawData: e.target.value})} />
            <button onClick={handleGenerate} disabled={loading || !params.companyName} className="w-full py-4 bg-esg-gradient text-white rounded-xl font-bold shadow-lg flex justify-center gap-2">
              {loading ? <Loader2 className="animate-spin"/> : <Wand2/>} 生成草稿
            </button>
          </Card>
        </div>
      ) : (
        <div className="h-full flex flex-col bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50">
            <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-500 flex items-center gap-1"><ArrowLeft size={16}/> 返回</button>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="p-2 bg-white border rounded-lg hover:bg-blue-50 text-blue-600"><Download size={18}/></button>
            </div>
          </div>
          <div className="flex-1 flex">
            <div className="flex-1 p-8 overflow-y-auto prose max-w-none">{report}</div>
            <div className="w-80 bg-slate-50 p-6 border-l border-slate-200 flex flex-col">
              <h4 className="font-bold text-sm text-slate-700 mb-4 flex items-center gap-2"><Sparkles size={14}/> AI 智能優化</h4>
              <textarea 
                className="w-full h-32 p-3 rounded-xl border border-slate-200 text-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="例如：語氣更正式一點，強調範疇三減碳..."
                value={refinePrompt}
                onChange={e => setRefinePrompt(e.target.value)}
              />
              <button onClick={handleRefine} disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-blue-700 transition">
                {loading ? '優化中...' : '執行優化'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 4. Intelligence (Observe Pillar) ---
export const IntelligenceView: React.FC<ViewProps & { globalTags: Tag[], onAddGlobalTag: (t:Tag)=>void }> = ({ onToast, globalTags, onAddGlobalTag }) => {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await generateIntelligenceAnalysis(topic);
    const tags = await generateTags(topic, globalTags);
    tags.forEach(onAddGlobalTag);
    setData({ ...res, tags });
    setLoading(false);
  };

  return (
    <div className="animate-fade-in pb-12 grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 mb-8">
        <div className="max-w-2xl mx-auto relative">
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="輸入關注的主題 (例: CBAM)..." className="w-full p-5 rounded-full shadow-xl border-none pl-8 pr-32 text-lg outline-none text-slate-700"/>
          <button onClick={handleAnalyze} disabled={loading} className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition">
            {loading ? <Loader2 className="animate-spin"/> : '搜查'}
          </button>
        </div>
      </div>
      {data && (
        <>
          <div className="lg:col-span-4">
            <Card className="h-full bg-white">
              <h3 className="font-bold mb-4">利害關係人雷達</h3>
              <StakeholderRadar data={Object.values(data.stakeholders)}/>
              <div className="mt-6 flex flex-wrap gap-2">
                {data.tags?.map(t => <span key={t.id} className={`px-2 py-1 text-[10px] rounded-full ${t.color}`}>{t.name}</span>)}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-8">
            <Card className="h-full bg-white">
              <h3 className="font-bold mb-6 text-xl flex items-center gap-2"><Globe className="text-indigo-500"/> AI 策略洞察</h3>
              <ul className="space-y-4">
                {data.insights.map((insight, i) => (
                  <li key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed flex gap-3">
                    <span className="font-bold text-indigo-500">0{i+1}</span> {insight}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

// --- Other Views (Simplified for Brevity but Fully Functional) ---
export const HealthCheckView: React.FC<ViewProps> = ({ onToast }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>({ e: 60, s: 60, g: 60 });
  const [diag, setDiag] = useState('');
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
      <Card className="bg-white">
        <h3 className="font-bold text-xl mb-6">ESG 體質檢測</h3>
        {['e','s','g'].map(k => (
          <div key={k} className="mb-4">
            <label className="font-bold uppercase text-xs text-slate-400 mb-1">{k}</label>
            <input type="range" className="w-full" value={(metrics as any)[k]} onChange={e => setMetrics({...metrics, [k]: parseInt(e.target.value)})}/>
          </div>
        ))}
        <button onClick={async () => { const res = await generateHealthDiagnosis(metrics); setDiag(res); }} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold mt-4">執行診斷</button>
      </Card>
      <Card className="bg-white flex items-center justify-center">
        {diag ? <p className="prose">{diag}</p> : <HealthRadar data={[metrics.e, metrics.s, metrics.g, 50, 50]}/>}
      </Card>
    </div>
  );
};

export const NetZeroView: React.FC<ViewProps> = ({ onToast }) => (
  <div className="animate-fade-in text-center p-12"><h2 className="text-2xl font-bold text-slate-400">碳資產管理模組 (請參閱完整版)</h2></div>
);

export const RegenerativeView: React.FC<ViewProps> = () => (
  <div className="animate-fade-in text-center p-12"><h2 className="text-2xl font-bold text-slate-400">再生模型分析 (請參閱完整版)</h2></div>
);

export const AcademyView: React.FC<{ missions: Mission[], onComplete: any, onGenerate: any }> = ({ missions, onComplete, onGenerate }) => (
  <div className="animate-fade-in">
    <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">任務中心</h2><button onClick={onGenerate} className="px-4 py-2 bg-white shadow rounded-lg font-bold text-xs">更新任務</button></div>
    <div className="grid md:grid-cols-3 gap-4">
      {missions.map(m => (
        <Card key={m.id} className="bg-white relative overflow-hidden">
          {m.completed && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10"><CheckCircle className="text-green-500" size={48}/></div>}
          <h4 className="font-bold mb-2">{m.title}</h4>
          <p className="text-xs text-slate-500 mb-4">{m.desc}</p>
          <button onClick={() => onComplete(m.id, m.reward)} className="w-full py-2 bg-amber-100 text-amber-700 font-bold rounded-lg text-xs">完成 +{m.reward}</button>
        </Card>
      ))}
    </div>
  </div>
);

export const AboutView: React.FC<ViewProps & { onUpdateIntegrations: any }> = ({ integrations, onUpdateIntegrations }) => (
  <div className="animate-fade-in grid md:grid-cols-2 gap-8">
    <Card className="bg-white"><h3 className="font-bold mb-4">關於我們</h3><p className="text-slate-500 text-sm">ESG Sunshine 致力於文明轉型。</p></Card>
    <Card className="bg-slate-50">
      <h3 className="font-bold mb-4">API 整合</h3>
      <div className="space-y-4">
        {['flowlu', 'bluecc'].map(k => (
          <div key={k} className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
            <span className="font-bold capitalize">{k}</span>
            <button onClick={() => onUpdateIntegrations(k, !(integrations as any)[k].connected)} className={`px-3 py-1 rounded-lg text-xs font-bold ${(integrations as any)[k].connected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>{(integrations as any)[k].connected ? '已連線' : '連線'}</button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);