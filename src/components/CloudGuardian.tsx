import React, { useState } from 'react';
import { Database, Globe, Lock, Unlock, Eye, EyeOff, Server, Play, CheckCircle } from 'lucide-react';

interface CloudNode {
  id: string;
  name: string;
  type: 's3' | 'mongodb' | 'postgres';
  publicAccess: boolean;
  encrypted: boolean;
  recordsCount: string;
}

interface CloudGuardianProps {
  nodes: CloudNode[];
  onPatchNode: (id: string) => void;
}

export const CloudGuardian: React.FC<CloudGuardianProps> = ({ nodes, onPatchNode }) => {
  const [patchingId, setPatchingId] = useState<string | null>(null);

  const handlePatchClick = (id: string) => {
    setPatchingId(id);
    setTimeout(() => {
      onPatchNode(id);
      setPatchingId(null);
    }, 1200); // Simulate network patch propagation delay
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Block */}
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            NATIONAL PUBLIC DATA VULNERABILITY MATRIX
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-2">Cloud & Data Guardian</h2>
          <p className="text-slate-400 text-xs mt-1.5 max-w-2xl leading-relaxed">
            The National Public Data leak exposed hundreds of millions of records because database backups and active clusters were left open to the public internet without encryption. Audit database isolation and apply encryption patches below.
          </p>
        </div>
      </div>

      {/* Database Network Topology Visual Component */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 relative overflow-hidden">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          Network & Data Flow Topology
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          
          {/* Public Internet Gateway Node */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-800 bg-slate-900/60 relative z-10 lg:col-span-1">
            <div className="p-4 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 relative">
              <Globe className="w-8 h-8 text-sky-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-sky-500/10 animate-ping"></div>
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-3">Public Internet</div>
            <div className="text-2xs text-slate-500 mt-0.5 uppercase tracking-wide">Gateway WAN</div>
            <div className="mt-3 text-2xs text-slate-400 text-center leading-relaxed">
              External HTTP/FTP traffic attempts connections directly.
            </div>
          </div>

          {/* Topology Connections (SVG or CSS flow lines rendered beautifully) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {nodes.map((node) => {
              const hasVulnerabilities = node.publicAccess || !node.encrypted;

              return (
                <div
                  key={node.id}
                  className={`flex flex-col p-5 rounded-xl border relative transition-all duration-300 ${
                    hasVulnerabilities
                      ? 'border-rose-500/30 bg-rose-950/5 hover:bg-rose-950/10'
                      : 'border-emerald-500/30 bg-emerald-950/5 hover:bg-emerald-950/10'
                  }`}
                >
                  {/* Connection Line Indicator */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 lg:left-0 lg:-left-6 lg:top-1/2 lg:-translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <span className={`w-1 h-6 lg:w-6 lg:h-1 ${node.publicAccess ? 'bg-rose-500/50 animate-pulse' : 'bg-emerald-500/30'}`}></span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`p-2.5 rounded-lg border ${
                      hasVulnerabilities 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      <Database className="w-5 h-5" />
                    </span>
                    <div className="flex gap-2">
                      {node.publicAccess ? (
                        <span className="p-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400" title="Public Access Allowed">
                          <Eye className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" title="Isolated in Private Subnet">
                          <EyeOff className="w-4 h-4" />
                        </span>
                      )}

                      {node.encrypted ? (
                        <span className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" title="AES-256 Encrypted">
                          <Lock className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-bounce" title="Unencrypted Storage">
                          <Unlock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200">{node.name}</h4>
                  <div className="text-3xs text-slate-500 font-mono uppercase mt-0.5">
                    {node.type === 's3' ? 'AWS S3 Storage' : node.type === 'mongodb' ? 'NoSQL Cluster' : 'Relational Database'}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Subnet Isolation:</span>
                      <span className={node.publicAccess ? 'text-rose-400 font-medium' : 'text-emerald-400'}>
                        {node.publicAccess ? 'Public (0.0.0.0/0)' : 'Private Subnet'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>AES-256 Storage:</span>
                      <span className={node.encrypted ? 'text-emerald-400' : 'text-rose-400 font-medium'}>
                        {node.encrypted ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stored Records:</span>
                      <span className="text-slate-300 font-mono">{node.recordsCount}</span>
                    </div>
                  </div>

                  <button
                    disabled={!hasVulnerabilities || patchingId !== null}
                    onClick={() => handlePatchClick(node.id)}
                    className={`mt-4.5 w-full py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      !hasVulnerabilities
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : patchingId === node.id
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-wait'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {!hasVulnerabilities ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Node Isolated & Encrypted
                      </>
                    ) : patchingId === node.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Running Isolation Patch...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Deploy Remediation Patch
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Leak Incident Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Technical Analysis of the NPD Leak</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            In mid-2024, National Public Data, a background checking company, suffered a massive data leak exposing Social Security Numbers, names, and addresses. Investigative reports confirmed backup databases and active environments were stored in files visible directly on public-facing servers with no access controls, credentials, or encryption protecting the data folders.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Architectural Best Practices</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never host databases directly on the public internet. Secure databases inside a Private Subnet utilizing Virtual Private Clouds (VPC). Restrict ingress rules to trusted application nodes using security groups. Additionally, ensure transparent data encryption (TDE) or storage-volume AES-256 encryption is enabled.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple spinner icon wrapper
const RefreshCw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);
