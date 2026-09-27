export type LatenodeNodeType =
  | 'webhook'
  | 'webhook_response'
  | 'javascript'
  | 'python'
  | 'ai_prompt'
  | 'headless_browser'
  | 'http_request'
  | 'nodul_input'
  | 'nodul_output'
  | 'router_filter'
  | 'schedule_cron'
  | 'error_handler';

export interface StickyNote {
  title: string;
  instructions: string;
  requiredCredentials: string[];
  inputSchemaNotes: string;
  outputContract: string;
  testRule: string;
  color: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'slate';
}

export interface LatenodeNode {
  id: string;
  name: string; // e.g. BV_TRIG_01_WebhookReceiver
  type: LatenodeNodeType;
  title: string;
  subtitle?: string;
  position: { x: number; y: number };
  stickyNote: StickyNote;
  config: Record<string, any>;
  codeSnippet?: string; // For JS / Python nodes
  sampleInput: Record<string, any>;
  sampleOutput: Record<string, any>;
}

export interface LatenodeConnection {
  id: string;
  fromNodeId: string;
  fromPort: string;
  toNodeId: string;
  toPort: string;
}

export interface BuildStep {
  stepNumber: number;
  title: string;
  nodeName: string;
  nodeType: LatenodeNodeType;
  purpose: string;
  canvasPlacement: { x: number; y: number };
  stickyNoteContent: {
    badgeText: string;
    instructions: string;
    buyerAction: string;
  };
  configurationGuide: string[];
  codeContent?: string;
  testPayload: Record<string, any>;
  expectedAssertion: string;
  codexPrompt: string;
  antigravityPrompt: string;
}

export interface QATestCase {
  id: string;
  name: string;
  testType: 'Happy Path' | 'Edge Case' | 'Auth Failure' | 'Malformed Payload' | 'Rate Limit';
  inputMock: Record<string, any>;
  expectedOutputKeys: string[];
  assertion: string;
  status: 'passed' | 'failed' | 'pending';
}

export interface MarketplaceListing {
  title: string;
  shortTagline: string;
  recommendedPriceUSD: number;
  category: string;
  targetBuyers: string[];
  setupTimeMinutes: number;
  prerequisites: string[];
  fullMarkdownDescription: string;
  keyFeatures: string[];
  tags: string[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface SearchGroundingResult {
  query: string;
  summary: string;
  webSearchQueries: string[];
  sources: GroundingSource[];
  timestamp: string;
}

export interface AIProviderStatus {
  gemini: {
    configured: boolean;
    models: string[];
    hasSearchGrounding: boolean;
  };
  cometapi: {
    configured: boolean;
    models: string[];
  };
  aimlapi: {
    configured: boolean;
    models: string[];
  };
}

export interface BotVibeTemplatePackage {
  id: string;
  templateName: string;
  slug: string;
  companyName: 'BotVibe AI';
  version: string;
  createdAt: string;
  researchSummary: {
    reportTitle: string;
    marketOpportunity: string;
    coreProblemSolved: string;
    targetIndustries: string[];
    monetizationAngle: string;
  };
  searchGrounding?: {
    used: boolean;
    query?: string;
    webSearchQueries?: string[];
    sources?: GroundingSource[];
  };
  aiProviderUsed?: {
    provider: 'gemini' | 'cometapi' | 'aimlapi';
    model: string;
  };
  nodes: LatenodeNode[];
  connections: LatenodeConnection[];
  globalVariables: { key: string; description: string; defaultValue: string }[];
  credentialPlaceholders: { name: string; type: string; required: boolean; helperText: string }[];
  buildSteps: BuildStep[];
  qaTestCases: QATestCase[];
  marketplaceListing: MarketplaceListing;
  buyerSetupGuideMarkdown: string;
  latenodeScenarioJson: Record<string, any>;
}
