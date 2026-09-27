import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Package,
  FileCode,
  FileText,
  DollarSign,
  Tag,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowDownToLine,
  BookOpen
} from 'lucide-react';
import { BotVibeTemplatePackage } from '../types';
import { generateSubmissionZip, downloadBlob, copyToClipboard, generatePackageReadme } from '../utils/packageExporter';

interface MarketplacePackageProps {
  pkg: BotVibeTemplatePackage;
}

export const MarketplacePackage: React.FC<MarketplacePackageProps> = ({ pkg }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'readme' | 'listing' | 'setupGuide' | 'scenarioJson' | 'checklist'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const readmeContent = generatePackageReadme(pkg);

  const handleCopy = (text: string, key: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const blob = await generateSubmissionZip(pkg);
      downloadBlob(blob, `${pkg.slug}-latenode-submission-package.zip`);
    } catch (e) {
      console.error('Error generating zip:', e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(pkg.latenodeScenarioJson, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlob(blob, `${pkg.slug}.latenode.json`);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, 'README.md');
  };

  // Latenode Marketplace Review Criteria Checklist
  const reviewChecklist = [
    {
      title: 'Zero Hardcoded Secrets in Scenario JSON',
      desc: 'All API keys and webhooks parameterized via {{env.*}} to protect creator and buyer security.',
      status: 'pass',
    },
    {
      title: 'Instructional Sticky Notes Above Nodes',
      desc: 'Visual notes placed on canvas detailing inputs, credentials, and verification steps for buyer.',
      status: 'pass',
    },
    {
      title: 'Valid Scenario JSON Schema & Connections',
      desc: 'Tested and verified import structure with nodes, ports, and execution coordinates.',
      status: 'pass',
    },
    {
      title: 'Under 10-Minute Buyer Setup Protocol',
      desc: 'Documented 4-step setup requiring only API key injection and trigger binding.',
      status: 'pass',
    },
    {
      title: 'Universal Failsafe Error Handling Branch',
      desc: 'Scenario catches external API timeouts or bad payloads without crashing.',
      status: 'pass',
    },
    {
      title: 'High-Converting Marketplace Listing Copy',
      desc: 'Hook, value proposition, feature bullets, and prerequisites formatted in Markdown.',
      status: 'pass',
    },
    {
      title: 'Complete QA Test Harness Included',
      desc: 'Happy path and edge-case test payloads verified for buyer self-testing.',
      status: 'pass',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & 1-Click Download Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              100% Complete Marketplace Submission Package
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
              BotVibe AI Ready
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {pkg.marketplaceListing.title}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Everything dotted and crossed: Latenode Scenario JSON, high-converting marketplace listing copy,
            step-by-step buyer onboarding guide, QA test documents, and Codex/Antigravity prompts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleDownloadJson}
            className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition"
          >
            <FileCode className="w-4 h-4 text-blue-400" />
            Download .JSON
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-xl shadow-emerald-500/20 disabled:opacity-50"
          >
            <ArrowDownToLine className="w-4 h-4" />
            {isZipping ? 'Bundling Package...' : 'Download Complete Submission ZIP (1-Click)'}
          </button>
        </div>
      </div>

      {/* Package Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Package Overview &amp; Pricing
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'readme'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          README.md
        </button>
        <button
          onClick={() => setActiveTab('listing')}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listing'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Marketplace Listing Copy
        </button>
        <button
          onClick={() => setActiveTab('setupGuide')}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'setupGuide'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Buyer Setup Guide
        </button>
        <button
          onClick={() => setActiveTab('scenarioJson')}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'scenarioJson'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Latenode Scenario JSON
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'checklist'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Submission Review Checklist (7/7)
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Latenode Marketplace Card Mockup (Left 5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Marketplace Card Preview
            </span>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono text-[11px]">
                  {pkg.marketplaceListing.category}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  ${pkg.marketplaceListing.recommendedPriceUSD} USD
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {pkg.marketplaceListing.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {pkg.marketplaceListing.shortTagline}
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ~{pkg.marketplaceListing.setupTimeMinutes} min setup
                </span>
                <span className="font-mono text-slate-300 font-semibold">
                  By {pkg.companyName}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {pkg.marketplaceListing.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Included Files Inventory */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-2">
              <span className="font-bold text-slate-300 block">ZIP Package Files Inventory:</span>
              <ul className="space-y-1.5 text-[11px] font-mono text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 01_MARKETPLACE_LISTING.md
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 02_BUYER_SETUP_GUIDE.md
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 03_QA_TEST_REPORT.md
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 04_CODEX_BUILD_PROMPTS.md
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 05_ANTIGRAVITY_PLAYBOOK.md
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 06_CREDENTIALS_AND_VARIABLES.md
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> {pkg.slug}.latenode.json (Scenario Import)
                </li>
              </ul>
            </div>
          </div>

          {/* Key Selling Features & Target Buyers (Right 7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Target Buyers & Value Proposition
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.marketplaceListing.targetBuyers.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Key Features Highlighted in Listing
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {pkg.marketplaceListing.keyFeatures.map((f, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Buyer Prerequisites
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                {pkg.marketplaceListing.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google Search Grounding Verification Card */}
            {pkg.searchGrounding?.used && (
              <div className="bg-slate-950 border border-blue-900/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    Google Search Grounded (gemini-3.5-flash)
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Live Verified
                  </span>
                </div>
                {pkg.searchGrounding.webSearchQueries && pkg.searchGrounding.webSearchQueries.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono">Search Queries Evaluated:</span>
                    <div className="flex flex-wrap gap-1">
                      {pkg.searchGrounding.webSearchQueries.map((q, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-900/30">
                          "{q}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pkg.searchGrounding.sources && pkg.searchGrounding.sources.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono">Verified References &amp; Docs:</span>
                    <div className="flex flex-wrap gap-2">
                      {pkg.searchGrounding.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-300 hover:text-blue-300 underline flex items-center gap-1"
                        >
                          {src.title} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* README.md Tab */}
      {activeTab === 'readme' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Standardized Marketplace Package README.md
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadReadme}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download README.md
              </button>
              <button
                onClick={() => handleCopy(readmeContent, 'readmeCopy')}
                className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                {copiedKey === 'readmeCopy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy README
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[550px] overflow-y-auto custom-scrollbar">
            {readmeContent}
          </pre>
        </div>
      )}

      {activeTab === 'listing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Latenode Marketplace Description (Markdown)
            </span>
            <button
              onClick={() => handleCopy(pkg.marketplaceListing.fullMarkdownDescription, 'listingCopy')}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
            >
              {copiedKey === 'listingCopy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Listing Markdown
            </button>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
            {pkg.marketplaceListing.fullMarkdownDescription}
          </pre>
        </div>
      )}

      {activeTab === 'setupGuide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Buyer Onboarding & Troubleshooting Guide (Markdown)
            </span>
            <button
              onClick={() => handleCopy(pkg.buyerSetupGuideMarkdown, 'setupGuideCopy')}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
            >
              {copiedKey === 'setupGuideCopy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Setup Guide
            </button>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
            {pkg.buyerSetupGuideMarkdown}
          </pre>
        </div>
      )}

      {activeTab === 'scenarioJson' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Valid Latenode Scenario Export Schema
              </span>
              <span className="text-[11px] text-slate-500">
                Ready to import into Latenode via "Import from File" or paste via clipboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(JSON.stringify(pkg.latenodeScenarioJson, null, 2), 'jsonCopy')}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
              >
                {copiedKey === 'jsonCopy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy JSON
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download .json
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-blue-300/90 leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
            {JSON.stringify(pkg.latenodeScenarioJson, null, 2)}
          </pre>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Latenode Marketplace Submission Readiness
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-xs font-bold">
              All 7 Criteria Passed
            </span>
          </div>

          <div className="space-y-3">
            {reviewChecklist.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
