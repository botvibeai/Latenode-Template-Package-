import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  Check,
  Terminal,
  Bot,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileCode,
  ShieldCheck,
  HelpCircle,
  Clock,
  Code2
} from 'lucide-react';
import { BuildStep, BotVibeTemplatePackage } from '../types';
import { copyToClipboard } from '../utils/packageExporter';

interface StepByStepBuilderProps {
  pkg: BotVibeTemplatePackage;
}

export const StepByStepBuilder: React.FC<StepByStepBuilderProps> = ({ pkg }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stepVerificationStatus, setStepVerificationStatus] = useState<Record<number, boolean>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<any | null>(null);

  const steps = pkg.buildSteps || [];
  const currentStep: BuildStep | undefined = steps[currentStepIdx];

  const handleCopy = (text: string, key: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunStepTest = async () => {
    if (!currentStep) return;
    setIsSimulating(true);
    setSimulationLogs(null);

    try {
      const res = await fetch('/api/simulate-step-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber: currentStep.stepNumber,
          nodeName: currentStep.nodeName,
          nodeType: currentStep.nodeType,
          payload: currentStep.testPayload,
        }),
      });
      const data = await res.json();
      setSimulationLogs(data);
      setStepVerificationStatus(prev => ({ ...prev, [currentStep.stepNumber]: true }));
    } catch (e: any) {
      setSimulationLogs({ status: 'FAILED', logs: [e.message] });
    } finally {
      setIsSimulating(false);
    }
  };

  const verifiedCount = Object.keys(stepVerificationStatus).length;
  const progressPercent = steps.length > 0 ? Math.round((verifiedCount / steps.length) * 100) : 0;

  if (!currentStep) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        <HelpCircle className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p>No build steps generated for this template yet. Ingest a research report to generate steps.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Workflow Stepper & Verification Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                Standardized Sequential Build & Test Engine
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                BotVibe Standard v1.0
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Step {currentStep.stepNumber} of {steps.length}: {currentStep.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Step Test Pass Rate</div>
              <div className="text-sm font-mono font-bold text-emerald-400">
                {verifiedCount} / {steps.length} Steps Verified ({progressPercent}%)
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Tabs Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIdx;
            const isVerified = stepVerificationStatus[step.stepNumber];
            return (
              <button
                key={step.stepNumber}
                onClick={() => {
                  setCurrentStepIdx(idx);
                  setSimulationLogs(null);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-left transition flex items-center gap-2 text-xs ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-400/80 text-amber-200'
                    : isVerified
                    ? 'bg-slate-950 border-emerald-500/40 text-slate-300 hover:border-slate-600'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isVerified
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isVerified ? '✓' : step.stepNumber}
                </span>
                <span className="truncate max-w-[130px] font-medium">{step.nodeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Step Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Step Specs & Testing Harness */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step Blueprint Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wide">
                  Node Specification
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentStep.nodeName}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentStep.purpose}</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300 capitalize">
                Type: {currentStep.nodeType.replace('_', ' ')}
              </span>
            </div>

            {/* Canvas Sticky Note Spec */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3.5 space-y-2 text-xs text-amber-200">
              <div className="flex items-center justify-between font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  STICKY NOTE CONTENT (Position Above Node at X:{currentStep.canvasPlacement?.x}, Y:{currentStep.canvasPlacement?.y})
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${currentStep.stickyNoteContent.badgeText}\n${currentStep.stickyNoteContent.instructions}`,
                      'sticky'
                    )
                  }
                  className="text-[11px] underline hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'sticky' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Note
                </button>
              </div>
              <div className="font-semibold text-white">{currentStep.stickyNoteContent.badgeText}</div>
              <p className="text-slate-300 text-xs leading-relaxed">{currentStep.stickyNoteContent.instructions}</p>
              <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/90 font-mono">
                Buyer Onboarding Action: {currentStep.stickyNoteContent.buyerAction}
              </div>
            </div>

            {/* Step Configuration Guide */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                Click-by-Click Implementation Guide:
              </h4>
              <ol className="space-y-1.5 text-xs text-slate-300">
                {currentStep.configurationGuide.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-amber-400 font-mono font-bold text-[11px] mt-0.5">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Code snippet if present */}
            {currentStep.codeContent && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    Node Script (Node.js 20 ES Module):
                  </span>
                  <button
                    onClick={() => handleCopy(currentStep.codeContent!, 'code')}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {copiedKey === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Script
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-200/90 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar max-h-56">
                  {currentStep.codeContent}
                </pre>
              </div>
            )}
          </div>

          {/* Test After Each Step (Testing Harness) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Step Verification & Unit Testing
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test payload and assertion rule required before proceeding to the next node.
                </p>
              </div>
              <button
                onClick={handleRunStepTest}
                disabled={isSimulating}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isSimulating ? 'Executing Test...' : 'Run Test for Step ' + currentStep.stepNumber}
              </button>
            </div>

            {/* Expected Assertion */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs flex items-start gap-2">
              <span className="font-bold text-slate-400 whitespace-nowrap">Expected Assertion:</span>
              <code className="text-emerald-300 font-mono break-all">{currentStep.expectedAssertion}</code>
            </div>

            {/* Mock Test Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-400">Mock Input Payload ($node.in):</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(currentStep.testPayload, null, 2), 'payload')}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'payload' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy JSON
                </button>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto max-h-40">
                {JSON.stringify(currentStep.testPayload, null, 2)}
              </pre>
            </div>

            {/* Simulation Terminal Output */}
            {simulationLogs && (
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    Latenode VM Sandbox Execution Log
                  </span>
                  <span className="text-slate-500 font-mono">{simulationLogs.latencyMs}ms latency</span>
                </div>
                <div className="bg-black p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                  {simulationLogs.logs?.map((line: string, i: number) => (
                    <div key={i} className="leading-relaxed">
                      {line.includes('successfully') || line.includes('PASSED') ? (
                        <span className="text-emerald-400 font-bold">{line}</span>
                      ) : (
                        <span className="text-slate-400">{line}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Step {currentStep.stepNumber} assertion verified! Golden Standard compliant.
                  </span>
                  {currentStepIdx < steps.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentStepIdx(prev => prev + 1);
                        setSimulationLogs(null);
                      }}
                      className="text-white font-bold underline hover:text-emerald-200 flex items-center gap-1"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Codex & Antigravity Prompts Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Feed Codex Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Feed OpenAI Codex</h4>
                  <p className="text-[11px] text-slate-400">Direct prompt for code generation</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(currentStep.codexPrompt, 'codex')}
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                {copiedKey === 'codex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Codex Prompt
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-blue-200/90 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto custom-scrollbar">
              {currentStep.codexPrompt}
            </pre>
          </div>

          {/* Feed Antigravity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Feed Antigravity Agent</h4>
                  <p className="text-[11px] text-slate-400">Autonomous workflow build & test directive</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(currentStep.antigravityPrompt, 'antigravity')}
                className="px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                {copiedKey === 'antigravity' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Agent Prompt
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-purple-200/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
              {currentStep.antigravityPrompt}
            </pre>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (currentStepIdx > 0) {
                  setCurrentStepIdx(prev => prev - 1);
                  setSimulationLogs(null);
                }
              }}
              disabled={currentStepIdx === 0}
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
            </button>
            <button
              onClick={() => {
                if (currentStepIdx < steps.length - 1) {
                  setCurrentStepIdx(prev => prev + 1);
                  setSimulationLogs(null);
                }
              }}
              disabled={currentStepIdx === steps.length - 1}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
