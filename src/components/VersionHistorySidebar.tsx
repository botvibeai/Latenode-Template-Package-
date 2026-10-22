import React, { useState, useEffect } from 'react';
import {
  History,
  GitCommit,
  GitBranch,
  RotateCcw,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Eye,
  X,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Boxes,
  Cpu,
  DollarSign,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  FileCode,
  Tag
} from 'lucide-react';
import { BotVibeTemplatePackage, TemplateVersionSnapshot } from '../types';
import { copyToClipboard } from '../utils/packageExporter';

interface VersionHistorySidebarProps {
  pkg: BotVibeTemplatePackage;
  isOpen: boolean;
  onClose: () => void;
  onRevertToVersion: (snapshot: TemplateVersionSnapshot) => void;
  onSaveNewVersion?: (newVersion: TemplateVersionSnapshot) => void;
  activeVersionId?: string;
}

export const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({
  pkg,
  isOpen,
  onClose,
  onRevertToVersion,
  onSaveNewVersion,
  activeVersionId,
}) => {
  const storageKey = `botvibe_versions_${pkg.id || 'current'}`;

  // Initialize versions from localStorage or seed with default snapshots
  const [versions, setVersions] = useState<TemplateVersionSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved versions from localStorage:', e);
    }

    // Seed baseline versions
    const baselineVersion: TemplateVersionSnapshot = {
      id: `ver-${pkg.id || 'tmpl'}-baseline`,
      versionNumber: pkg.version || 'v1.0.0-PROD',
      label: 'Golden Standard Baseline Architecture',
      description: 'Initial architected scenario blueprint with color-coded canvas sticky notes and unit test assertions.',
      createdAt: pkg.createdAt ? `${pkg.createdAt} 12:00` : new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: 'michael@botvibe.ai',
      packageSnapshot: JSON.parse(JSON.stringify(pkg)),
      stats: {
        nodeCount: pkg.nodes?.length || 0,
        stepCount: pkg.buildSteps?.length || 0,
        testCount: pkg.qaTestCases?.length || 0,
        priceUSD: pkg.marketplaceListing?.recommendedPriceUSD || 79,
      },
      changeSummary: ['Initial scenario synthesis', 'Canvas sticky notes defined', 'Golden Standard error handler'],
      isAutoSaved: false,
    };

    return [baselineVersion];
  });

  // Keep localStorage updated when versions change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(versions));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  }, [versions, storageKey]);

  // Modals & form state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newVersionTag, setNewVersionTag] = useState('');
  const [newVersionLabel, setNewVersionLabel] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [newVersionAuthor, setNewVersionAuthor] = useState('michael@botvibe.ai');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Revert confirmation state
  const [revertingSnapshot, setRevertingSnapshot] = useState<TemplateVersionSnapshot | null>(null);

  // Diff inspection modal state
  const [diffSnapshot, setDiffSnapshot] = useState<TemplateVersionSnapshot | null>(null);

  // Copied feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-generate next version tag
  const suggestNextVersion = () => {
    const highestVer = versions[0]?.versionNumber || 'v1.0.0';
    const match = highestVer.match(/v?(\d+)\.(\d+)(?:\.(\d+))?/);
    if (match) {
      const major = match[1];
      const minor = match[2];
      const patch = match[3] !== undefined ? parseInt(match[3], 10) + 1 : 1;
      return `v${major}.${minor}.${patch}`;
    }
    return `v1.0.${versions.length}`;
  };

  const handleOpenSaveModal = () => {
    setNewVersionTag(suggestNextVersion());
    setNewVersionLabel(`Update ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setNewVersionDesc('');
    setSaveError(null);
    setShowSaveModal(true);
  };

  const handleCreateSnapshot = () => {
    if (!newVersionTag.trim()) {
      setSaveError('Version tag (e.g. v1.0.1) is required.');
      return;
    }
    if (!newVersionLabel.trim()) {
      setSaveError('Version title/label is required.');
      return;
    }

    const currentStepCount = pkg.buildSteps?.length || 0;
    const currentNodeCount = pkg.nodes?.length || 0;
    const latestSnapshot = versions[0];
    const prevStepCount = latestSnapshot?.stats?.stepCount || 0;
    const prevNodeCount = latestSnapshot?.stats?.nodeCount || 0;

    const changes: string[] = [];
    if (currentStepCount !== prevStepCount) {
      changes.push(`${currentStepCount > prevStepCount ? '+' : ''}${currentStepCount - prevStepCount} build steps`);
    }
    if (currentNodeCount !== prevNodeCount) {
      changes.push(`${currentNodeCount > prevNodeCount ? '+' : ''}${currentNodeCount - prevNodeCount} nodes`);
    }
    if (pkg.marketplaceListing?.recommendedPriceUSD !== latestSnapshot?.stats?.priceUSD) {
      changes.push(`Price: $${pkg.marketplaceListing?.recommendedPriceUSD}`);
    }
    if (changes.length === 0) {
      changes.push('Step configurations & logic checkpoint');
    }

    const newSnapshot: TemplateVersionSnapshot = {
      id: `ver-${Date.now()}`,
      versionNumber: newVersionTag.trim(),
      label: newVersionLabel.trim(),
      description: newVersionDesc.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: newVersionAuthor.trim() || 'michael@botvibe.ai',
      packageSnapshot: JSON.parse(JSON.stringify(pkg)),
      stats: {
        nodeCount: currentNodeCount,
        stepCount: currentStepCount,
        testCount: pkg.qaTestCases?.length || 0,
        priceUSD: pkg.marketplaceListing?.recommendedPriceUSD || 79,
      },
      changeSummary: changes,
      isAutoSaved: false,
    };

    setVersions(prev => [newSnapshot, ...prev]);
    if (onSaveNewVersion) {
      onSaveNewVersion(newSnapshot);
    }
    setShowSaveModal(false);
  };

  const handleConfirmRevert = () => {
    if (!revertingSnapshot) return;
    onRevertToVersion(revertingSnapshot);
    setRevertingSnapshot(null);
  };

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (versions.length <= 1) {
      alert('Cannot delete the baseline version. At least one version snapshot is required.');
      return;
    }
    setVersions(prev => prev.filter(v => v.id !== id));
  };

  const handleDownloadSnapshotJson = (v: TemplateVersionSnapshot, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(v.packageSnapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${pkg.slug || 'template'}-${v.versionNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySnapshotJson = (v: TemplateVersionSnapshot, e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(JSON.stringify(v.packageSnapshot, null, 2));
    setCopiedKey(v.id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Version History
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {versions.length} Snapshots
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Track and revert template configurations</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Bar: Create Snapshot */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 font-mono">
          Current: <strong className="text-amber-300">{pkg.version || 'v1.0.0'}</strong>
        </span>
        <button
          onClick={handleOpenSaveModal}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Current Version
        </button>
      </div>

      {/* Snapshots Timeline List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {versions.map((ver, idx) => {
          const isActive = ver.id === activeVersionId || (idx === 0 && !activeVersionId);
          return (
            <div
              key={ver.id}
              className={`rounded-xl border p-3.5 transition group relative ${
                isActive
                  ? 'bg-slate-950 border-amber-500/60 ring-1 ring-amber-500/30 shadow-md'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              {/* Version header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                    {ver.versionNumber}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  )}
                  {ver.isAutoSaved && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      Auto
                    </span>
                  )}
                </div>

                {/* Quick actions for snapshot */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => handleCopySnapshotJson(ver, e)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition text-[11px]"
                    title="Copy snapshot JSON"
                  >
                    {copiedKey === ver.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={e => handleDownloadSnapshotJson(ver, e)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Download snapshot JSON"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  {versions.length > 1 && (
                    <button
                      onClick={e => handleDeleteSnapshot(ver.id, e)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Delete version"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-xs font-semibold text-white mb-1">{ver.label}</h4>
              {ver.description && (
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-2">
                  {ver.description}
                </p>
              )}

              {/* Stats badges */}
              <div className="grid grid-cols-4 gap-1.5 py-2 my-2 border-y border-slate-850 text-center text-[10px] font-mono">
                <div className="bg-slate-900 p-1 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Nodes</span>
                  <span className="font-bold text-slate-200">{ver.stats.nodeCount}</span>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Steps</span>
                  <span className="font-bold text-amber-300">{ver.stats.stepCount}</span>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Tests</span>
                  <span className="font-bold text-emerald-400">{ver.stats.testCount}</span>
                </div>
                <div className="bg-slate-900 p-1 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Price</span>
                  <span className="font-bold text-white">${ver.stats.priceUSD}</span>
                </div>
              </div>

              {/* Change tags */}
              {ver.changeSummary && ver.changeSummary.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {ver.changeSummary.map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta row: Author & Date */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-mono">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-600" />
                  {ver.author || 'michael@botvibe.ai'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  {ver.createdAt}
                </span>
              </div>

              {/* Bottom Buttons: Compare & Revert */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                <button
                  onClick={() => setDiffSnapshot(ver)}
                  className="flex-1 py-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition"
                >
                  <Eye className="w-3 h-3 text-slate-400" />
                  Compare Diff
                </button>

                {!isActive && (
                  <button
                    onClick={() => setRevertingSnapshot(ver)}
                    className="flex-1 py-1.5 px-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    Revert to This
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Snapshots are auto-persisted in local storage</span>
        <span className="font-mono text-amber-400">BotVibe v1.0</span>
      </div>

      {/* SAVE NEW VERSION MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Save Current Configuration Version</h3>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Version Tag <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVersionTag}
                    onChange={e => setNewVersionTag(e.target.value)}
                    placeholder="e.g. v1.0.1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newVersionAuthor}
                    onChange={e => setNewVersionAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Version Title / Change Headline <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={newVersionLabel}
                  onChange={e => setNewVersionLabel(e.target.value)}
                  placeholder="e.g. Added UniProt protein node and updated QA assertions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Change Notes (Optional)
                </label>
                <textarea
                  value={newVersionDesc}
                  onChange={e => setNewVersionDesc(e.target.value)}
                  placeholder="Describe the architectural improvements, new credentials, or bug fixes..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 custom-scrollbar"
                />
              </div>

              {saveError && (
                <div className="p-2 bg-red-950/40 border border-red-500/50 rounded text-xs text-red-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  {saveError}
                </div>
              )}

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold block">
                  Capturing Current State:
                </span>
                <div className="text-[11px] text-slate-300 font-mono">
                  • {pkg.nodes?.length || 0} nodes • {pkg.buildSteps?.length || 0} build steps • {pkg.qaTestCases?.length || 0} QA tests • ${pkg.marketplaceListing?.recommendedPriceUSD || 79}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSnapshot}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
                >
                  Save Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVERT CONFIRMATION MODAL */}
      {revertingSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Revert to Previous Configuration?</h3>
                <p className="text-xs text-slate-400">
                  Switching to <strong className="text-amber-300 font-mono">{revertingSnapshot.versionNumber}</strong> ({revertingSnapshot.label})
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2 text-slate-300">
              <p>
                Reverting will replace the current template scenario with this saved snapshot. All canvas nodes, build steps, global variables, and marketplace copy will match that version.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-400 border-t border-slate-800">
                <div>Snapshot Nodes: <span className="text-white font-bold">{revertingSnapshot.stats.nodeCount}</span></div>
                <div>Snapshot Steps: <span className="text-white font-bold">{revertingSnapshot.stats.stepCount}</span></div>
                <div>Target Price: <span className="text-white font-bold">${revertingSnapshot.stats.priceUSD}</span></div>
                <div>Saved On: <span className="text-white font-bold">{revertingSnapshot.createdAt}</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setRevertingSnapshot(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevert}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
              >
                Yes, Revert to {revertingSnapshot.versionNumber}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIFF / COMPARISON INSPECTOR MODAL */}
      {diffSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Comparing <span className="text-amber-400 font-mono">{diffSnapshot.versionNumber}</span> vs Current Template
                </h3>
              </div>
              <button
                onClick={() => setDiffSnapshot(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
              {/* Quick Metrics Comparison Table */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold mb-1">
                    Snapshot: {diffSnapshot.versionNumber}
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>Template: {diffSnapshot.packageSnapshot.templateName}</div>
                    <div>Nodes: {diffSnapshot.stats.nodeCount}</div>
                    <div>Build Steps: {diffSnapshot.stats.stepCount}</div>
                    <div>QA Tests: {diffSnapshot.stats.testCount}</div>
                    <div>Market Price: ${diffSnapshot.stats.priceUSD}</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold mb-1">
                    Current Active State: {pkg.version || 'v1.0.0'}
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>Template: {pkg.templateName}</div>
                    <div>Nodes: {pkg.nodes?.length || 0}</div>
                    <div>Build Steps: {pkg.buildSteps?.length || 0}</div>
                    <div>QA Tests: {pkg.qaTestCases?.length || 0}</div>
                    <div>Market Price: ${pkg.marketplaceListing?.recommendedPriceUSD || 79}</div>
                  </div>
                </div>
              </div>

              {/* Step By Step Comparison */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  Sequential Steps Breakdown:
                </h4>
                <div className="space-y-2 text-xs">
                  {diffSnapshot.packageSnapshot.buildSteps.map((step, idx) => {
                    const currentMatchingStep = pkg.buildSteps?.find(s => s.stepNumber === step.stepNumber);
                    const isIdentical = currentMatchingStep && currentMatchingStep.nodeName === step.nodeName && currentMatchingStep.purpose === step.purpose;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs ${
                          isIdentical
                            ? 'bg-slate-950 border-slate-800/80 text-slate-300'
                            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                          <span className="font-bold">
                            Step {step.stepNumber}: {step.nodeName} ({step.nodeType})
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${isIdentical ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-300'}`}>
                            {isIdentical ? 'Identical' : 'Modified'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{step.purpose}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sticky Notes & Global Variables */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-blue-400" />
                  Variables &amp; Credentials:
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1 font-mono text-[11px] text-slate-300">
                  {diffSnapshot.packageSnapshot.globalVariables?.map((v, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-amber-300">{v.key}</span>
                      <span className="text-slate-500">{v.defaultValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
              <button
                onClick={() => setDiffSnapshot(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Close Comparison
              </button>
              <button
                onClick={() => {
                  setRevertingSnapshot(diffSnapshot);
                  setDiffSnapshot(null);
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Revert to {diffSnapshot.versionNumber}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
