import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Search,
  Globe,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Cpu,
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';
import { BotVibeTemplatePackage, SearchGroundingResult } from '../types';
import { SAMPLE_RESEARCH_REPORTS } from '../data/sampleTemplates';

interface ResearchStudioProps {
  currentPackage: BotVibeTemplatePackage;
  onBlueprintGenerated: (newPkg: BotVibeTemplatePackage) => void;
  onNavigateToCanvas: () => void;
}

interface ProviderCatalog {
  gemini: {
    name: string;
    configured: boolean;
    models: string[];
    hasSearchGrounding: boolean;
    description: string;
  };
  cometapi: {
    name: string;
    configured: boolean;
    models: string[];
    description: string;
  };
  aimlapi: {
    name: string;
    configured: boolean;
    models: string[];
    description: string;
  };
}

export const ResearchStudio: React.FC<ResearchStudioProps> = ({
  currentPackage,
  onBlueprintGenerated,
  onNavigateToCanvas,
}) => {
  const [reportText, setReportText] = useState(SAMPLE_RESEARCH_REPORTS[0].sampleRawReport);
  const [selectedReportId, setSelectedReportId] = useState(SAMPLE_RESEARCH_REPORTS[0].id);
  const [category, setCategory] = useState('Sales Automation & CRM');
  const [priceUSD, setPriceUSD] = useState(79);

  // AI Provider & Model Configuration
  const [providers, setProviders] = useState<ProviderCatalog | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'cometapi' | 'aimlapi'>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Google Search Grounding Scout
  const [scoutQuery, setScoutQuery] = useState('Latenode.com top selling automation templates and pricing 2025 2026');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutResult, setScoutResult] = useState<SearchGroundingResult | null>(null);
  const [scoutError, setScoutError] = useState<string | null>(null);
  const [showScoutPanel, setShowScoutPanel] = useState(true);

  // Provider Connection Tester
  const [showTestModal, setShowTestModal] = useState(false);
  const [testProvider, setTestProvider] = useState<'gemini' | 'cometapi' | 'aimlapi'>('gemini');
  const [testModel, setTestModel] = useState('gemini-3.8-flash');
  const [testPrompt, setTestPrompt] = useState('Verify model latency and readiness for BotVibe AI template blueprinting.');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // Fetch AI providers status on mount
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
      if (res.ok) {
        const data: ProviderCatalog = await res.json();
        setProviders(data);
      }
    } catch (e) {
      console.error('Failed to load AI providers:', e);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_RESEARCH_REPORTS[0]) => {
    setSelectedReportId(sample.id);
    setReportText(sample.sampleRawReport);
    setCategory(sample.category);
  };

  // Execute Live Google Search Grounding Scout (gemini-3.5-flash with googleSearch tool)
  const handleRunGoogleSearchScout = async () => {
    if (!scoutQuery.trim()) return;
    setIsScouting(true);
    setScoutError(null);

    try {
      const res = await fetch('/api/google-search-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: scoutQuery }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to execute Google Search Grounding');
      }

      const data: SearchGroundingResult = await res.json();
      setScoutResult(data);
    } catch (err: any) {
      console.error(err);
      setScoutError(err.message || 'Error executing Google Search Grounding.');
    } finally {
      setIsScouting(false);
    }
  };

  // Append Grounded Intelligence to the Raw Report
  const handleAppendScoutToReport = () => {
    if (!scoutResult) return;
    const sourcesList = scoutResult.sources.map(s => `- [${s.title}](${s.url})`).join('\n');
    const queriesList = scoutResult.webSearchQueries.map(q => `- "${q}"`).join('\n');

    const appendix = `\n\n--- GOOGLE SEARCH GROUNDED INTELLIGENCE (${new Date().toISOString().split('T')[0]}) ---\nQuery: ${scoutResult.query}\n\nKey Findings:\n${scoutResult.summary}\n\nSearch Queries Evaluated:\n${queriesList}\n\nVerified Sources:\n${sourcesList}\n--------------------------------------------------------------\n`;

    setReportText(prev => prev + appendix);
    setSelectedReportId('');
  };

  // Run Provider Connection Test
  const handleTestProvider = async () => {
    setIsTesting(true);
    setTestError(null);
    setTestOutput(null);
    setTestLatency(null);

    try {
      const res = await fetch('/api/test-provider-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: testProvider,
          model: testModel,
          testPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Test failed');
      }

      setTestOutput(data.output);
      setTestLatency(data.latencyMs);
    } catch (err: any) {
      setTestError(err.message || 'Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  // Run Template Architecture Generation
  const handleRunAnalysis = async () => {
    if (!reportText.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);

    const providerLabel = selectedProvider === 'gemini' ? 'Google Gemini' : selectedProvider === 'cometapi' ? 'CometAPI.com' : 'AIMLAPI.com';
    setGenerationStep(
      useSearchGrounding
        ? 'Grounding with live Google Search data (gemini-3.5-flash)...'
        : `Synthesizing architecture via ${providerLabel} (${selectedModel})...`
    );

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Applying BotVibe Golden Standard & Canvas Sticky Notes...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Generating sequential Codex & Antigravity build prompts...');
      }, 3000);

      const stepTimer3 = setTimeout(() => {
        setGenerationStep('Packaging Latenode scenario JSON & marketplace listing...');
      }, 4500);

      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawReport: reportText,
          category,
          targetPriceUSD: Number(priceUSD),
          useSearchGrounding,
          provider: selectedProvider,
          model: selectedModel,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze report');
      }

      const generatedPackage: BotVibeTemplatePackage = await res.json();
      onBlueprintGenerated(generatedPackage);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with AI backend.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            BotVibe AI Research Ingestion &amp; Multi-Model Engine
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Turn Any Research Report into a Standardized Latenode.com Template to Sell
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Submit any market research, client workflow spec, or competitor automation report.
            Enrich your blueprint with live <strong>Google Search Grounding</strong> (using gemini-3.5-flash with googleSearch tool),
            or pull from 200+ frontier models via <strong>CometAPI.com</strong> and <strong>AIMLAPI.com</strong>.
            This engine synthesizes standardized BotVibe nodes, canvas sticky notes, sequential Codex/Antigravity prompts,
            and produces a 100% complete marketplace submission bundle.
          </p>
        </div>
      </div>

      {/* AI Providers & Secrets Status Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Configured AI Providers &amp; Multi-Model Hub
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Google Gemini Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-950 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${providers?.gemini.configured !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="font-semibold text-slate-300">Google Gemini:</span>
              <span className="font-mono text-emerald-400 text-[11px]">Search Grounded (gemini-3.5-flash)</span>
            </div>

            {/* CometAPI.com Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-950 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${providers?.cometapi.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-300">CometAPI.com:</span>
              <span className={`font-mono text-[11px] ${providers?.cometapi.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {providers?.cometapi.configured ? 'Active (COMETAPI_API_KEY)' : 'Secret Ready'}
              </span>
            </div>

            {/* AIMLAPI.com Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-950 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${providers?.aimlapi.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-300">AIMLAPI.com:</span>
              <span className={`font-mono text-[11px] ${providers?.aimlapi.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {providers?.aimlapi.configured ? 'Active (AIMLAPI_API_KEY)' : 'Secret Ready'}
              </span>
            </div>

            <button
              onClick={() => setShowTestModal(true)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Test Provider Latency
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: Dedicated Google Search Data Grounding & Live Latenode Scout */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-900/30 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Live Google Search Grounded Market Scout
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  gemini-3.5-flash with googleSearch
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Ground your research report with live Google Search data: fetch real-time 2025/2026 Latenode API docs, rate limits, competitor workflows, and pricing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowScoutPanel(!showScoutPanel)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            {showScoutPanel ? 'Collapse Scout' : 'Expand Scout'}
          </button>
        </div>

        {showScoutPanel && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={scoutQuery}
                  onChange={e => setScoutQuery(e.target.value)}
                  placeholder="e.g. Latenode top selling templates, Stripe webhook error handling patterns, HubSpot enrichment..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              <button
                onClick={handleRunGoogleSearchScout}
                disabled={isScouting || !scoutQuery.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition disabled:opacity-50 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                {isScouting ? 'Searching Google...' : 'Scout with Google Search'}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-mono">Suggested Searches:</span>
              {[
                'Latenode top trending templates and marketplace prices 2025 2026',
                'Latenode headless browser puppeteer scraping best practices',
                'B2B AI lead enrichment Make vs Latenode vs Zapier workflow nodes',
                'Stripe customer subscription billing webhook error recovery',
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => setScoutQuery(query)}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-300 transition text-[10px]"
                >
                  {query.slice(0, 36)}...
                </button>
              ))}
            </div>

            {scoutError && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-xs text-red-200">
                <strong>Google Search Error:</strong> {scoutError}
              </div>
            )}

            {/* Scout Results Display */}
            {scoutResult && (
              <div className="bg-slate-950 border border-blue-900/40 rounded-xl p-4 space-y-3 mt-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      Google Search Grounding Results
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {scoutResult.sources.length} Verified Sources Found
                    </span>
                  </div>

                  <button
                    onClick={handleAppendScoutToReport}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md shadow flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Inject Grounding into Research Report
                  </button>
                </div>

                {/* Grounding Web Search Queries */}
                {scoutResult.webSearchQueries.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-500">
                      Actual Google Search Queries Executed:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scoutResult.webSearchQueries.map((q, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 text-[10px] font-mono border border-blue-800/40"
                        >
                          "{q}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounding Summary */}
                <div className="text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-sans whitespace-pre-line">
                  {scoutResult.summary}
                </div>

                {/* Verified Web Citations / Sources */}
                {scoutResult.sources.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-500">
                      Live Verified Web Citations:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scoutResult.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white transition group"
                        >
                          <span className="text-[11px] truncate pr-2 group-hover:text-blue-300 font-medium">
                            {src.title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset Research Reports Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Select a Preset Research Report or Paste Custom Below:
          </span>
          <span className="text-xs text-slate-500 font-mono">3 Production Blueprints Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_RESEARCH_REPORTS.map(sample => {
            const isSelected = selectedReportId === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-slate-900 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg -translate-y-0.5'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/40">
                    {sample.category}
                  </span>
                  <span className="font-bold text-emerald-400 font-mono text-xs">{sample.estimatedValue}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{sample.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{sample.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Research Ingestion Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Raw Research Report Content
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Markdown, bullet points, or unstructured text supported
            </span>
          </div>

          <textarea
            value={reportText}
            onChange={e => {
              setReportText(e.target.value);
              setSelectedReportId('');
            }}
            rows={13}
            placeholder="Paste your research report, workflow requirement, API documentation, or template idea here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-amber-400 transition custom-scrollbar"
          />

          {/* Model & Grounding Controls */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                AI Model &amp; Grounding Architecture
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedProvider.toUpperCase()} • {selectedModel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Provider Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  AI Provider Engine
                </label>
                <select
                  value={selectedProvider}
                  onChange={e => {
                    const prov = e.target.value as 'gemini' | 'cometapi' | 'aimlapi';
                    setSelectedProvider(prov);
                    if (prov === 'gemini') setSelectedModel('gemini-3.8-flash');
                    else if (prov === 'cometapi') setSelectedModel('claude-3-7-sonnet');
                    else if (prov === 'aimlapi') setSelectedModel('claude-3-5-sonnet-20241022');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="gemini">Google Gemini (Native + Search Grounding)</option>
                  <option value="cometapi">CometAPI.com (200+ Frontier Models)</option>
                  <option value="aimlapi">AIMLAPI.com (200+ AI Models)</option>
                </select>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Selected Frontier Model
                </label>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {selectedProvider === 'gemini' && (
                    <>
                      <option value="gemini-3.8-flash">gemini-3.8-flash (BotVibe Golden Standard)</option>
                      <option value="gemini-3.5-flash">gemini-3.5-flash (Google Search Grounded)</option>
                    </>
                  )}
                  {selectedProvider === 'cometapi' && (
                    <>
                      <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (via CometAPI)</option>
                      <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (via CometAPI)</option>
                      <option value="gpt-4o">GPT-4o (via CometAPI)</option>
                      <option value="deepseek-ai/DeepSeek-R1">DeepSeek R1 (via CometAPI)</option>
                      <option value="deepseek-ai/DeepSeek-V3">DeepSeek V3 (via CometAPI)</option>
                      <option value="meta-llama/Llama-3.3-70B-Instruct">Llama 3.3 70B (via CometAPI)</option>
                    </>
                  )}
                  {selectedProvider === 'aimlapi' && (
                    <>
                      <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (via AIMLAPI)</option>
                      <option value="gpt-4o">GPT-4o (via AIMLAPI)</option>
                      <option value="deepseek/deepseek-r1">DeepSeek R1 (via AIMLAPI)</option>
                      <option value="deepseek/deepseek-chat">DeepSeek Chat V3 (via AIMLAPI)</option>
                      <option value="mistralai/Mistral-Large-2407">Mistral Large (via AIMLAPI)</option>
                      <option value="meta-llama/Llama-3.3-70B-Instruct-Turbo">Llama 3.3 70B (via AIMLAPI)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Google Search Grounding Checkbox */}
            <div className="flex items-center justify-between p-2.5 bg-blue-950/20 border border-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Real-Time Google Search Grounding
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Uses gemini-3.5-flash with googleSearch tool to ground template architecture in 2025/2026 data.
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSearchGrounding}
                  onChange={e => setUseSearchGrounding(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Template Category</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recommended Sale Price (USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="number"
                  value={priceUSD}
                  onChange={e => setPriceUSD(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-xs text-red-200">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          <button
            onClick={handleRunAnalysis}
            disabled={isGenerating || !reportText.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 text-sm shadow-xl shadow-amber-500/10 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            {isGenerating ? generationStep : `Architect BotVibe AI Blueprint (${selectedProvider.toUpperCase()})`}
          </button>
        </div>

        {/* Right Info (4 cols): Current Template Blueprint Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Active Template Status
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono">
                {currentPackage.version}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{currentPackage.templateName}</h3>
              <p className="text-xs text-slate-400 mt-1">{currentPackage.researchSummary.coreProblemSolved}</p>
            </div>

            {/* Google Search Grounding Status for current package */}
            {currentPackage.searchGrounding?.used ? (
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-[11px]">
                  <Globe className="w-3.5 h-3.5" />
                  Google Search Grounded (gemini-3.5-flash)
                </div>
                <p className="text-[10px] text-slate-400">
                  {currentPackage.searchGrounding.sources?.length || 0} live citations and verified APIs embedded.
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px]">Grounding Mode: </span>
                <span className="text-amber-400 text-[11px] font-mono">BotVibe Golden Standards</span>
              </div>
            )}

            {/* AI Model Attribution for current package */}
            {currentPackage.aiProviderUsed && (
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Architect Engine:</span>
                <span className="font-mono text-amber-400 text-[11px] font-semibold">
                  {currentPackage.aiProviderUsed.provider.toUpperCase()} • {currentPackage.aiProviderUsed.model}
                </span>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Total Nodes:</span>
                <span className="font-mono font-bold text-white">{currentPackage.nodes.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Sequential Build Steps:</span>
                <span className="font-mono font-bold text-white">{currentPackage.buildSteps.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Sticky Notes:</span>
                <span className="font-mono font-bold text-emerald-400">100% Documented</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Target Marketplace Price:</span>
                <span className="font-mono font-bold text-amber-400">${currentPackage.marketplaceListing.recommendedPriceUSD}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToCanvas}
              className="w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
            >
              Open Interactive Canvas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Golden Standard Rulebox */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2 text-slate-400">
            <span className="font-bold text-slate-200 block text-xs">BotVibe AI Golden Standards Guarantee:</span>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-400">
              <li>Uniform naming: <code className="text-amber-400">BV_[Category]_[Step]_[Action]</code></li>
              <li>Every node has a descriptive sticky note above it</li>
              <li>Zero hardcoded API secrets (global variables only)</li>
              <li>Pre-built universal error handling branch</li>
              <li>Testing after each step to feed Codex or Antigravity</li>
              <li>Search grounded in live 2025/2026 technical docs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Provider Connectivity Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">AI Provider Latency &amp; Readiness Tester</h3>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Provider</label>
                  <select
                    value={testProvider}
                    onChange={e => {
                      const p = e.target.value as any;
                      setTestProvider(p);
                      if (p === 'gemini') setTestModel('gemini-3.8-flash');
                      else if (p === 'cometapi') setTestModel('claude-3-7-sonnet');
                      else if (p === 'aimlapi') setTestModel('claude-3-5-sonnet-20241022');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="cometapi">CometAPI.com</option>
                    <option value="aimlapi">AIMLAPI.com</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    value={testModel}
                    onChange={e => setTestModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Test Prompt</label>
                <input
                  type="text"
                  value={testPrompt}
                  onChange={e => setTestPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              {testError && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/50 rounded text-xs text-red-200">
                  {testError}
                </div>
              )}

              {testOutput && (
                <div className="p-3 bg-slate-950 border border-emerald-800/40 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-semibold">Response Received:</span>
                    <span className="font-mono text-slate-400">{testLatency}ms latency</span>
                  </div>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">{testOutput}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                >
                  Close
                </button>
                <button
                  onClick={handleTestProvider}
                  disabled={isTesting}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition disabled:opacity-50"
                >
                  {isTesting ? 'Pinging Provider...' : 'Send Test Query'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
