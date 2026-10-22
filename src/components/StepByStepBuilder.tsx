import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Code2,
  History,
  RotateCcw,
  Edit3,
  Save,
  Plus,
  GitBranch,
  X,
  HardDrive,
  RefreshCw,
  Zap,
  Trash2
} from 'lucide-react';
import { BuildStep, BotVibeTemplatePackage, TemplateVersionSnapshot, BuildStepsAutoSaveState } from '../types';
import { copyToClipboard } from '../utils/packageExporter';
import { VersionHistorySidebar } from './VersionHistorySidebar';

interface StepByStepBuilderProps {
  pkg: BotVibeTemplatePackage;
  onUpdatePackage?: (newPkg: BotVibeTemplatePackage) => void;
}

export const StepByStepBuilder: React.FC<StepByStepBuilderProps> = ({ pkg, onUpdatePackage }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stepVerificationStatus, setStepVerificationStatus] = useState<Record<number, boolean>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<any | null>(null);

  // Version History state
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [activeVersionTag, setActiveVersionTag] = useState<string>(pkg.version || 'v1.0.0-PROD');
  const [statusNotification, setStatusNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Auto-Save State (persists to localStorage every 30 seconds)
  const autoSaveStorageKey = `botvibe_build_steps_autosave_${pkg.id || 'default'}`;
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(() => {
    try {
      const existing = localStorage.getItem(autoSaveStorageKey);
      if (existing) {
        const parsed: BuildStepsAutoSaveState = JSON.parse(existing);
        return parsed.savedAtFormatted || null;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [secondsUntilNextSave, setSecondsUntilNextSave] = useState(30);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [autoSaveCount, setAutoSaveCount] = useState(0);
  const [detectedDraft, setDetectedDraft] = useState<BuildStepsAutoSaveState | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Reference for interval access to latest state
  const stateRef = useRef({
    pkg,
    currentStepIdx,
    stepVerificationStatus,
    activeVersionTag,
    isAutoSaveEnabled,
  });

  useEffect(() => {
    stateRef.current = {
      pkg,
      currentStepIdx,
      stepVerificationStatus,
      activeVersionTag,
      isAutoSaveEnabled,
    };
  }, [pkg, currentStepIdx, stepVerificationStatus, activeVersionTag, isAutoSaveEnabled]);

  // Check on mount for existing auto-saved draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(autoSaveStorageKey);
      if (saved) {
        const parsed: BuildStepsAutoSaveState = JSON.parse(saved);
        if (parsed && parsed.pkg && parsed.savedAtFormatted) {
          const hasDifferentSteps = JSON.stringify(parsed.pkg.buildSteps) !== JSON.stringify(pkg.buildSteps);
          const hasVerifiedSteps = parsed.stepVerificationStatus && Object.keys(parsed.stepVerificationStatus).length > 0;
          const hasAdvancedIndex = parsed.currentStepIdx > 0;
          if (hasDifferentSteps || hasVerifiedSteps || hasAdvancedIndex) {
            setDetectedDraft(parsed);
            setShowDraftBanner(true);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse auto-save draft from localStorage:', e);
    }
  }, [autoSaveStorageKey, pkg.buildSteps]);

  // Perform save to localStorage
  const performAutoSave = useCallback((manual: boolean = false) => {
    const currentState = stateRef.current;
    if (!currentState.isAutoSaveEnabled && !manual) return;

    try {
      setAutoSaveStatus('saving');
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const autoSavePayload: BuildStepsAutoSaveState = {
        timestamp: now.toISOString(),
        savedAtFormatted: formattedTime,
        pkg: currentState.pkg,
        currentStepIdx: currentState.currentStepIdx,
        stepVerificationStatus: currentState.stepVerificationStatus,
        activeVersionTag: currentState.activeVersionTag,
        autoSavedCount: autoSaveCount + 1,
      };

      localStorage.setItem(autoSaveStorageKey, JSON.stringify(autoSavePayload));
      setLastAutoSavedAt(formattedTime);
      setAutoSaveCount(prev => prev + 1);
      setSecondsUntilNextSave(30);
      setAutoSaveStatus('saved');

      if (manual) {
        setStatusNotification({
          type: 'success',
          message: `Build Steps state saved to localStorage at ${formattedTime}!`,
        });
        setTimeout(() => setStatusNotification(null), 3500);
      }

      setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 1500);
    } catch (e) {
      console.error('Failed to auto-save to localStorage:', e);
      setAutoSaveStatus('idle');
    }
  }, [autoSaveStorageKey, autoSaveCount]);

  // 30-second interval timer for auto-save
  useEffect(() => {
    if (!isAutoSaveEnabled) return;

    const timer = setInterval(() => {
      setSecondsUntilNextSave(prev => {
        if (prev <= 1) {
          performAutoSave(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoSaveEnabled, performAutoSave]);

  // Restore auto-saved draft
  const handleRestoreDraft = () => {
    if (!detectedDraft) return;
    if (onUpdatePackage && detectedDraft.pkg) {
      onUpdatePackage(detectedDraft.pkg);
    }
    if (typeof detectedDraft.currentStepIdx === 'number') {
      setCurrentStepIdx(detectedDraft.currentStepIdx);
    }
    if (detectedDraft.stepVerificationStatus) {
      setStepVerificationStatus(detectedDraft.stepVerificationStatus);
    }
    if (detectedDraft.activeVersionTag) {
      setActiveVersionTag(detectedDraft.activeVersionTag);
    }
    setShowDraftBanner(false);
    setStatusNotification({
      type: 'success',
      message: `Restored auto-saved draft from ${detectedDraft.savedAtFormatted} (Step ${
        (detectedDraft.currentStepIdx || 0) + 1
      }, ${Object.keys(detectedDraft.stepVerificationStatus || {}).length} verified steps).`,
    });
    setTimeout(() => setStatusNotification(null), 5000);
  };

  const handleDismissDraft = () => {
    setShowDraftBanner(false);
  };

  const handleClearAutoSave = () => {
    try {
      localStorage.removeItem(autoSaveStorageKey);
      setDetectedDraft(null);
      setShowDraftBanner(false);
      setLastAutoSavedAt(null);
      setStatusNotification({
        type: 'info',
        message: 'Auto-save storage cache cleared for this template.',
      });
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (e) {
      console.warn('Could not clear auto-save from localStorage:', e);
    }
  };

  // Step Edit Modal State
  const [isEditingCurrentStep, setIsEditingCurrentStep] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPurpose, setEditPurpose] = useState('');
  const [editExpectedAssertion, setEditExpectedAssertion] = useState('');
  const [editCodeContent, setEditCodeContent] = useState('');
  const [editPayloadJson, setEditPayloadJson] = useState('');
  const [editStickyBadge, setEditStickyBadge] = useState('');
  const [editStickyInstructions, setEditStickyInstructions] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const steps = pkg?.buildSteps || [];
  const safeIdx = Math.min(Math.max(0, currentStepIdx), Math.max(0, steps.length - 1));
  const currentStep: BuildStep | undefined = steps[safeIdx] || steps[0];

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

  // Revert template to a previous version snapshot
  const handleRevertToVersion = (snapshot: TemplateVersionSnapshot) => {
    if (onUpdatePackage) {
      onUpdatePackage(snapshot.packageSnapshot);
    }
    setActiveVersionTag(snapshot.versionNumber);
    setStatusNotification({
      type: 'success',
      message: `Template successfully restored to version ${snapshot.versionNumber}: "${snapshot.label}"`,
    });
    setCurrentStepIdx(0);
    setSimulationLogs(null);
    setTimeout(() => setStatusNotification(null), 5000);
  };

  // Start editing the active step
  const handleStartEditStep = () => {
    if (!currentStep) return;
    setEditTitle(currentStep.title);
    setEditPurpose(currentStep.purpose);
    setEditExpectedAssertion(currentStep.expectedAssertion || '');
    setEditCodeContent(currentStep.codeContent || '');
    setEditPayloadJson(JSON.stringify(currentStep.testPayload || {}, null, 2));
    setEditStickyBadge(currentStep.stickyNoteContent?.badgeText || '');
    setEditStickyInstructions(currentStep.stickyNoteContent?.instructions || '');
    setEditError(null);
    setIsEditingCurrentStep(true);
  };

  // Save changes to active step and optionally update parent package
  const handleSaveStepChanges = () => {
    if (!currentStep) return;

    let parsedPayload = currentStep.testPayload;
    if (editPayloadJson.trim()) {
      try {
        parsedPayload = JSON.parse(editPayloadJson);
      } catch (e: any) {
        setEditError('Invalid JSON in mock payload: ' + e.message);
        return;
      }
    }

    const updatedStep: BuildStep = {
      ...currentStep,
      title: editTitle.trim() || currentStep.title,
      purpose: editPurpose.trim() || currentStep.purpose,
      expectedAssertion: editExpectedAssertion.trim() || currentStep.expectedAssertion,
      codeContent: editCodeContent || undefined,
      testPayload: parsedPayload,
      stickyNoteContent: {
        ...currentStep.stickyNoteContent,
        badgeText: editStickyBadge.trim() || currentStep.stickyNoteContent?.badgeText || '',
        instructions: editStickyInstructions.trim() || currentStep.stickyNoteContent?.instructions || '',
      },
    };

    const newSteps = steps.map((s, idx) => (idx === currentStepIdx ? updatedStep : s));
    const updatedPackage: BotVibeTemplatePackage = {
      ...pkg,
      buildSteps: newSteps,
    };

    if (onUpdatePackage) {
      onUpdatePackage(updatedPackage);
    }

    // Instantly persist updated step state to localStorage via auto-save
    setTimeout(() => performAutoSave(false), 50);

    setIsEditingCurrentStep(false);
    setStatusNotification({
      type: 'info',
      message: `Updated Step ${currentStep.stepNumber}. Changes auto-saved to localStorage!`,
    });
    setTimeout(() => setStatusNotification(null), 5000);
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
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {statusNotification && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/60 shadow-xl flex items-center justify-between text-xs text-amber-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-amber-400 hover:text-white text-xs font-mono ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Auto-Save Draft Detected Recovery Banner */}
      {showDraftBanner && detectedDraft && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/80 border border-amber-500/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-100 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Auto-Saved Session Recovered</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {detectedDraft.savedAtFormatted}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  localStorage
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                Found auto-saved progress on Step {(detectedDraft.currentStepIdx || 0) + 1} with{' '}
                {Object.keys(detectedDraft.stepVerificationStatus || {}).length} verified step assertions. Restore now to prevent any data loss.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              title="Restore auto-saved progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore Auto-Save
            </button>
            <button
              onClick={handleDismissDraft}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              title="Keep current without restoring"
            >
              Dismiss
            </button>
            <button
              onClick={handleClearAutoSave}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
              title="Delete auto-save storage cache"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Workflow Stepper & Verification Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                Standardized Sequential Build &amp; Test Engine
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Active: {activeVersionTag}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Step {currentStep.stepNumber} of {steps.length}: {currentStep.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto-Save Status Control Pill (30s interval + manual save + status indicator) */}
            <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800/90 rounded-lg px-2.5 py-1.5 text-xs shadow-inner">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      autoSaveStatus === 'saving'
                        ? 'bg-amber-400'
                        : isAutoSaveEnabled
                        ? 'bg-emerald-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      autoSaveStatus === 'saving'
                        ? 'bg-amber-400'
                        : isAutoSaveEnabled
                        ? 'bg-emerald-500'
                        : 'bg-slate-600'
                    }`}
                  />
                </span>

                <HardDrive className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="font-semibold text-slate-200">
                    {autoSaveStatus === 'saving' ? (
                      <span className="text-amber-300 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                      </span>
                    ) : autoSaveStatus === 'saved' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Auto-Saved
                      </span>
                    ) : (
                      <span>Auto-Save (30s)</span>
                    )}
                  </span>

                  {lastAutoSavedAt && (
                    <span className="text-slate-400 text-[10px] hidden sm:inline" title="Last auto-saved timestamp">
                      • {lastAutoSavedAt}
                    </span>
                  )}

                  {isAutoSaveEnabled && autoSaveStatus === 'idle' && (
                    <span className="text-amber-400/80 text-[10px] hidden md:inline" title="Seconds until next auto-save">
                      ({secondsUntilNextSave}s)
                    </span>
                  )}
                </div>
              </div>

              {/* Force Instant Save Button */}
              <button
                onClick={() => performAutoSave(true)}
                disabled={autoSaveStatus === 'saving'}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition"
                title="Force instant save to localStorage now"
              >
                <Save className="w-3.5 h-3.5" />
              </button>

              {/* Auto-Save Active Toggle */}
              <button
                onClick={() => setIsAutoSaveEnabled(prev => !prev)}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition ${
                  isAutoSaveEnabled
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/60'
                    : 'border-slate-700 text-slate-500 bg-slate-900 hover:bg-slate-850'
                }`}
                title={
                  isAutoSaveEnabled
                    ? 'Auto-save is actively persisting to localStorage every 30 seconds (click to pause)'
                    : 'Auto-save is paused (click to activate)'
                }
              >
                {isAutoSaveEnabled ? 'ON' : 'PAUSED'}
              </button>
            </div>

            {/* Version History Toggle Button */}
            <button
              onClick={() => setIsHistorySidebarOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition shadow"
              title="Open Template Version History Sidebar"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Version History</span>
            </button>

            {/* Step Verification Status */}
            <div className="text-right hidden xl:block">
              <div className="text-xs text-slate-400">Step Test Pass Rate</div>
              <div className="text-sm font-mono font-bold text-emerald-400">
                {verifiedCount} / {steps.length} Steps Verified ({progressPercent}%)
              </div>
            </div>
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden hidden xl:block">
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
                    ? 'bg-amber-950/40 border-amber-400/80 text-amber-200 shadow-sm'
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartEditStep}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition"
                  title="Edit step configuration & payload"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" />
                  Edit Step
                </button>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300 capitalize">
                  {currentStep.nodeType.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Canvas Sticky Note Spec */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3.5 space-y-2 text-xs text-amber-200">
              <div className="flex items-center justify-between font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  STICKY NOTE CONTENT (Position Above Node at X:{currentStep.canvasPlacement?.x ?? 100}, Y:{currentStep.canvasPlacement?.y ?? 220})
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${currentStep.stickyNoteContent?.badgeText || ''}\n${currentStep.stickyNoteContent?.instructions || ''}`,
                      'sticky'
                    )
                  }
                  className="text-[11px] underline hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'sticky' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Note
                </button>
              </div>
              <div className="font-semibold text-white">{currentStep.stickyNoteContent?.badgeText || `STEP ${currentStep.stepNumber}`}</div>
              <p className="text-slate-300 text-xs leading-relaxed">{currentStep.stickyNoteContent?.instructions || currentStep.purpose || ''}</p>
              <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/90 font-mono">
                Buyer Onboarding Action: {currentStep.stickyNoteContent?.buyerAction || 'Configure node parameters.'}
              </div>
            </div>

            {/* Step Configuration Guide */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                Click-by-Click Implementation Guide:
              </h4>
              <ol className="space-y-1.5 text-xs text-slate-300">
                {(currentStep.configurationGuide || []).map((item, i) => (
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
                  Step Verification &amp; Unit Testing
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
                  <p className="text-[11px] text-slate-400">Autonomous workflow build &amp; test directive</p>
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

      {/* EDIT STEP CONFIGURATION MODAL */}
      {isEditingCurrentStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Edit Step {currentStep.stepNumber}: {currentStep.nodeName}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingCurrentStep(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Step Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Purpose / Specification</label>
                <textarea
                  value={editPurpose}
                  onChange={e => setEditPurpose(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sticky Note Badge Title</label>
                <input
                  type="text"
                  value={editStickyBadge}
                  onChange={e => setEditStickyBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sticky Note Instructions</label>
                <textarea
                  value={editStickyInstructions}
                  onChange={e => setEditStickyInstructions(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Expected Test Assertion</label>
                <input
                  type="text"
                  value={editExpectedAssertion}
                  onChange={e => setEditExpectedAssertion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mock Payload JSON ($node.in)</label>
                <textarea
                  value={editPayloadJson}
                  onChange={e => setEditPayloadJson(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-blue-300 font-mono focus:outline-none focus:border-amber-400 custom-scrollbar"
                />
              </div>

              {currentStep.codeContent !== undefined && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Node.js Script Content</label>
                  <textarea
                    value={editCodeContent}
                    onChange={e => setEditCodeContent(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-400 custom-scrollbar"
                  />
                </div>
              )}

              {editError && (
                <div className="p-2 bg-red-950/40 border border-red-500/50 rounded text-xs text-red-200">
                  {editError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setIsEditingCurrentStep(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStepChanges}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY SIDEBAR DRAWER */}
      <VersionHistorySidebar
        pkg={pkg}
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        onRevertToVersion={handleRevertToVersion}
        activeVersionId={undefined}
      />
    </div>
  );
};
