import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, ShieldCheck, Server, Database, Link as LinkIcon, Cpu } from 'lucide-react';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { IdentityAuditor } from './components/IdentityAuditor';
import { CloudGuardian } from './components/CloudGuardian';
import { ApiGuard } from './components/ApiGuard';

interface Endpoint {
  id: string;
  name: string;
  type: 'vpn' | 'admin' | 'rdp';
  mfaStatus: 'disabled' | 'enforced';
  riskLevel: 'Critical' | 'Safe';
  endpointUrl: string;
}

interface CloudNode {
  id: string;
  name: string;
  type: 's3' | 'mongodb' | 'postgres';
  publicAccess: boolean;
  encrypted: boolean;
  recordsCount: string;
}

interface ApiConfig {
  oauthEnforced: boolean;
  domainCheckingEnabled: boolean;
  rateLimitingEnabled: boolean;
}

interface APISecret {
  id: string;
  file: string;
  type: string;
  valueMasked: string;
  status: 'exposed' | 'vaulted';
  riskLevel: 'Critical' | 'Safe';
}

function App() {
  const [activeTab, setActiveTab] = useState<string>('executive');

  // Identity auditor state (Change Healthcare)
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    { id: 'ep-1', name: 'Primary Citrix VPN Gateway', type: 'vpn', mfaStatus: 'disabled', riskLevel: 'Critical', endpointUrl: 'vpn.primary.changehealthcare.net' },
    { id: 'ep-2', name: 'Active Directory Admin Console', type: 'admin', mfaStatus: 'disabled', riskLevel: 'Critical', endpointUrl: 'admin.auth.changehealthcare.net' },
    { id: 'ep-3', name: 'Terminal Remote Desktop Protocol (RDP)', type: 'rdp', mfaStatus: 'disabled', riskLevel: 'Critical', endpointUrl: 'rdp.corp.changehealthcare.net' }
  ]);

  // Cloud & data state (National Public Data)
  const [nodes, setNodes] = useState<CloudNode[]>([
    { id: 'node-1', name: 'AWS S3 Backup Archive', type: 's3', publicAccess: true, encrypted: false, recordsCount: '2.9 Billion Records' },
    { id: 'node-2', name: 'Production MongoDB Cluster', type: 'mongodb', publicAccess: true, encrypted: false, recordsCount: '1.4 Billion Records' },
    { id: 'node-3', name: 'PostgreSQL Analytics Warehouse', type: 'postgres', publicAccess: false, encrypted: false, recordsCount: '650 Million Records' }
  ]);

  // API config state (Canvas / Instructure)
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    oauthEnforced: false,
    domainCheckingEnabled: false,
    rateLimitingEnabled: false
  });

  // API Secrets Exposure auditor state
  const [secrets, setSecrets] = useState<APISecret[]>([
    { id: 'sec-1', file: 'config/database.ts', type: 'Database Connection String', valueMasked: 'mongodb+srv://admin:P@ssw******@prod-cluster', status: 'exposed', riskLevel: 'Critical' },
    { id: 'sec-2', file: 'src/services/stripe.ts', type: 'Stripe API Secret Key', valueMasked: 'sk_live_51Nz******x8V9', status: 'exposed', riskLevel: 'Critical' },
    { id: 'sec-3', file: 'src/services/payment.ts', type: 'Payment Gateway API Key', valueMasked: 'AQ.Ab8RN6Le******g8UQ', status: 'exposed', riskLevel: 'Critical' }
  ]);

  // Timeline audit logs state
  const [logs, setLogs] = useState<string[]>([
    '18:25:34 - [SCAN] Initiating ESPM security posture evaluation...',
    '18:25:35 - [ALERT] Citrix VPN Access point lacks multi-factor authentication (MFA)! [CRITICAL]',
    '18:25:36 - [ALERT] S3 Backup node lacks access control: exposed to public internet! [CRITICAL]',
    '18:25:37 - [ALERT] MongoDB Cluster lacks storage volume AES-256 encryption! [CRITICAL]',
    '18:25:38 - [ALERT] Self-registration API lacks OAuth verification and domain checking! [HIGH]',
    '18:25:39 - [STATS] Calculated initial Breach Vulnerability Index (BVI): 94.4% [CRITICAL DANGER]'
  ]);

  // Periodic heartbeat security scans simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const scans = [
        '[SCAN] Auditing user directory permissions...',
        '[SCAN] Inspecting firewall network translation tables...',
        '[SCAN] Checking TLS certificate validity for subdomain entries...',
        '[SCAN] Checking AWS IAM cross-account access rules...',
        '[SCAN] Scanning external API routes for path traversal patterns...',
        '[INFO] Log verification agent active: monitoring security alerts.',
        '[INFO] Heartbeat check: Database isolation status normal.'
      ];
      const randomScan = scans[Math.floor(Math.random() * scans.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, `${timestamp} - ${randomScan}`]);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Remediations
  const handleEnforceMfa = () => {
    setEndpoints((prev) =>
      prev.map((ep) => ({ ...ep, mfaStatus: 'enforced', riskLevel: 'Safe' }))
    );
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      `${timestamp} - [REMEDIATED] Enforced Global MFA Policy. Credentials validated. Risk reduced to Safe.`
    ]);
  };

  const handlePatchNode = (id: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, publicAccess: false, encrypted: true } : node
      )
    );
    const nodeName = nodes.find((n) => n.id === id)?.name || 'Database Node';
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      `${timestamp} - [REMEDIATED] Applied security patch to node: [${nodeName}]. Blocked public internet ingress and enabled AES-256 encryption.`
    ]);
  };

  const handleApiChange = (key: keyof ApiConfig, value: boolean) => {
    setApiConfig((prev) => ({ ...prev, [key]: value }));
    const label = key === 'oauthEnforced' ? 'OAuth Verification' : key === 'domainCheckingEnabled' ? 'Domain Checks' : 'API Rate-Limiting';
    const status = value ? 'ENABLED' : 'DISABLED';
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      `${timestamp} - [CONFIG] Modified API security setting: ${label} was toggled to [${status}].`
    ]);
  };

  const handleMigrateSecrets = () => {
    setSecrets((prev) =>
      prev.map((sec) => ({ ...sec, status: 'vaulted', riskLevel: 'Safe' }))
    );
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      `${timestamp} - [REMEDIATED] Migrated hardcoded API keys and database credentials to key vault. Removed code-level exposures.`
    ]);
  };

  // Dynamic risk scores calculations
  const identityDisabled = endpoints.filter((ep) => ep.mfaStatus === 'disabled').length;
  const identityRisk = (identityDisabled / endpoints.length) * 100;

  const cloudVulnerabilities = nodes.reduce(
    (acc, node) => acc + (node.publicAccess ? 1 : 0) + (node.encrypted ? 0 : 1),
    0
  );
  const cloudRisk = (cloudVulnerabilities / (nodes.length * 2)) * 100;

  const apiDisabled =
    (apiConfig.oauthEnforced ? 0 : 1) +
    (apiConfig.domainCheckingEnabled ? 0 : 1) +
    (apiConfig.rateLimitingEnabled ? 0 : 1);
  const apiRisk = (apiDisabled / 3) * 100;

  const exposedSecrets = secrets.filter((sec) => sec.status === 'exposed').length;
  const secretsRisk = (exposedSecrets / secrets.length) * 100;

  const bviScore = (identityRisk + cloudRisk + apiRisk + secretsRisk) / 4;

  // Circle Gauge SVG configuration
  const circleRadius = 36;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * bviScore) / 100;

  const getBviColor = (score: number) => {
    if (score > 60) return 'text-rose-500 stroke-rose-500';
    if (score > 20) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  const getBviBgColor = (score: number) => {
    if (score > 60) return 'bg-rose-500/10 border-rose-500/20';
    if (score > 20) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* GLOBAL SYSTEM WARNING BANNER */}
      {bviScore > 0 ? (
        <div className="bg-rose-950/80 border-b border-rose-500/30 text-rose-300 py-2.5 px-6 flex items-center justify-between gap-4 text-xs backdrop-blur-md sticky top-0 z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
            <span className="font-semibold tracking-wide uppercase">Critical Security Advisories Pending</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              {identityRisk > 0 && 'Missing MFA on remote gateways. '}
              {cloudRisk > 0 && 'Unencrypted database records open to the public WAN. '}
              {apiRisk > 0 && 'Domain validation bypass allowed on public signup forms.'}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-rose-400 font-mono">{bviScore.toFixed(1)}% Vulnerable</span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 py-2.5 px-6 flex items-center justify-between gap-4 text-xs backdrop-blur-md sticky top-0 z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold tracking-wide uppercase">All Remediations Deployed</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Enterprise security posture matches zero-trust standards. All systems isolated, encrypted, and audited.</span>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-emerald-400 font-mono">0.0% Vulnerable</span>
          </div>
        </div>
      )}

      {/* Main Core Dashboard Layout Container */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-8">
              <Shield className="w-7 h-7 text-emerald-500" />
              <div>
                <h1 className="font-black text-slate-100 tracking-wide text-md">CyberShield Hub</h1>
                <div className="text-4xs text-emerald-400 tracking-widest uppercase font-bold">Posture Manager</div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('executive'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'executive'
                    ? 'bg-slate-900 border-l-4 border-emerald-500 text-emerald-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4.5 h-4.5" />
                Executive Overview
              </button>

              <button
                onClick={() => { setActiveTab('identity'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'identity'
                    ? 'bg-slate-900 border-l-4 border-rose-500 text-rose-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Server className="w-4.5 h-4.5" />
                Identity Auditor
              </button>

              <button
                onClick={() => { setActiveTab('cloud'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'cloud'
                    ? 'bg-slate-900 border-l-4 border-amber-500 text-amber-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Database className="w-4.5 h-4.5" />
                Cloud Guardian
              </button>

              <button
                onClick={() => { setActiveTab('api'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'api'
                    ? 'bg-slate-900 border-l-4 border-sky-500 text-sky-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-4.5 h-4.5" />
                API Verification Guard
              </button>
            </nav>
          </div>

          {/* SIDEBAR FOOTER METRICS GAUGE */}
          <div className="p-6 border-t border-slate-900/80 bg-slate-950">
            <div className="flex flex-col items-center">
              <span className="text-3xs uppercase tracking-wider font-bold text-slate-500 mb-4">Breach Vulnerability Index</span>
              
              {/* Dynamic Radial Gauge */}
              <div className="relative flex items-center justify-center w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track Circle */}
                  <circle
                    cx="56"
                    cy="56"
                    r={circleRadius}
                    className="stroke-slate-800"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  {/* Fill Circle */}
                  <circle
                    cx="56"
                    cy="56"
                    r={circleRadius}
                    className={`transition-all duration-700 ease-out ${getBviColor(bviScore)}`}
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-xl font-bold font-mono tracking-tighter ${getBviColor(bviScore)}`}>
                    {bviScore.toFixed(0)}%
                  </span>
                  <span className="text-4xs uppercase tracking-widest font-black text-slate-400 mt-0.5">
                    {bviScore > 65 ? 'CRITICAL' : bviScore > 20 ? 'WARNING' : 'SECURE'}
                  </span>
                </div>
              </div>

              <div className={`mt-4 px-3 py-1 rounded text-center w-full border text-4xs uppercase font-extrabold tracking-wider ${getBviBgColor(bviScore)}`}>
                POSTURE STATUS: {bviScore > 65 ? 'CRITICAL EXPOSURE' : bviScore > 20 ? 'WEAKENED SHELL' : 'HARDENED POSTURE'}
              </div>
            </div>
          </div>
        </aside>

        {/* CORE CONTENT CONTAINER */}
        <main className="flex-1 bg-slate-900 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-42px)]">
          {activeTab === 'executive' && (
            <ExecutiveOverview
              identityRisk={identityRisk}
              cloudRisk={cloudRisk}
              apiRisk={apiRisk}
              secretsRisk={secretsRisk}
              setActiveTab={setActiveTab}
              logs={logs}
            />
          )}

          {activeTab === 'identity' && (
            <IdentityAuditor endpoints={endpoints} onEnforceMfa={handleEnforceMfa} />
          )}

          {activeTab === 'cloud' && (
            <CloudGuardian nodes={nodes} onPatchNode={handlePatchNode} />
          )}

          {activeTab === 'api' && (
            <ApiGuard
              config={apiConfig}
              onChangeConfig={handleApiChange}
              secrets={secrets}
              onMigrateSecrets={handleMigrateSecrets}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
