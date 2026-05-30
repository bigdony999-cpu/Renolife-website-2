import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Dna, 
  Eye, 
  Key, 
  LogOut, 
  Search, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Clock,
  Laptop,
  Globe,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Language } from '../types';

interface VisitorLog {
  id: string;
  visitorId: string;
  visitedAt: any;
  userAgent: string;
  language: string;
}

interface SignupRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: string;
  signedUpAt: any;
}

interface LoginEvent {
  id: string;
  email: string;
  loggedInAt: any;
}

interface AdminDashboardProps {
  lang: Language;
  onLogout: () => void;
}

export default function AdminDashboard({ lang, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'visitors' | 'signups' | 'logins'>('visitors');
  const [visitorFilter, setVisitorFilter] = useState('');
  const [signupFilter, setSignupFilter] = useState('');
  const [loginFilter, setLoginFilter] = useState('');
  
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [signups, setSignups] = useState<SignupRecord[]>([]);
  const [logins, setLogins] = useState<LoginEvent[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAuthEmail(auth.currentUser?.email || null);
    
    // Listeners for visitors
    const qVis = query(collection(db, 'visitors'), orderBy('visitedAt', 'desc'), limit(150));
    const unsubVis = onSnapshot(qVis, (snapshot) => {
      const items: VisitorLog[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          visitorId: data.visitorId || doc.id,
          visitedAt: data.visitedAt,
          userAgent: data.userAgent || 'unknown',
          language: data.language || 'sw'
        });
      });
      setVisitors(items);
      setLoading(false);
    }, (err) => {
      console.warn("Firestore visitor read permission issue:", err);
      setErrorMessage(lang === 'sw' 
        ? 'Ruhusa imekataliwa: Huna ruzuku ya kutosha ya mfumo kusoma kumbukumbu za wanatrafiki. Unahitaji kuingia na barua pepe ya msimamizi.' 
        : 'Permission Denied: You do not have valid administrative credentials to query page traffic feeds.');
      setLoading(false);
    });

    // Listeners for signups
    const qSign = query(collection(db, 'signups'), orderBy('signedUpAt', 'desc'), limit(150));
    const unsubSign = onSnapshot(qSign, (snapshot) => {
      const items: SignupRecord[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          tier: data.tier || 'silver',
          signedUpAt: data.signedUpAt
        });
      });
      setSignups(items);
    }, (err) => {
      console.warn("Firestore signup read permission issue:", err);
      setErrorMessage(lang === 'sw' 
        ? 'Ruhusa imekataliwa: Huna ruzuku ya kusoma faharasa ya wasambazaji walioteuliwa.' 
        : 'Permission Denied: Unauthorized access to full distributor signup database logs.');
    });

    // Listeners for logins
    const qLog = query(collection(db, 'logins'), orderBy('loggedInAt', 'desc'), limit(150));
    const unsubLog = onSnapshot(qLog, (snapshot) => {
      const items: LoginEvent[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          email: data.email || '',
          loggedInAt: data.loggedInAt
        });
      });
      setLogins(items);
    }, (err) => {
      console.warn("Firestore logins read permission issue:", err);
    });

    return () => {
      unsubVis();
      unsubSign();
      unsubLog();
    };
  }, [lang]);

  // Helper to format timestamps gracefully
  const formatTime = (firebaseTimestamp: any) => {
    if (!firebaseTimestamp) return 'just now';
    try {
      const date = firebaseTimestamp.toDate();
      return date.toLocaleString(lang === 'sw' ? 'sw-TZ' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'recent';
    }
  };

  // Filters computed lists
  const filteredVisitors = visitors.filter(v => 
    v.visitorId.toLowerCase().includes(visitorFilter.toLowerCase()) ||
    v.userAgent.toLowerCase().includes(visitorFilter.toLowerCase()) ||
    v.language.toLowerCase().includes(visitorFilter.toLowerCase())
  );

  const filteredSignups = signups.filter(s => 
    s.fullName.toLowerCase().includes(signupFilter.toLowerCase()) ||
    s.email.toLowerCase().includes(signupFilter.toLowerCase()) ||
    s.phone.toLowerCase().includes(signupFilter.toLowerCase()) ||
    s.tier.toLowerCase().includes(signupFilter.toLowerCase())
  );

  const filteredLogins = logins.filter(l => 
    l.email.toLowerCase().includes(loginFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-container-lowest dark:bg-primary/95 text-on-surface dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Top Header */}
      <nav className="border-b border-outline-variant/40 dark:border-primary-container/20 bg-white dark:bg-tertiary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-secondary animate-pulse" />
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-primary dark:text-white">
                RenoLife<span className="text-secondary">+</span> BIOTECH
              </h1>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                {lang === 'sw' ? 'Msimamizi wa Faharasa Core' : 'Central Analytics Ledger'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                {lang === 'sw' ? 'Mtumiaji aliyeingia' : 'Authenticated Administrator'}
              </span>
              <span className="text-xs font-mono font-medium text-primary dark:text-secondary">
                {authEmail || 'jonsongodwin001@gmail.com'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-error/10 hover:bg-error hover:text-white text-error text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full border border-error/25 transition-all active:scale-95 cursor-pointer shadow-sm"
              title={lang === 'sw' ? 'Ondoka (Logout)' : 'Log Out of Admin'}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'sw' ? 'Ondoka' : 'Admin Logout'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Stats Segment */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Title row */}
        <div className="text-center md:text-left space-y-1">
          <h2 className="font-serif text-3xl font-light text-primary dark:text-white">
            {lang === 'sw' ? 'Wagonjwa, Wasajili na Trafiki ya Tovuti' : 'Real-time Analytics Desk'}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-xl">
            {lang === 'sw' 
              ? 'Tazama moja kwa moja nani anayetembelea tovuti yako, anayejisajili kama msambazaji au anayeingia kwenye akaunti yake.'
              : 'Monitor trace feeds synced in real time directly with your persistent security framework.'}
          </p>
        </div>

        {/* Live Counters Dashboard Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Visitors */}
          <div className="bg-white dark:bg-tertiary border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 top-4 w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-cyan-500">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{lang === 'sw' ? 'Trafiki (Wanaotembelea)' : 'Total Page Visitors'}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-serif font-bold text-primary dark:text-white">{loading ? '...' : visitors.length}</span>
              <span className="text-[11px] text-cyan-500 font-mono font-bold uppercase flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Live
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-3 truncate">
              {lang === 'sw' ? 'Watumiaji wa kipekee waliogunduliwa' : 'Unique hardware device sessions monitored'}
            </p>
          </div>

          {/* Card 2: Signups */}
          <div className="bg-white dark:bg-tertiary border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 top-4 w-12 h-12 rounded-xl bg-secondary/15 dark:bg-secondary/15 flex items-center justify-center text-secondary">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{lang === 'sw' ? 'Wasambazaji Wapya' : 'Registered Distributors'}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-serif font-bold text-primary dark:text-white">{loading ? '...' : signups.length}</span>
              <span className="text-[11px] text-secondary font-mono font-bold uppercase flex items-center gap-0.5">
                <CheckCircle className="w-3.5 h-3.5 animate-bounce" /> {signups.length > 0 ? 'Active' : 'Idle'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-3 truncate">
              {lang === 'sw' ? 'Seli Mama Tanzania wazabuni' : 'Validated stem cell distribution partners'}
            </p>
          </div>

          {/* Card 3: Logins */}
          <div className="bg-white dark:bg-tertiary border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 top-4 w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-purple-500">
              <Key className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{lang === 'sw' ? 'Mihula ya Kuingia' : 'Authentication Sessions'}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-serif font-bold text-primary dark:text-white">{loading ? '...' : logins.length}</span>
              <span className="text-[11px] text-purple-500 font-mono font-bold uppercase flex items-center gap-0.5">
                <Clock className="w-3.5 h-3.5 animate-spin-slow" /> Synced
              </span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-3 truncate">
              {lang === 'sw' ? 'Oda na BV logs zilizothibitishwa' : 'Distributor dashboard entries registered'}
            </p>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-outline-variant/50 dark:border-primary-container/20 pb-1">
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'visitors', label: lang === 'sw' ? 'Trafiki ya Wanaotembelea' : 'Page Visitors Log', count: visitors.length },
              { id: 'signups', label: lang === 'sw' ? 'Wasajili Wapya (Signups)' : 'Member Signups', count: signups.length },
              { id: 'logins', label: lang === 'sw' ? 'Historia ya Kuingia (Logins)' : 'Login Session Audit', count: logins.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-t-xl text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary bg-secondary/5 dark:bg-secondary/5'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-on-surface-variant/10 text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab-driven search box */}
          <div className="w-full md:w-80">
            {activeTab === 'visitors' && (
              <div className="relative">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={visitorFilter}
                  onChange={(e) => setVisitorFilter(e.target.value)}
                  placeholder={lang === 'sw' ? 'Tafuta kifaa, lugha...' : 'Search visitor logs...'}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-tertiary border border-outline-variant dark:border-primary-container/30 rounded-xl text-xs focus:ring-1 focus:ring-secondary focus:outline-none focus:border-secondary"
                />
              </div>
            )}
            {activeTab === 'signups' && (
              <div className="relative">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupFilter}
                  onChange={(e) => setSignupFilter(e.target.value)}
                  placeholder={lang === 'sw' ? 'Tafuta kwa Jina, barua pepe...' : 'Search registrations...'}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-tertiary border border-outline-variant dark:border-primary-container/30 rounded-xl text-xs focus:ring-1 focus:ring-secondary focus:outline-none focus:border-secondary"
                />
              </div>
            )}
            {activeTab === 'logins' && (
              <div className="relative">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginFilter}
                  onChange={(e) => setLoginFilter(e.target.value)}
                  placeholder={lang === 'sw' ? 'Tafuta kwa barua pepe...' : 'Search session audits...'}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-tertiary border border-outline-variant dark:border-primary-container/30 rounded-xl text-xs focus:ring-1 focus:ring-secondary focus:outline-none focus:border-secondary"
                />
              </div>
            )}
          </div>

        </div>

        {/* Data View Rendering Section */}
        <div className="bg-white dark:bg-tertiary border border-outline-variant/60 dark:border-primary-container/20 rounded-2xl overflow-hidden shadow-sm">
          
          {/* error state */}
          {errorMessage && (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center animate-bounce mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-serif font-bold text-error">
                {lang === 'sw' ? 'Hitilafu ya Uidhinishaji' : 'Security Validation Warning'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md">
                {errorMessage}
              </p>
              <button
                onClick={onLogout}
                className="mt-2 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-full shadow transition-all duration-300 cursor-pointer"
              >
                {lang === 'sw' ? 'Ingia na Akaunti ya Msimamizi' : 'Relogin with Admin Credentials'}
              </button>
            </div>
          )}

          {/* loading state */}
          {!errorMessage && loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
              <p className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
                {lang === 'sw' ? 'Inapakia wasilisho la soko...' : 'Establishing Database Sync...'}
              </p>
            </div>
          )}

          {!errorMessage && !loading && activeTab === 'visitors' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-primary-container/23 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider border-b border-outline-variant/50">
                    <th className="px-6 py-4">{lang === 'sw' ? 'Kifaa cha Mtumiaji' : 'Anonymous Visitor ID'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Lugha' : 'Language'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Wakala (Browser Info)' : 'User Agent Details'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Muda ulioingia' : 'Timestamp'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 dark:divide-primary-container/20 text-xs">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">
                        {lang === 'sw' ? 'Hakuna kumbukumbu za wanaotembelea zilizopatikana.' : 'No matching page visitor logs recorded.'}
                      </td>
                    </tr>
                  ) : (
                    filteredVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-surface-container/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-[11px] font-semibold text-primary dark:text-secondary-fixed">
                          {v.visitorId}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            v.language === 'sw' 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-indigo-500/10 text-indigo-500'
                          }`}>
                            {v.language}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate font-mono text-[10px]" title={v.userAgent}>
                          {v.userAgent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-on-surface-variant/60" />
                            <span>{formatTime(v.visitedAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!errorMessage && !loading && activeTab === 'signups' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-primary-container/23 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider border-b border-outline-variant/50">
                    <th className="px-6 py-4">{lang === 'sw' ? 'Jina la Msambazaji' : 'Distributor Full Name'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Barua Pepe / Simu' : 'Credentials'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Kiwango' : 'Package Tier'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Siku Aliyosajiliwa' : 'Registration Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 dark:divide-primary-container/20 text-xs text-on-surface">
                  {filteredSignups.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">
                        {lang === 'sw' ? 'Hakuna wasambazaji waliojisajili bado.' : 'No registered stem cell distributors found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSignups.map((s) => (
                      <tr key={s.id} className="hover:bg-surface-container/20 transition-colors">
                        <td className="px-6 py-4 font-serif text-sm font-bold text-primary dark:text-white">
                          {s.fullName}
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                            <Mail className="w-3.5 h-3.5 text-secondary" />
                            <span>{s.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant/85">
                            <Phone className="w-3.5 h-3.5 text-secondary" />
                            <span>{s.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-widest ${
                            s.tier === 'silver' ? 'bg-slate-300/20 text-slate-500 dark:text-slate-300 border border-slate-500/10' :
                            s.tier === 'gold' ? 'bg-amber-400/15 text-yellow-600 border border-yellow-500/10' :
                            'bg-emerald-500/15 text-emerald-500 border border-emerald-500/10'
                          }`}>
                            {s.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-on-surface-variant/60" />
                            <span>{formatTime(s.signedUpAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!errorMessage && !loading && activeTab === 'logins' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-primary-container/23 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider border-b border-outline-variant/50">
                    <th className="px-6 py-4">{lang === 'sw' ? 'Barua Pepe Aliyeingia' : 'Authenticated Email'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Aina ya Kitendo' : 'Security Status'}</th>
                    <th className="px-6 py-4">{lang === 'sw' ? 'Muda Wakati wa Kuingia' : 'Login Time'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 dark:divide-primary-container/20 text-xs">
                  {filteredLogins.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-on-surface-variant">
                        {lang === 'sw' ? 'Hakuna kumbukumbu za kuingia bado.' : 'No login session events logged.'}
                      </td>
                    </tr>
                  ) : (
                    filteredLogins.map((l) => (
                      <tr key={l.id} className="hover:bg-surface-container/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-primary dark:text-secondary-fixed">
                          {l.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            AUTHORIZED
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-on-surface-variant/60" />
                            <span>{formatTime(l.loggedInAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Footer copyright */}
      <footer className="py-6 border-t border-outline-variant/30 text-center text-[10px] text-on-surface-variant/70 bg-surface-container dark:bg-transparent">
        <p>© {new Date().getFullYear()} RenoLife+ Biotech Tanzania. All Stem Cells Rights and Legacy Protected.</p>
      </footer>

    </div>
  );
}
