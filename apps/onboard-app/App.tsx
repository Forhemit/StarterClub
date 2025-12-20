import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { UserPlus, UserCheck, LayoutDashboard, Menu, X, FileText, ClipboardList, Monitor, Loader2, Home } from 'lucide-react';
import { NewMemberFlow, MemberFlow, QuickLogFlow, KioskFlow } from './components/Flows';
import { Dashboard } from './components/Dashboard';
import { VisitorLogs } from './components/VisitorLogs';
import { APP_NAME, MARKETING_WEBSITE_URL } from './constants';
import { db } from './services/database';
import { VisitRecord, Member } from './types';

enum ViewState {
  HOME = 'HOME',
  NEW_GUEST = 'NEW_GUEST',
  MEMBER_CHECKIN = 'MEMBER_CHECKIN',
  QUICK_LOG = 'QUICK_LOG',
  DASHBOARD = 'DASHBOARD',
  LOGS = 'LOGS',
  KIOSK = 'KIOSK'
}

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [showMenu, setShowMenu] = useState(false);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Initial Data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [v, m] = await Promise.all([db.getVisits(), db.getMembers()]);
      setVisits(v);
      setMembers(m);
      setLoading(false);
    };
    init();
  }, []); // Reload on view change? Maybe interval?

  // Refresh handler passed to flows?
  const refreshData = async () => {
    const v = await db.getVisits();
    setVisits(v);
    // Members usually static, but maybe refresh too
    const m = await db.getMembers();
    setMembers(m);
  };

  const onFlowComplete = () => {
    refreshData();
    setView(ViewState.HOME);
  };

  // --- PIN LOGIC ---
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pendingView, setPendingView] = useState<ViewState | null>(null);

  const handleNav = (v: ViewState) => {
    // Protected Routes
    if (v === ViewState.DASHBOARD || v === ViewState.LOGS || v === ViewState.QUICK_LOG) {
      setPendingView(v);
      setIsPinOpen(true);
      setShowMenu(false);
      return;
    }
    // Public Routes
    setView(v);
    setShowMenu(false);
  };

  const verifyPin = () => {
    // Simple client-side guard. In production, use Clerk or server validation.
    // Default PIN: 9999
    if (pinInput === "9999") {
      if (pendingView) setView(pendingView);
      setIsPinOpen(false);
      setPinInput("");
      setPendingView(null);
      return;
    }
    alert("Incorrect PIN");
    setPinInput("");
  };

  const renderContent = () => {
    if (loading && visits.length === 0) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    switch (view) {
      case ViewState.NEW_GUEST:
        return <NewMemberFlow onComplete={onFlowComplete} onCancel={() => setView(ViewState.HOME)} members={members} />;
      case ViewState.MEMBER_CHECKIN:
        return <MemberFlow onComplete={onFlowComplete} onCancel={() => setView(ViewState.HOME)} members={members} />;
      case ViewState.QUICK_LOG:
        return <QuickLogFlow onComplete={onFlowComplete} onCancel={() => setView(ViewState.HOME)} />;
      case ViewState.DASHBOARD:
        return <Dashboard visits={visits} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.LOGS:
        return <VisitorLogs onBack={() => setView(ViewState.HOME)} visits={visits} members={members} />;
      case ViewState.KIOSK:
        return <KioskFlow onUnlock={() => setView(ViewState.HOME)} members={members} onComplete={refreshData} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full pt-24 pb-8 px-8 animate-in fade-in duration-500 overflow-y-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-2 text-center">
              Welcome to the <span className="text-blue-600">Starter Club</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 text-center max-w-lg">
              We help you start whatever your goals are.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
              <button
                onClick={() => setView(ViewState.NEW_GUEST)}
                className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500 text-left h-72 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <UserPlus size={120} />
                </div>
                <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600">
                  <UserPlus size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">I'm New Here</h2>
                  <p className="text-slate-500 text-base leading-snug">Start your journey with a tour and onboarding.</p>
                </div>
              </button>

              <button
                onClick={() => setView(ViewState.MEMBER_CHECKIN)}
                className="group relative overflow-hidden bg-blue-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-left h-72 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-white">
                  <UserCheck size={120} />
                </div>
                <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">I'm a Member</h2>
                  <p className="text-blue-100 text-base leading-snug">Scan in, book a room, or just hang out.</p>
                </div>
              </button>

              <button
                onClick={() => handleNav(ViewState.QUICK_LOG)}
                className="group relative overflow-hidden bg-slate-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-left h-72 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-white">
                  <ClipboardList size={120} />
                </div>
                <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                  <ClipboardList size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Quick Log</h2>
                  <p className="text-slate-400 text-base leading-snug">Staff Only: Deliveries, vendors, and maintenance.</p>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">

      {/* Header / Nav - Hidden in Kiosk Mode */}
      {view !== ViewState.KIOSK && (
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-slate-50/90 backdrop-blur-sm">
          <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            {APP_NAME}
          </div>

          {view === ViewState.HOME && (
            <button onClick={() => setShowMenu(true)} className="p-2 hover:bg-slate-200 rounded-lg transition">
              <Menu size={24} className="text-slate-700" />
            </button>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative z-0">
        {renderContent()}
      </main>

      {/* Slide-out Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl p-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg">Menu</h3>
              <button onClick={() => setShowMenu(false)}><X /></button>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => handleNav(ViewState.HOME)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 flex items-center gap-3"
              >
                <UserPlus size={20} /> Reception Kiosk
              </button>
              <button
                onClick={() => handleNav(ViewState.DASHBOARD)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 flex items-center gap-3"
              >
                <LayoutDashboard size={20} /> Manager Dashboard
              </button>
              <button
                onClick={() => handleNav(ViewState.LOGS)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 flex items-center gap-3"
              >
                <FileText size={20} /> Visitor Logs
              </button>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleNav(ViewState.KIOSK)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-3 shadow-lg shadow-slate-200"
                >
                  <Monitor size={20} /> Enter Kiosk Mode
                </button>
              </div>
            </nav>
            <div className="absolute bottom-6 left-6 right-6 space-y-4">
              <a
                href={MARKETING_WEBSITE_URL}
                className="w-full text-center px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-600 text-sm"
              >
                <Home size={16} /> Back to Website
              </a>
              <p className="text-xs text-slate-400 text-center">Version 1.0.1<br />Supabase Connected</p>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {isPinOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">Staff Access Required</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Please enter your PIN to continue.</p>
            <div className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full text-center text-3xl tracking-widest border-b-2 border-slate-200 focus:border-blue-500 outline-none pb-2 font-mono"
                maxLength={4}
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { setIsPinOpen(false); setPinInput(""); setPendingView(null); }}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPin}
                  disabled={pinInput.length < 4}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}