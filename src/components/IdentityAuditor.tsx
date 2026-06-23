import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, Server, Laptop, ChevronRight, Search, AlertOctagon } from 'lucide-react';

interface Endpoint {
  id: string;
  name: string;
  type: 'vpn' | 'admin' | 'rdp';
  mfaStatus: 'disabled' | 'enforced';
  riskLevel: 'Critical' | 'Safe';
  endpointUrl: string;
}

interface IdentityAuditorProps {
  endpoints: Endpoint[];
  onEnforceMfa: () => void;
}

interface LeakedCredential {
  email: string;
  passwordMasked: string;
  source: string;
  date: string;
  severity: 'Critical' | 'Warning';
}

export const IdentityAuditor: React.FC<IdentityAuditorProps> = ({ endpoints, onEnforceMfa }) => {
  const allEnforced = endpoints.every((ep) => ep.mfaStatus === 'enforced');
  
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<LeakedCredential[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedText, setSearchedText] = useState('');

  const mockLeakedDatabase: Record<string, LeakedCredential[]> = {
    'changehealthcare.com': [
      { email: 'ceo@changehealthcare.com', passwordMasked: 'ChHlthCeo20***', source: 'Citrix Gateway VPN Dump', date: 'Feb 2024', severity: 'Critical' },
      { email: 'admin.support@changehealthcare.com', passwordMasked: 'P@ssw0rdAd***', source: 'AD Active Directory Credentials Dump', date: 'Feb 2024', severity: 'Critical' },
      { email: 'finance@changehealthcare.com', passwordMasked: 'SpringFin20***', source: 'OWAS Exchange Portal Scraping', date: 'Jan 2024', severity: 'Warning' }
    ],
    'instructure.com': [
      { email: 'canvas-admin@instructure.com', passwordMasked: 'CanvasMstr***', source: 'LMS API Parameter Leak', date: 'Mar 2024', severity: 'Critical' }
    ],
    'npd.com': [
      { email: 'db-backup@nationalpublicdata.com', passwordMasked: 'BackupNpd99***', source: 'Public FTP Archive Breach', date: 'Jun 2024', severity: 'Critical' }
    ]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    setIsSearching(true);
    setSearchResults(null);

    setTimeout(() => {
      const emailDomain = searchEmail.split('@')[1]?.toLowerCase();
      const domainMatches = mockLeakedDatabase[emailDomain] || [];
      
      // Also check exact email match inside all domain lists
      const exactMatch = Object.values(mockLeakedDatabase)
        .flat()
        .filter(item => item.email.toLowerCase() === searchEmail.trim().toLowerCase());

      if (exactMatch.length > 0) {
        setSearchResults(exactMatch);
      } else if (domainMatches.length > 0) {
        setSearchResults(domainMatches);
      } else {
        setSearchResults([]);
      }
      setSearchedText(searchEmail);
      setIsSearching(false);
    }, 800);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'vpn':
        return <Laptop className="w-5 h-5 text-indigo-400" />;
      case 'admin':
        return <Key className="w-5 h-5 text-amber-400" />;
      case 'rdp':
        return <Server className="w-5 h-5 text-pink-400" />;
      default:
        return <Server className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Block */}
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              CHANGE HEALTHCARE VULNERABILITY MATRIX
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-2">Identity Access Control & MFA Auditor</h2>
          <p className="text-slate-400 text-xs mt-1.5 max-w-2xl leading-relaxed">
            The Change Healthcare breach occurred due to a remote access server lacking Multi-Factor Authentication. Below are identified external access points. Enforce MFA across all endpoints to secure credential entry.
          </p>
        </div>
        <button
          onClick={onEnforceMfa}
          disabled={allEnforced}
          className={`w-full md:w-auto px-5 py-3 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 ${
            allEnforced
              ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 hover:shadow-emerald-500/20'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          {allEnforced ? 'MFA Policy Active' : 'Enforce Global MFA Policy'}
        </button>
      </div>

      {/* Endpoint Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="py-4 px-6">Endpoint / System Node</th>
                <th className="py-4 px-6">Access Address</th>
                <th className="py-4 px-6">MFA Status</th>
                <th className="py-4 px-6">Calculated Risk</th>
                <th className="py-4 px-6 text-right">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {endpoints.map((ep) => (
                <tr
                  key={ep.id}
                  className="hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="py-4.5 px-6 flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-slate-600 transition-colors">
                      {getIcon(ep.type)}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                        {ep.name}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Type: {ep.type === 'vpn' ? 'Virtual Private Network' : ep.type === 'admin' ? 'Administrative Web Portal' : 'Remote Desktop Protocol'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4.5 px-6 font-mono text-xs text-slate-400">
                    {ep.endpointUrl}
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-2">
                      {ep.mfaStatus === 'enforced' ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Enforced
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4.5 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                        ep.riskLevel === 'Critical'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {ep.riskLevel}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-right">
                    {ep.mfaStatus === 'enforced' ? (
                      <span className="text-xs text-emerald-500 font-semibold">Active & Audited</span>
                    ) : (
                      <span className="text-xs text-rose-400 font-semibold group-hover:underline cursor-pointer flex items-center justify-end gap-1" onClick={onEnforceMfa}>
                        Remediation Required <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW: Dark Web Leak Directory Lookup */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-350 flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-500" />
            Dark Web Credential Leak Scanner
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Search employees email domain (e.g. `changehealthcare.com`, `npd.com`) to check for exposed accounts harvested in public breaches.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter corporate domain or email (e.g., ceo@changehealthcare.com)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-lg font-bold text-xs bg-slate-800 border border-slate-700 hover:border-rose-500/30 text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching Cache...' : 'Search Leaked Records'}
          </button>
        </form>

        {/* Results output */}
        {searchResults !== null && (
          <div className="border border-slate-900 bg-slate-900/10 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="text-slate-500 text-2xs uppercase border-b border-slate-900 pb-2">
              Search Queries Match: <span className="text-slate-300 font-bold">{searchedText}</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-emerald-400 p-2 bg-emerald-950/15 border border-emerald-500/10 rounded flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero compromised records matching this domain found in active leak catalogs.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-rose-400 font-semibold p-2 bg-rose-950/10 border border-rose-500/10 rounded flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 animate-bounce" />
                  <span>Found {searchResults.length} leaked credential profiles. Verify credential exposure immediately.</span>
                </div>

                <div className="divide-y divide-slate-900 space-y-2.5 pt-2">
                  {searchResults.map((leak, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                      <div>
                        <div className="text-slate-200 font-semibold">{leak.email}</div>
                        <div className="text-2xs text-slate-500 mt-0.5">
                          Exposure Source: {leak.source} ({leak.date})
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-slate-500 text-3xs uppercase">Masked Hash</div>
                          <div className="text-rose-300 font-semibold tracking-wide text-2xs">{leak.passwordMasked}</div>
                        </div>
                        <div className="min-w-32">
                          <div className="text-slate-500 text-3xs uppercase">Portal Status</div>
                          {allEnforced ? (
                            <span className="text-emerald-400 font-bold text-2xs">ACCESS BLOCKED (MFA Active)</span>
                          ) : (
                            <span className="text-rose-500 font-bold text-2xs animate-pulse">COMPROMISED (No MFA)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Best Practices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Technical Summary of Change Healthcare Failure</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            The February 2024 ransomware attack occurred because a Citrix remote access portal did not require multi-factor authentication. Threat actors gained access to credentials and leveraged them to move laterally through the enterprise networks, resulting in widespread clearinghouse disruptions.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Architectural Mitigation Control</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standardizing identity-aware proxies (IAPs), hardware security keys (FIDO2/WebAuthn), and zero-trust network access policies ensure that compromised user credentials alone cannot authorize external access. All management portals should reside on private networks or require robust MFA.
          </p>
        </div>
      </div>
    </div>
  );
};
