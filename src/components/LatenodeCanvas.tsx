import React, { useState } from 'react';
import {
  Webhook,
  Code2,
  Globe,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Layers,
  HelpCircle,
  Play,
  Key,
  Database,
  Copy,
  Check,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { LatenodeNode, LatenodeConnection, BotVibeTemplatePackage } from '../types';
import { copyToClipboard } from '../utils/packageExporter';

interface LatenodeCanvasProps {
  pkg: BotVibeTemplatePackage;
  onSelectStep?: (stepNumber: number) => void;
}

export const LatenodeCanvas: React.FC<LatenodeCanvasProps> = ({ pkg, onSelectStep }) => {
  const [selectedNode, setSelectedNode] = useState<LatenodeNode | null>(pkg.nodes[0] || null);
  const [activeTab, setActiveTab] = useState<'sticky' | 'code' | 'sample' | 'test'>('sticky');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [testOutput, setTestOutput] = useState<any | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return <Webhook className="w-5 h-5 text-blue-400" />;
      case 'javascript':
      case 'python':
        return <Code2 className="w-5 h-5 text-amber-400" />;
      case 'headless_browser':
        return <Globe className="w-5 h-5 text-purple-400" />;
      case 'ai_prompt':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'http_request':
        return <Send className="w-5 h-5 text-rose-400" />;
      case 'webhook_response':
        return <CheckCircle2 className="w-5 h-5 text-sky-400" />;
      case 'error_handler':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStickyColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-950/70 border-blue-500/50 text-blue-200 shadow-blue-950/40';
      case 'amber':
        return 'bg-amber-950/70 border-amber-500/50 text-amber-200 shadow-amber-950/40';
      case 'purple':
        return 'bg-purple-950/70 border-purple-500/50 text-purple-200 shadow-purple-950/40';
      case 'emerald':
        return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200 shadow-emerald-950/40';
      case 'rose':
        return 'bg-rose-950/70 border-rose-500/50 text-rose-200 shadow-rose-950/40';
      case 'slate':
      default:
        return 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-black/40';
    }
  };

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSimulatedTest = async (node: LatenodeNode) => {
    setIsTesting(true);
    setTestOutput(null);
    try {
      const res = await fetch('/api/simulate-step-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber: pkg.nodes.indexOf(node) + 1,
          nodeName: node.name,
          nodeType: node.type,
          payload: node.sampleInput,
        }),
      });
      const data = await res.json();
      setTestOutput(data);
    } catch (e: any) {
      setTestOutput({ status: 'FAILED', error: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  // Find canvas bounds
  const maxX = Math.max(...pkg.nodes.map(n => n.position.x), 1600) + 380;
  const maxY = Math.max(...pkg.nodes.map(n => n.position.y), 500) + 260;

  return (
    <div className="flex flex-col lg:flex-row h-[780px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Top Banner with BotVibe Standard Info */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs">
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide uppercase text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          BotVibe AI Standard Canvas
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">
          Nodes: <strong className="text-white font-mono">{pkg.nodes.length}</strong>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-medium">Sticky Notes Active (100% Documented)</span>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 relative overflow-auto bg-grid-pattern p-6 custom-scrollbar">
        {/* Canvas Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-slate-900/95 border border-slate-800 rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.4))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-2">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.6))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div
          className="relative transition-transform duration-150 origin-top-left"
          style={{
            width: `${maxX}px`,
            height: `${maxY}px`,
            transform: `scale(${zoom})`,
          }}
        >
          {/* Connection Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="conn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="error-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.9" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
              </marker>
              <marker id="error-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
              </marker>
            </defs>

            {pkg.connections.map(conn => {
              const from = pkg.nodes.find(n => n.id === conn.fromNodeId);
              const to = pkg.nodes.find(n => n.id === conn.toNodeId);
              if (!from || !to) return null;

              const isError = conn.fromPort === 'error' || to.type === 'error_handler';
              const x1 = from.position.x + 240;
              const y1 = from.position.y + 44;
              const x2 = to.position.x;
              const y2 = to.position.y + 44;

              const dx = Math.abs(x2 - x1) * 0.5;
              const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g key={conn.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={isError ? 'url(#error-gradient)' : 'url(#conn-gradient)'}
                    strokeWidth={isError ? '2.5' : '3'}
                    strokeDasharray={isError ? '6 4' : undefined}
                    markerEnd={isError ? 'url(#error-arrow)' : 'url(#arrow)'}
                    className="transition-all duration-300"
                  />
                  {/* Glowing pulse circle on normal connections */}
                  {!isError && (
                    <circle r="3" fill="#38bdf8">
                      <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Nodes + Sticky Notes */}
          {pkg.nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                className="absolute z-10 select-none"
                style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
              >
                {/* 1. INSTRUCTIONAL STICKY NOTE (FLOATING ABOVE NODE) */}
                <div
                  className={`w-[250px] mb-3 p-3 rounded-lg border text-xs shadow-lg backdrop-blur-md transition-all ${getStickyColor(
                    node.stickyNote.color
                  )} ${isSelected ? 'ring-2 ring-amber-400/80 scale-[1.02]' : 'opacity-90 hover:opacity-100'}`}
                >
                  <div className="flex items-center justify-between font-bold tracking-tight pb-1.5 border-b border-white/10">
                    <span className="truncate">{node.stickyNote.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 font-mono">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed opacity-95">
                    {node.stickyNote.instructions}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 font-mono text-white/80">
                      <Key className="w-3 h-3" />
                      {node.stickyNote.requiredCredentials[0] || 'No Key Needed'}
                    </span>
                    <span className="font-semibold underline cursor-pointer" onClick={() => setSelectedNode(node)}>
                      View Specs
                    </span>
                  </div>
                </div>

                {/* Connecting Pin between Sticky Note and Node */}
                <div className="w-0.5 h-3 bg-slate-700 mx-auto -mt-3 mb-1" />

                {/* 2. LATENODE FUNCTIONAL NODE CARD */}
                <div
                  onClick={() => {
                    setSelectedNode(node);
                    setTestOutput(null);
                  }}
                  className={`w-[250px] rounded-xl bg-slate-900/95 border transition-all cursor-pointer shadow-xl ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-amber-500/10 -translate-y-0.5'
                      : 'border-slate-700 hover:border-slate-500 hover:shadow-2xl'
                  }`}
                >
                  {/* Node Header */}
                  <div className="p-3.5 flex items-center gap-3 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700">
                      {getNodeIcon(node.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 truncate">
                        {node.name}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {node.title}
                      </div>
                    </div>
                  </div>

                  {/* Node Body / Preview info */}
                  <div className="px-3.5 py-2.5 text-[11px] text-slate-300 flex items-center justify-between bg-slate-950/40">
                    <span className="capitalize font-mono text-slate-400 text-[10px]">{node.type.replace('_', ' ')}</span>
                    {node.codeSnippet && (
                      <span className="text-[10px] text-amber-400/90 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-900/50 font-mono">
                        Script
                      </span>
                    )}
                    {node.type === 'ai_prompt' && (
                      <span className="text-[10px] text-emerald-400/90 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/50 font-mono">
                        Gemini 3.8
                      </span>
                    )}
                  </div>

                  {/* Ports / Pins */}
                  <div className="relative px-3 py-1 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 border border-blue-300 inline-block" />
                      <span>in</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>out</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-300 inline-block" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Drawer: Node Inspector & Step Sandbox */}
      <div className="w-full lg:w-[420px] bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full z-30">
        {selectedNode ? (
          <>
            {/* Inspector Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white truncate max-w-[240px]">
                    {selectedNode.title}
                  </h3>
                  <p className="text-[11px] font-mono text-amber-400">
                    {selectedNode.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(selectedNode, null, 2), selectedNode.id)}
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition"
                title="Copy Node JSON"
              >
                {copiedId === selectedNode.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Inspector Tabs */}
            <div className="flex border-b border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('sticky')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${
                  activeTab === 'sticky'
                    ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sticky Note
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${
                  activeTab === 'code'
                    ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Logic / Code
              </button>
              <button
                onClick={() => setActiveTab('sample')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${
                  activeTab === 'sample'
                    ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                I/O Schema
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${
                  activeTab === 'test'
                    ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Node Test
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeTab === 'sticky' && (
                <div className="space-y-3.5">
                  <div className={`p-3.5 rounded-lg border ${getStickyColor(selectedNode.stickyNote.color)}`}>
                    <div className="font-bold text-xs flex items-center gap-1.5 pb-1 mb-2 border-b border-white/10">
                      <Sparkles className="w-3.5 h-3.5" />
                      {selectedNode.stickyNote.title}
                    </div>
                    <p className="text-xs leading-relaxed opacity-95">
                      {selectedNode.stickyNote.instructions}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <span className="font-semibold text-slate-300 block text-[11px]">
                      Required Credentials for Buyer:
                    </span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-1 font-mono">
                      {selectedNode.stickyNote.requiredCredentials.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-slate-300 block text-[11px]">
                      Input Dependencies:
                    </span>
                    <p className="text-slate-400 font-mono text-[11px]">
                      {selectedNode.stickyNote.inputSchemaNotes}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-slate-300 block text-[11px]">
                      Output Contract:
                    </span>
                    <p className="text-slate-400 font-mono text-[11px]">
                      {selectedNode.stickyNote.outputContract}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-emerald-400 block text-[11px]">
                      Testing & Verification Rule:
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      {selectedNode.stickyNote.testRule}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-3">
                  {selectedNode.codeSnippet ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-slate-400 text-[11px]">
                          Runtime: Node.js 20 ES Module
                        </span>
                        <button
                          onClick={() => handleCopy(selectedNode.codeSnippet!, 'snippet')}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Code
                        </button>
                      </div>
                      <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-amber-200/90 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar">
                        {selectedNode.codeSnippet}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center text-slate-400 space-y-2">
                      <FileCode className="w-6 h-6 mx-auto text-slate-600" />
                      <p>This node is configured via standard UI parameters.</p>
                      <pre className="p-2.5 bg-slate-900 text-left font-mono text-[10px] text-slate-300 rounded overflow-x-auto">
                        {JSON.stringify(selectedNode.config, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sample' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1 text-[11px]">
                      Sample Input ($node.in):
                    </span>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-blue-300 overflow-x-auto">
                      {JSON.stringify(selectedNode.sampleInput, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1 text-[11px]">
                      Sample Output ($node.out):
                    </span>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto">
                      {JSON.stringify(selectedNode.sampleOutput, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'test' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                    <p className="text-slate-300 text-[11px]">
                      Simulate live execution of this node within Latenode container to verify data contracts.
                    </p>
                    <button
                      onClick={() => handleRunSimulatedTest(selectedNode)}
                      disabled={isTesting}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-md flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {isTesting ? 'Executing Node...' : 'Run Node Test (Simulate)'}
                    </button>
                  </div>

                  {testOutput && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Test Result: {testOutput.status}
                        </span>
                        <span className="text-slate-400 font-mono">{testOutput.latencyMs}ms</span>
                      </div>

                      <div className="bg-black p-3 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1 text-slate-300">
                        {testOutput.logs?.map((log: string, i: number) => (
                          <div key={i} className="text-slate-400">{log}</div>
                        ))}
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px]">
                        <span className="text-slate-500 block mb-1">Captured Output:</span>
                        <pre className="text-emerald-300 overflow-x-auto">
                          {JSON.stringify(testOutput.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <HelpCircle className="w-8 h-8 mb-2 text-slate-700" />
            <p className="text-xs">Click any node or sticky note on the canvas to inspect its configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
};
