
export type TabId = 
  | 'dashboard' 
  | 'health' 
  | 'netzero' 
  | 'intelligence' 
  | 'regenerative'
  | 'services'
  | 'academy'
  | 'salon' 
  | 'report'
  | 'about';

export type PillarId = 'OBSERVE' | 'DIAGNOSE' | 'STRATEGIZE' | 'ACT' | 'CONNECT';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface MemoryFact {
  id: string;
  content: string;
  timestamp: number;
  type: 'preference' | 'context' | 'decision';
}

export interface IntegrationState {
  flowlu: {
    connected: boolean;
    apiKey?: string;
    domain?: string;
    lastSync?: number;
  };
  bluecc: {
    connected: boolean;
    apiKey?: string;
    lastSync?: number;
  };
}

export interface CollectionItem {
  id: string;
  name: string;
  type: 'artifact' | 'tool' | 'skin';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  acquiredDate: number;
}

export interface UserState {
  name: string;
  role: string;
  coins: number;
  xp: number;
  level: number;
  maxXp: number;
  badges: string[];
  inventory: CollectionItem[];
  memory: MemoryFact[];
  integrations: IntegrationState;
}

export interface HealthMetrics {
  e: number;
  s: number;
  g: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description: string;
}

export interface CharityProject {
  id: string;
  title: string;
  target: number;
  raised: number;
  desc: string;
  image: string;
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  reward: number;
  completed: boolean;
  type: 'daily' | 'project' | 'learning';
  tags?: Tag[];
}

export interface InfrastructureTask {
  id: string;
  title: string;
  completed: boolean;
  aiHelp: string; // Prompt for AI help
}

export interface InfrastructureTrack {
  id: string;
  title: string;
  progress: number;
  tasks: InfrastructureTask[];
  icon: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AgentAction {
  type: 'NAVIGATE' | 'REFINE_REPORT' | 'ANALYZE_DATA';
  payload: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  sources?: GroundingSource[];
  actionPerformed?: string;
}

export type ReportFramework = 'GRI' | 'SASB' | 'TCFD' | 'ISSB';

export interface ReportParams {
  companyName: string;
  industry: string;
  framework: ReportFramework;
  rawData: string;
  selectedSections: string[];
  tags: Tag[];
}

export interface IntelligenceData {
  topic: string;
  sentiment: number;
  stakeholders: {
    government: number;
    ngo: number;
    investors: number;
    supplyChain: number;
    consumers: number;
  };
  insights: string[];
  tags: Tag[];
}

export interface RegenerativeLayer {
  layer: 'Philosophy' | 'Strategy' | 'Innovation' | 'Learning' | 'Regeneration';
  score: number;
  analysis: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
