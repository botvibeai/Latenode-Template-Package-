/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  FileCode2,
  FileText,
  ShieldCheck,
  Package,
  Download,
  Terminal,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Boxes,
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { BotVibeTemplatePackage } from './types';
import { INITIAL_TEMPLATE, SAMPLE_RESEARCH_REPORTS } from './data/sampleTemplates';
import { LatenodeCanvas } from './components/LatenodeCanvas';
import { StepByStepBuilder } from './components/StepByStepBuilder';
import { ResearchStudio } from './components/ResearchStudio';
import { StandardizationAudit } from './components/StandardizationAudit';
import { MarketplacePackage } from './components/MarketplacePackage';
import { generateSubmissionZip, downloadBlob } from './utils/packageExporter';

export default function App() {
  const [currentPackage, setCurrentPackage] = useState<BotVibeTemplatePackage>(INITIAL_TEMPLATE);
  const [activeTab, setActiveTab] = useState<'canvas' | 'steps' | 'research' | 'qa' | 'package'>('canvas');
  const [isZipping, setIsZipping] = useState(false);

  // Synchronize browser document title so tabs and window titles are never blank or confusing
  useEffect(() => {
    const title = currentPackage?.templateName
      ? `${currentPackage.templateName} • BotVibe AI - Latenode Template Architect`
      : 'BotVibe AI - Latenode Template Architect';
    document.title = title;
  }, [currentPackage?.templateName]);

  const handleQuickDownloadZip = async () => {
    setIsZipping(true);
    try {
      const blob = await generateSubmissionZip(currentPackage);
      downloadBlob(blob, `${currentPackage.slug}-latenode-submission-package.zip`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Prominent App Identification Ribbon */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs py-1.5 px-4 shadow-sm border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-300 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              APP #1
            </span>
            <span className="font-extrabold tracking-wide uppercase text-[11px] sm:text-xs">
              BotVibe AI • Latenode.com Template Architect &amp; Marketplace Packager
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="hidden md:inline bg-slate-950/15 px-2 py-0.5 rounded">
              Package ID: <strong className="font-bold">{currentPackage.id}</strong>
            </span>
            <span className="hidden sm:inline bg-emerald-950/40 text-emerald-950 px-2 py-0.5 rounded border border-emerald-800/20 font-semibold">
              ✓ Ready for Latenode Marketplace
            </span>
          </div>
        </div>
      </div>

      {/* Top BotVibe AI Executive Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Identity & Clear App Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-black text-xl tracking-tighter shrink-0 ring-2 ring-amber-400/40">
              BV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black tracking-tight text-lg sm:text-xl text-white">
                  BotVibe <span className="text-amber-400">AI</span>
                </h1>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Latenode Template Architect
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Standardized Template Builder, Testing Harness &amp; Marketplace Packager
              </p>
            </div>
          </div>

          {/* Quick Active Template Indicator & Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 hidden sm:inline">Active Template:</span>
              <span className="font-semibold text-amber-300 truncate max-w-[200px] sm:max-w-[260px]">
                {currentPackage.templateName}
              </span>
            </div>

            {/* Actions: Download Complete Package */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('research')}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition hidden sm:flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                New Research
              </button>
              <button
                onClick={handleQuickDownloadZip}
                disabled={isZipping}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Package</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-800/60 custom-scrollbar">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'canvas'
                ? 'border-amber-400 text-amber-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Interactive Canvas & Sticky Notes
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'steps'
                ? 'border-amber-400 text-amber-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Build Steps & Codex / Antigravity Feed
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800">
              {currentPackage.buildSteps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'research'
                ? 'border-amber-400 text-amber-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Research Report Ingestion
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'qa'
                ? 'border-amber-400 text-amber-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Standardization & QA Audit
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'package'
                ? 'border-amber-400 text-amber-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            100% Completed Marketplace Package
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
              Ready
            </span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'canvas' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Latenode.com Visual Architecture</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-normal">
                    {currentPackage.templateName}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Standardized BotVibe layout with color-coded Sticky Notes above every functional node.
                  Click any node to inspect logic, parameters, code, and execute live tests.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('steps')}
                className="self-start sm:self-auto text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                View Sequential Build Steps <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <LatenodeCanvas pkg={currentPackage} onSelectStep={() => setActiveTab('steps')} />
          </div>
        )}

        {activeTab === 'steps' && (
          <StepByStepBuilder pkg={currentPackage} />
        )}

        {activeTab === 'research' && (
          <ResearchStudio
            currentPackage={currentPackage}
            onBlueprintGenerated={newPkg => {
              setCurrentPackage(newPkg);
              setActiveTab('canvas');
            }}
            onNavigateToCanvas={() => setActiveTab('canvas')}
          />
        )}

        {activeTab === 'qa' && (
          <StandardizationAudit pkg={currentPackage} />
        )}

        {activeTab === 'package' && (
          <MarketplacePackage pkg={currentPackage} />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} BotVibe AI • Engineered for high-ticket Latenode.com Marketplace selling.
          </span>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Model: Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Standard: BotVibe Golden Rule</span>
            <span>•</span>
            <span>Export: .json & .zip</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
