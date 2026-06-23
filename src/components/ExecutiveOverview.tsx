import React, { useEffect, useState } from 'react';
import { Shield, Database, Link, Server, RefreshCw, Radio, Play, Pause, Activity } from 'lucide-react';

interface ExecutiveOverviewProps {
  identityRisk: number;
  cloudRisk: number;
  apiRisk: number;
  setActiveTab: (tab: string) => void;
  logs: string[];
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  identityRisk,
  cloudRisk,
  apiRisk,
  setActiveTab,
  logs,
}) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [liveStreamActive, setLiveStreamActive] = useState(true);

  // Take the latest logs and display them
  useEffect(() => {
    setDisplayedLogs(logs.slice(-20));
  }, [logs]);

  const triggerManualScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const hasVulnerabilities = identityRisk > 0 || cloudRisk > 0 || apiRisk > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Inline styles for custom SVG threat map animation */}
      <style>{`
        @keyframes dashflow {
          to {
            stroke-dashoffset: -30;
          }
        }
        .attack-line {
          stroke-dasharray: 6, 6;
          animation: dashflow 1.5s linear infinite;
        }
        .pulse-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Top Welcome / Metric Alert */}
      <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-7 h-7 text-emerald-500" />
              Executive Security Posture Overview
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm">
              Unified ESPM interface monitoring and remediating architectural failures. Resolve critical misconfigurations across identity gateways, public databases, and vulnerable API routing.
            </p>
          </div>
          <button
            onClick={triggerManualScan}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 border transition-all ${
              isScanning
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning Perimeter...' : 'Trigger System Check'}
          </button>
        </div>
      </div>

      {/* Live Cyber Threat Map Panel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Global Threat Visualizer Stream</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-2xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${hasVulnerabilities ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span>Gateway Status: {hasVulnerabilities ? 'EXPOSURES DETECTED' : 'HARDENED'}</span>
            </div>
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className="px-2.5 py-1 rounded text-2xs font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-300 flex items-center gap-1"
            >
              {liveStreamActive ? (
                <>
                  <Pause className="w-3 h-3 text-amber-400" /> Pause Feed
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-400" /> Play Feed
                </>
              )}
            </button>
          </div>
        </div>

        {/* SVG World Map Threat Visualization */}
        <div className="w-full relative h-[320px] bg-slate-950 border border-slate-900/60 rounded-xl overflow-hidden flex items-center justify-center">
          
          <svg className="w-full h-full min-w-[700px]" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
            {/* Grid background lines */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Mesh representation of continents */}
            {/* North America */}
            <path d="M 120,60 L 220,70 L 260,110 L 240,150 L 160,160 L 120,110 Z" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="1" />
            {/* South America */}
            <path d="M 220,180 L 270,210 L 290,270 L 250,300 L 210,240 Z" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="1" />
            {/* Europe */}
            <path d="M 420,70 L 490,60 L 510,110 L 460,140 L 410,110 Z" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="1" />
            {/* Africa */}
            <path d="M 420,160 L 480,170 L 520,240 L 490,290 L 440,230 Z" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="1" />
            {/* Asia & Russia */}
            <path d="M 520,50 L 720,40 L 780,100 L 730,220 L 590,200 L 540,130 Z" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="1" />
            
            {/* Security Gateway Target Nodes (USA HQ) */}
            <g transform="translate(200, 110)">
              <circle r="14" fill="rgba(16, 185, 129, 0.1)" />
              <circle r="8" fill="rgba(16, 185, 129, 0.2)" />
              <circle r="4" fill="#10b981" />
              {hasVulnerabilities && <circle r="12" fill="none" stroke="#ef4444" strokeWidth="1" className="pulse-ping" />}
            </g>
            <text x="180" y="90" fill="#cbd5e1" fontSize="10" fontWeight="bold" fontFamily="monospace">PRIMARY_GATEWAY (USA)</text>

            {/* Threat Source Attacker Nodes (Only animate lines and dots if liveStreamActive is true) */}
            {liveStreamActive && (
              <>
                {/* Attacker 1: Russia */}
                <g transform="translate(620, 80)">
                  <circle r="5" fill="#f43f5e" />
                  <circle r="10" fill="none" stroke="#f43f5e" strokeWidth="0.5" className="pulse-ping" />
                  <text x="630" y="85" fill="#f43f5e" fontSize="8" fontFamily="monospace">SRC_NODE_RU</text>
                </g>
                {/* Attacker 2: East Asia */}
                <g transform="translate(710, 150)">
                  <circle r="5" fill="#f43f5e" />
                  <circle r="10" fill="none" stroke="#f43f5e" strokeWidth="0.5" className="pulse-ping" />
                  <text x="720" y="155" fill="#f43f5e" fontSize="8" fontFamily="monospace">SRC_NODE_CN</text>
                </g>
                {/* Attacker 3: South America */}
                <g transform="translate(260, 240)">
                  <circle r="5" fill="#f43f5e" />
                  <circle r="10" fill="none" stroke="#f43f5e" strokeWidth="0.5" className="pulse-ping" />
                  <text x="270" y="245" fill="#f43f5e" fontSize="8" fontFamily="monospace">SRC_NODE_BR</text>
                </g>

                {/* Animated Attack Streams (Drawn as curved paths only if BVI risks exist) */}
                {identityRisk > 0 && (
                  <path
                    d="M 620,80 Q 410,60 200,110"
                    fill="none"
                    stroke={hasVulnerabilities ? '#f43f5e' : '#10b981'}
                    strokeWidth="1.5"
                    className="attack-line"
                    opacity="0.8"
                  />
                )}
                {cloudRisk > 0 && (
                  <path
                    d="M 710,150 Q 450,180 200,110"
                    fill="none"
                    stroke={hasVulnerabilities ? '#ef4444' : '#10b981'}
                    strokeWidth="1.5"
                    className="attack-line"
                    opacity="0.8"
                  />
                )}
                {apiRisk > 0 && (
                  <path
                    d="M 260,240 Q 230,175 200,110"
                    fill="none"
                    stroke={hasVulnerabilities ? '#f43f5e' : '#10b981'}
                    strokeWidth="1.5"
                    className="attack-line"
                    opacity="0.8"
                  />
                )}
              </>
            )}
          </svg>

          {/* overlay absolute stats */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-center gap-4 text-xs font-mono backdrop-blur-sm z-10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-slate-500 text-3xs uppercase">Attack Vector</div>
                <div className="text-slate-200 text-2xs font-bold">Credential Stuffing: {identityRisk > 0 ? 'ACTIVE' : 'BLOCKED'}</div>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <div className="text-slate-500 text-3xs uppercase">Data Exfiltrations</div>
              <div className="text-slate-200 text-2xs font-bold">{cloudRisk > 0 ? 'PROBABLE LEAK' : 'ISOLATED'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Breach Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Identity Risk */}
        <div
          onClick={() => setActiveTab('identity')}
          className="group cursor-pointer p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-rose-500/30 transition-all hover:bg-slate-800/70 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Server className="w-6 h-6" />
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              identityRisk > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {identityRisk > 0 ? 'MFA MISSING' : 'SECURED'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
            Identity Access Control
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
            Inspired by Change Healthcare. Audit and enforce MFA on VPN profiles, admin panels, and terminal servers.
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-slate-700/40 pt-4">
            <span className="text-xs text-slate-500">Risk Severity Rating</span>
            <span className={`text-sm font-bold ${identityRisk > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {identityRisk.toFixed(0)}% Vulnerable
            </span>
          </div>
        </div>

        {/* Card 2: Cloud Data Risk */}
        <div
          onClick={() => setActiveTab('cloud')}
          className="group cursor-pointer p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-amber-500/30 transition-all hover:bg-slate-800/70 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Database className="w-6 h-6" />
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              cloudRisk > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {cloudRisk > 0 ? 'DATA EXPOSED' : 'SECURED'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
            Cloud & Data Integrity
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
            Inspired by National Public Data. Detect unencrypted databases and wide-open public directories storing sensitive files.
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-slate-700/40 pt-4">
            <span className="text-xs text-slate-500">Risk Severity Rating</span>
            <span className={`text-sm font-bold ${cloudRisk > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {cloudRisk.toFixed(0)}% Vulnerable
            </span>
          </div>
        </div>

        {/* Card 3: API Risk */}
        <div
          onClick={() => setActiveTab('api')}
          className="group cursor-pointer p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500/30 transition-all hover:bg-slate-800/70 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Link className="w-6 h-6" />
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              apiRisk > 0 ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {apiRisk > 0 ? 'BYPASS RISKS' : 'SECURED'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
            API Verification & Onboarding
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
            Inspired by Canvas/Instructure. Restrict public account creation by domain check, OAuth restrictions, and API rate-limiting.
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-slate-700/40 pt-4">
            <span className="text-xs text-slate-500">Risk Severity Rating</span>
            <span className={`text-sm font-bold ${apiRisk > 0 ? 'text-sky-400' : 'text-emerald-400'}`}>
              {apiRisk.toFixed(0)}% Vulnerable
            </span>
          </div>
        </div>
      </div>

      {/* Incident Timeline Log Console */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-300">Live Incident Timeline Log</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
          </div>
        </div>
        <div className="space-y-1.5 overflow-y-auto max-h-72 text-xs text-slate-400">
          {displayedLogs.map((log, index) => {
            let colorClass = 'text-slate-400';
            if (log.includes('[ALERT]') || log.includes('[CRITICAL]')) {
              colorClass = 'text-rose-400 font-semibold';
            } else if (log.includes('[REMEDIATED]') || log.includes('[SUCCESS]')) {
              colorClass = 'text-emerald-400 font-semibold';
            } else if (log.includes('[SCAN]') || log.includes('[INFO]')) {
              colorClass = 'text-slate-300';
            } else if (log.includes('[WARNING]')) {
              colorClass = 'text-amber-400';
            }

            return (
              <div key={index} className="flex gap-2 hover:bg-slate-900/50 py-0.5 px-1 rounded transition-colors">
                <span className="text-slate-600 select-none">[{index + 1}]</span>
                <span className={colorClass}>{log}</span>
              </div>
            );
          })}
          {isScanning && (
            <div className="flex items-center gap-2 text-emerald-400 animate-pulse font-semibold">
              <span className="text-slate-600">[$]</span>
              <span>Scanning directories and open ports... 100% complete. No new vulnerabilities found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
