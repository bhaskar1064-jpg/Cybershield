import React, { useState } from 'react';
import { Sliders, Play, Code, AlertCircle, Key, Lock, Unlock } from 'lucide-react';

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

interface ApiGuardProps {
  config: ApiConfig;
  onChangeConfig: (key: keyof ApiConfig, value: boolean) => void;
  secrets: APISecret[];
  onMigrateSecrets: () => void;
}

type AttackType = 'idor' | 'flood' | 'sqli';

export const ApiGuard: React.FC<ApiGuardProps> = ({ config, onChangeConfig, secrets, onMigrateSecrets }) => {
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [attackType, setAttackType] = useState<AttackType>('idor');

  // Calculate exploit likelihood based on configuration
  const calculateBypassLikelihood = () => {
    let score = 98; // Base risk
    if (config.oauthEnforced) score -= 50;
    if (config.domainCheckingEnabled) score -= 30;
    if (config.rateLimitingEnabled) score -= 16;
    return Math.max(2, score);
  };

  const likelihood = calculateBypassLikelihood();

  const getLikelihoodColor = (val: number) => {
    if (val > 60) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (val > 20) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getLikelihoodProgressColor = (val: number) => {
    if (val > 60) return 'bg-rose-500';
    if (val > 20) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getLikelihoodText = (val: number) => {
    if (val > 60) return 'Critical Vulnerability';
    if (val > 20) return 'Moderate Threat Vector';
    return 'Secured Control';
  };

  const simulateAttack = () => {
    setIsSimulating(true);
    setSimulationLogs([]);

    if (attackType === 'idor') {
      setSimulationLogs([
        'Initializing IDOR / Parameter Bypass Exploit...',
        'Target: POST /api/v1/onboarding/register',
        'Injecting parameter: { "email": "attacker@gmail.com", "role": "SiteAdmin", "org_id": "district_12" }'
      ]);

      setTimeout(() => {
        if (!config.oauthEnforced && !config.domainCheckingEnabled) {
          setSimulationLogs((prev) => [
            ...prev,
            'HTTP/1.1 201 Created',
            'Response: { "status": "success", "userId": "usr_998", "role": "SiteAdmin", "verified": false }',
            'CRITICAL: Registration bypassed. Attacker registered as administrator of tenant [district_12] without email validation.'
          ]);
        } else if (config.oauthEnforced && !config.domainCheckingEnabled) {
          setSimulationLogs((prev) => [
            ...prev,
            'HTTP/1.1 201 Created',
            'Response: { "status": "success", "userId": "usr_998", "role": "SiteAdmin" }',
            'WARNING: OAuth bypass occurred. Domain checking was off; email attacker@gmail.com allowed without scholastic extension verification.'
          ]);
        } else {
          setSimulationLogs((prev) => [
            ...prev,
            'HTTP/1.1 403 Forbidden',
            'Response: { "error": "Access Denied: OAuth tenant verification failed or domain is not authorized for district_12." }',
            'SUCCESS: Exploitation blocked by Active Domain Checks / OAuth Enforcements.'
          ]);
        }
        setIsSimulating(false);
      }, 1000);
    } else if (attackType === 'flood') {
      setSimulationLogs([
        'Initializing Automated Registration Flood (DDoS)...',
        'Target: POST /api/v1/onboarding/register',
        'Spawning concurrent workers sending 30 registration requests...'
      ]);

      setTimeout(() => {
        if (config.rateLimitingEnabled) {
          setSimulationLogs((prev) => [
            ...prev,
            'Requests 1-5: HTTP/1.1 201 Created',
            'Request 6: HTTP/1.1 429 Too Many Requests (Rate limit exceeded)',
            'Requests 7-30: HTTP/1.1 429 Too Many Requests',
            'SUCCESS: API endpoint successfully throttled. Server resources protected.'
          ]);
        } else {
          setSimulationLogs((prev) => [
            ...prev,
            'Requests 1-15: HTTP/1.1 201 Created',
            'Requests 16-30: HTTP/1.1 201 Created',
            'ALERT: Server processed 30 signups, creating 30 mock accounts. API database open to spam exhaustion.'
          ]);
        }
        setIsSimulating(false);
      }, 1200);
    } else if (attackType === 'sqli') {
      setSimulationLogs([
        'Initializing SQL Evasion Injection Attack...',
        'Target: POST /api/v1/onboarding/register',
        'Injecting email: "attacker\' OR 1=1; -- @school.edu"'
      ]);

      setTimeout(() => {
        if (config.domainCheckingEnabled) {
          setSimulationLogs((prev) => [
            ...prev,
            'HTTP/1.1 400 Bad Request',
            'Response: { "error": "Invalid email format. Evasion characters detected." }',
            'SUCCESS: Regex domain validation filters blocked malformed SQL character strings.'
          ]);
        } else {
          setSimulationLogs((prev) => [
            ...prev,
            'HTTP/1.1 500 Internal Server Error (SQL Syntax Exception)',
            'DBMS Log: "Syntax error near OR 1=1; --"',
            'CRITICAL: SQL Query executed inputs directly. Target API database exposed to SQL Injection.'
          ]);
        }
        setIsSimulating(false);
      }, 1000);
    }
  };

  const getRequestTemplate = () => {
    switch (attackType) {
      case 'idor':
        return `POST /api/v1/onboarding/register HTTP/1.1
Host: canvas.instructure-hub.com
Content-Type: application/json

{
  "email": "attacker@gmail.com",
  "role": "SiteAdmin",
  "organization_id": "district_12"
}`;
      case 'flood':
        return `GET /api/v1/onboarding/register HTTP/1.1
Host: canvas.instructure-hub.com
X-Connection-Flood: True

[Looping 30 HTTP requests sequentially...]`;
      case 'sqli':
        return `POST /api/v1/onboarding/register HTTP/1.1
Host: canvas.instructure-hub.com
Content-Type: application/json

{
  "email": "attacker' OR 1=1; -- @school.edu",
  "role": "Student"
}`;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Block */}
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            CANVAS / INSTRUCTURE API BYPASS MATRIX
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-2">API Verification & Onboarding Guard</h2>
          <p className="text-slate-400 text-xs mt-1.5 max-w-2xl leading-relaxed">
            In early 2024, researchers discovered that Canvas (Instructure LMS) suffered from weak onboarding controls, allowing threat actors to register arbitrary emails and bypass domain checks, gaining teacher or admin privileges on certain institutions. Harden onboarding APIs here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configuration Toggles Panel */}
        <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/40 lg:col-span-7 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Security Rule Configurations
          </h3>

          <div className="space-y-5">
            {/* Toggle 1: OAuth */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-200 cursor-pointer" htmlFor="oauth-toggle">
                  Enforce Domain Verification via OAuth
                </label>
                <p className="text-xs text-slate-400">
                  Force registrations to authenticate against validated Microsoft/Google federated tenant IDs instead of plain text forms.
                </p>
              </div>
              <button
                id="oauth-toggle"
                onClick={() => onChangeConfig('oauthEnforced', !config.oauthEnforced)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  config.oauthEnforced ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.oauthEnforced ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Domain Checking */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-200 cursor-pointer" htmlFor="domain-toggle">
                  Enable Strict Domain Checking
                </label>
                <p className="text-xs text-slate-400">
                  Verify that signup emails exactly match white-listed corporate or academic domain extensions (e.g. *.edu, *.gov).
                </p>
              </div>
              <button
                id="domain-toggle"
                onClick={() => onChangeConfig('domainCheckingEnabled', !config.domainCheckingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  config.domainCheckingEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.domainCheckingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Rate Limiting */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-200 cursor-pointer" htmlFor="ratelimit-toggle">
                  Rate-Limit Public Signup API
                </label>
                <p className="text-xs text-slate-400">
                  Restrict registration routes to 5 signup attempts per IP address per hour to prevent automated brute-force scripts.
                </p>
              </div>
              <button
                id="ratelimit-toggle"
                onClick={() => onChangeConfig('rateLimitingEnabled', !config.rateLimitingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  config.rateLimitingEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.rateLimitingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Threat Gauge & Simulation Simulator */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Likelihood Gauge */}
          <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/40 flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 w-full text-left">
              Bypass Exploit Likelihood
            </h3>

            <div className="w-full mt-2 relative">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                <span>Current Risk Level:</span>
                <span className={`px-2 py-0.5 rounded text-2xs font-bold border ${getLikelihoodColor(likelihood)}`}>
                  {getLikelihoodText(likelihood)}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${getLikelihoodProgressColor(likelihood)}`}
                  style={{ width: `${likelihood}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-2xs text-slate-500 mt-1 font-mono">
                <span>0% Safe</span>
                <span className="font-bold text-slate-300 text-sm">{likelihood}% Exploit Probability</span>
                <span>100% Vulnerable</span>
              </div>
            </div>
          </div>

          {/* Interactive Request Attack Simulator */}
          <div className="p-6 rounded-2xl border border-slate-850 bg-slate-950 flex-1 flex flex-col justify-between font-mono relative space-y-4">
            <div className="flex flex-col gap-3 border-b border-slate-900 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-rose-500" />
                  <span className="text-2xs uppercase font-bold tracking-wider text-slate-400">Endpoint Attack Simulator</span>
                </div>
                <button
                  onClick={simulateAttack}
                  disabled={isSimulating}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSimulating
                      ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  {isSimulating ? 'Sending...' : 'Trigger Exploit'}
                </button>
              </div>

              {/* Selector for Attack Type */}
              <div className="flex gap-2 text-2xs">
                <button
                  onClick={() => { setAttackType('idor'); setSimulationLogs([]); }}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    attackType === 'idor'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  IDOR Bypass
                </button>
                <button
                  onClick={() => { setAttackType('flood'); setSimulationLogs([]); }}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    attackType === 'flood'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  Rate Flood
                </button>
                <button
                  onClick={() => { setAttackType('sqli'); setSimulationLogs([]); }}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    attackType === 'sqli'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  SQL Injection
                </button>
              </div>
            </div>

            {/* Request Payload view */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 text-3xs text-slate-400 whitespace-pre overflow-x-auto max-h-36">
              {getRequestTemplate()}
            </div>

            {/* Output logs */}
            <div className="text-2xs text-slate-400 space-y-1 flex-1 overflow-y-auto max-h-40 min-h-24 pt-2 border-t border-slate-900">
              {simulationLogs.length === 0 ? (
                <div className="text-slate-650 flex items-center justify-center h-full gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Choose an attack model and click 'Trigger Exploit' to run payload.</span>
                </div>
              ) : (
                simulationLogs.map((log, index) => {
                  let logColor = 'text-slate-400';
                  if (log.includes('HTTP/1.1 201') || log.startsWith('CRITICAL:') || log.startsWith('ALERT:')) {
                    logColor = 'text-rose-400 font-bold';
                  } else if (log.includes('HTTP/1.1 403') || log.includes('HTTP/1.1 429') || log.startsWith('SUCCESS:') || log.includes('HTTP/1.1 400')) {
                    logColor = 'text-emerald-400 font-bold';
                  } else if (log.startsWith('WARNING:')) {
                    logColor = 'text-amber-400 font-semibold';
                  }
                  return (
                    <div key={index} className={logColor}>
                      &gt; {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NEW: API Keys & Secrets Exposure Auditor Panel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Key className="w-4.5 h-4.5 text-amber-500" />
              API Keys & Secrets Exposure Auditor
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Audit workspace directory structures for hardcoded credentials, third-party API tokens, and database authentication strings.
            </p>
          </div>
          <button
            onClick={onMigrateSecrets}
            disabled={secrets.every((sec) => sec.status === 'vaulted')}
            className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              secrets.every((sec) => sec.status === 'vaulted')
                ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:shadow-amber-500/20 active:scale-95'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {secrets.every((sec) => sec.status === 'vaulted') ? 'All Secrets Vaulted' : 'Rotate & Migrate to Key Vault'}
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 font-bold uppercase tracking-wider">
                  <th className="py-3 px-5">Target File Path</th>
                  <th className="py-3 px-5">Credential Type</th>
                  <th className="py-3 px-5 font-mono">Masked Secret String</th>
                  <th className="py-3 px-5">Exposure Status</th>
                  <th className="py-3 px-5 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 font-mono">
                {secrets.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-200">{sec.file}</td>
                    <td className="py-3.5 px-5 text-slate-400">{sec.type}</td>
                    <td className="py-3.5 px-5 text-slate-500 text-2xs">{sec.valueMasked}</td>
                    <td className="py-3.5 px-5">
                      {sec.status === 'vaulted' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-3xs font-bold font-sans">
                          <Lock className="w-3 h-3" />
                          VAULT ENCRYPTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-3xs font-bold font-sans animate-pulse">
                          <Unlock className="w-3 h-3" />
                          EXPOSED IN CODE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded font-sans text-3xs font-extrabold ${
                        sec.status === 'vaulted'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}>
                        {sec.status === 'vaulted' ? 'SAFE' : sec.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security Best Practices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Technical Analysis of the Canvas Bypass</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            In Canvas, specific self-registration routers allowed external users to input arbitrary school codes or email addresses on registration forms without confirming that the user possessed access to that school's domains. By manipulating parameters in onboarding payloads, attackers could gain privileged administrative access to the Canvas portal.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Architectural Best Practices</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never trust registration parameters without server-side verification. Bind registration endpoints with double-opt-in workflows (where email codes must be verified) or enforce identity federation (SAML/OIDC). Implement robust domain checking rules on the registration backend and rate-limit onboarding routes to restrict dictionary attacks.
          </p>
        </div>
      </div>
    </div>
  );
};
