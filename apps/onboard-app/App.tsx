import React, { useState } from 'react';
import { UserPlus, UserCheck, LayoutDashboard, Menu, X, FileText, ClipboardList, Monitor } from 'lucide-react';
import { NewMemberFlow, MemberFlow, QuickLogFlow, KioskFlow } from './components/Flows';
import { Dashboard } from './components/Dashboard';
import { VisitorLogs } from './components/VisitorLogs';
import { APP_NAME } from './constants';
import { db } from './services/mockDatabase';

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

  // Auto-close menu on selection
  const handleNav = (v: ViewState) => {
    setView(v);
    setShowMenu(false);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.NEW_GUEST:
        return <NewMemberFlow onComplete={() => setView(ViewState.HOME)} onCancel={() => setView(ViewState.HOME)} />;
      case ViewState.MEMBER_CHECKIN:
        return <MemberFlow onComplete={() => setView(ViewState.HOME)} onCancel={() => setView(ViewState.HOME)} />;
      case ViewState.QUICK_LOG:
        return <QuickLogFlow onComplete={() => setView(ViewState.HOME)} onCancel={() => setView(ViewState.HOME)} />;
      case ViewState.DASHBOARD:
        return <Dashboard visits={db.getVisits()} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.LOGS:
        return <VisitorLogs onBack={() => setView(ViewState.HOME)} />;
      case ViewState.KIOSK:
        return <KioskFlow onUnlock={() => setView(ViewState.HOME)} />;
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
                onClick={() => setView(ViewState.QUICK_LOG)}
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
                  <Menu size={24} className="text-slate-700"/>
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
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs text-slate-400 text-center">Version 1.0.0<br/>Internal Use Only</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}