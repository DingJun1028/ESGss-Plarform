
import React, { useState, useEffect } from 'react';
import { TabId, UserState, Mission, ChatMessage, ToastMessage, IntegrationState, Tag } from './types';
import { SunshineSalonView, HealthCheckView, NetZeroView, AcademyView, ReportHubView, IntelligenceView, RegenerativeView, AboutView, ServicesView } from './components/Views';
import { chatWithJunAi, generateDailyMissions } from './services/ai';
import { 
  LayoutDashboard, Activity, Leaf, BookOpen, Target, Menu, X, Coins, Send, Bot, FileText, Globe, RefreshCcw, Info, Briefcase, GraduationCap, Sparkles, ChevronLeft, Search, User, LogOut, Brain, Plug, Plus, ArrowUpRight, Trophy, Gem, Box, Trash2, Layers
} from 'lucide-react';

const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => (
  <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className={`pointer-events-auto min-w-[300px] p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-fade-in backdrop-blur-xl ${t.type === 'success' ? 'bg-white/90 border-green-200 text-green-800' : 'bg-white/90 border-blue-200 text-blue-800'}`}>
        <div className={`w-2 h-2 rounded-full ${t.type==='success'?'bg-green-500':'bg-blue-500'}`}/>
        <p className="text-sm font-bold">{t.message}</p>
        <button onClick={() => removeToast(t.id)} className="ml-auto text-slate-400"><X size={14}/></button>
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showAiChat, setShowAiChat] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalTags, setGlobalTags] = useState<Tag[]>([{id:'t1', name:'策略', color:'bg-blue-100 text-blue-700'}]);
  
  const [user, setUser] = useState<UserState>({
    name: 'Jun Hong', role: '策略長', coins: 1250, xp: 4500, level: 5, maxXp: 5000,
    badges: ['先驅者', '分析師'], inventory: [{id:'1',name:'綠色藍圖',type:'artifact',icon:'FileText',rarity:'rare',acquiredDate:Date.now()}],
    memory: [], integrations: { flowlu: {connected:false}, bluecc: {connected:false} }
  });

  const [missions, setMissions] = useState<Mission[]>([
    { id: '1', title: '每日碳排紀錄', desc: '填寫數據', reward: 50, completed: false, type: 'daily' },
    { id: '2', title: 'Salon 共讀', desc: '發表心得', reward: 100, completed: false, type: 'learning' }
  ]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{id:'0', role:'model', text:'您好，我是 JunAi。', timestamp:Date.now()}]);
  const [chatInput, setChatInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const addToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(p => [...p, {id, message:msg, type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const handleChat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if(!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: Date.now() };
    setChatHistory(p => [...p, userMsg]);
    setChatInput('');
    setThinking(true);
    const res = await chatWithJunAi(chatInput, { currentTab: activeTab, userRole: user.role, memory: user.memory, integrations: user.integrations });
    setThinking(false);
    setChatHistory(p => [...p, { id: (Date.now()+1).toString(), role: 'model', text: res.text, timestamp: Date.now(), sources: res.sources }]);
    if(res.action?.type === 'NAVIGATE') setActiveTab(res.action.payload.tabId);
  };

  // MECE Pillars
  const navGroups = [
    { title: '觀 Observe', items: [{id:'dashboard',label:'總覽',icon:LayoutDashboard}, {id:'intelligence',label:'商情',icon:Globe}, {id:'netzero',label:'淨零',icon:Leaf}] },
    { title: '診 Diagnose', items: [{id:'health',label:'健檢',icon:Activity}, {id:'regenerative',label:'再生',icon:RefreshCcw}] },
    { title: '策 Strategize', items: [{id:'academy',label:'學院',icon:GraduationCap}, {id:'services',label:'服務',icon:Briefcase}] },
    { title: '行 Act', items: [{id:'report',label:'報告',icon:FileText}] },
    { title: '聯 Connect', items: [{id:'salon',label:'沙龍',icon:BookOpen}, {id:'about',label:'關於',icon:Info}] },
  ];

  return (
    <div className="h-screen flex bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden">
      <ToastContainer toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col z-30">
        <div className="h-20 flex items-center px-6 border-b border-slate-100/50 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 bg-esg-gradient rounded-lg flex items-center justify-center text-white font-bold mr-3">S</div>
          <span className="font-black text-lg tracking-tight">Celestial Nexus</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {navGroups.map(group => (
            <div key={group.title}>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">{group.title}</h4>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id as TabId)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white hover:shadow'}`}>
                    <item.icon size={18}/> {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur-md z-20">
          <h2 className="text-2xl font-black text-slate-800">{navGroups.flatMap(g=>g.items).find(i=>i.id===activeTab)?.label}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-slate-100">
              <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><Coins size={12}/></div>
              <span className="text-sm font-bold">{user.coins}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{user.name[0]}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-12 gap-4">
                {/* Hero Profile */}
                <div className="col-span-8 bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-bold">{user.name[0]}</div>
                      <div><h1 className="text-3xl font-bold">{user.name}</h1><span className="text-xs bg-white/20 px-2 py-1 rounded">{user.role}</span></div>
                    </div>
                    <div className="text-right"><div className="text-sm text-slate-400">Level</div><div className="text-4xl font-black text-green-400">{user.level}</div></div>
                  </div>
                  <div className="mt-8 bg-white/10 h-2 rounded-full overflow-hidden"><div className="h-full bg-green-400 w-3/4"></div></div>
                </div>
                {/* Quick Actions */}
                <div className="col-span-4 grid grid-rows-2 gap-4">
                  <div onClick={() => setActiveTab('academy')} className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center"><div className="font-bold text-lg">每日任務</div><div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><Target/></div></div>
                  <div onClick={() => setActiveTab('netzero')} className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl cursor-pointer flex justify-between items-center"><div className="font-bold text-lg">碳資產</div><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Leaf/></div></div>
                </div>
                {/* Inventory */}
                <div className="col-span-12 bg-white p-8 rounded-[2rem] shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Box size={20}/> 收藏室</h3>
                  <div className="flex gap-4">{user.inventory.map(i => (<div key={i.id} className="w-24 h-32 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-2 border border-slate-100"><Gem className="text-purple-500 mb-2"/><span className="text-xs font-bold text-center">{i.name}</span></div>))}</div>
                </div>
              </div>
            )}
            
            <div className={activeTab === 'dashboard' ? 'hidden' : ''}>
              {activeTab === 'salon' && <SunshineSalonView onAddCoins={n => setUser(u => ({...u, coins:u.coins+n}))} onToast={addToast}/>}
              {activeTab === 'services' && <ServicesView onAddCoins={n => setUser(u => ({...u, coins:u.coins+n}))} onToast={addToast}/>}
              {activeTab === 'report' && <ReportHubView onToast={addToast} integrations={user.integrations} globalTags={globalTags} onAddGlobalTag={t => setGlobalTags(prev => [...prev, t])}/>}
              {activeTab === 'intelligence' && <IntelligenceView onToast={addToast} globalTags={globalTags} onAddGlobalTag={t => setGlobalTags(prev => [...prev, t])}/>}
              {activeTab === 'health' && <HealthCheckView onToast={addToast}/>}
              {activeTab === 'netzero' && <NetZeroView onToast={addToast}/>}
              {activeTab === 'regenerative' && <RegenerativeView onToast={addToast}/>}
              {activeTab === 'academy' && <AcademyView missions={missions} onGenerate={async () => setMissions(await generateDailyMissions(user.level))} onComplete={(id, r) => { setMissions(p => p.map(m => m.id===id ? {...m, completed:true} : m)); setUser(u => ({...u, coins:u.coins+r})); addToast(`任務完成 +${r}`, 'success'); }} onToast={addToast}/>}
              {activeTab === 'about' && <AboutView onToast={addToast} integrations={user.integrations} onUpdateIntegrations={(k, v, key) => setUser(u => ({...u, integrations: {...u.integrations, [k]: {connected: v, apiKey: key}}}))}/>}
            </div>
          </div>
        </div>

        {/* Floating Chat */}
        {showAiChat && (
          <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 flex flex-col z-50 overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b flex justify-between bg-slate-50/80">
              <div className="font-bold flex items-center gap-2"><Bot size={18}/> JunAi Copilot</div>
              <div className="flex gap-1"><button onClick={() => setChatHistory([])}><Trash2 size={16} className="text-slate-400"/></button><button onClick={() => setShowAiChat(false)}><X size={18} className="text-slate-400"/></button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {chatHistory.map(m => (
                <div key={m.id} className={`p-3 rounded-xl text-sm ${m.role==='user'?'bg-slate-900 text-white ml-8':'bg-white border border-slate-100 mr-8'}`}>
                  {m.text}
                  {m.sources && <div className="mt-2 pt-2 border-t border-slate-100/20 text-xs opacity-70">{m.sources.map(s => <div key={s.uri} className="truncate">🔗 {s.title}</div>)}</div>}
                </div>
              ))}
              {thinking && <div className="flex gap-1 px-4"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"/><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"/><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"/></div>}
            </div>
            <form onSubmit={handleChat} className="p-4 bg-white border-t"><div className="relative"><input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="輸入訊息..." className="w-full bg-slate-50 rounded-full pl-4 pr-10 py-3 text-sm outline-none"/><button type="submit" className="absolute right-2 top-2 bg-slate-900 text-white p-1.5 rounded-full"><Send size={14}/></button></div></form>
          </div>
        )}
        {!showAiChat && <button onClick={() => setShowAiChat(true)} className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition z-40 animate-float"><Sparkles size={24}/></button>}
      </main>
    </div>
  );
};

export default App;
