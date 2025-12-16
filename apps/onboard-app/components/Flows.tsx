import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, UserCheck, Briefcase, MapPin, CheckCircle, 
  CreditCard, Calendar, ArrowRight, X, ScanLine, Loader2, Info,
  Users, Search, MessageSquare, BellRing, ClipboardList, Truck, 
  Hammer, User, FileText, Package, ArrowLeft, Gift, Clock, Lock, QrCode, Camera, Zap, Coffee, Monitor
} from 'lucide-react';
import { Member, ResourceType, VisitType, WorkGoal, MemberIntent } from '../types';
import { RESOURCE_PRICES, APP_NAME, ROOM_CATEGORIES, RoomOption } from '../constants';
import { db } from '../services/mockDatabase';
import * as GeminiService from '../services/geminiService';

// --- Shared UI ---
const StepContainer = ({ children, title }: React.PropsWithChildren<{ title: string }>) => (
  <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">{title}</h2>
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      {children}
    </div>
  </div>
);

const Button = ({ onClick, children, variant = 'primary', className = '', disabled=false }: any) => {
  const base = "w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-blue-300",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600",
    outline: "border-2 border-slate-300 text-slate-500 hover:text-slate-700",
    green: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-red-200"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}>
      {children}
    </button>
  );
};

// --- Member Flow (Staff Assisted) ---

interface MemberFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const MemberFlow: React.FC<MemberFlowProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [lookupMode, setLookupMode] = useState<'SCAN' | 'MANUAL'>('SCAN');
  
  // Manual Lookup State
  const [manualId, setManualId] = useState('');
  const [manualLast, setManualLast] = useState('');
  const [lookupError, setLookupError] = useState('');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [intent, setIntent] = useState<MemberIntent>(MemberIntent.WORK);
  const [resource, setResource] = useState<RoomOption | null>(null);
  const [duration, setDuration] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleManualLookup = () => {
    const member = db.findMember(manualId, manualLast);
    if (member) {
        setSelectedMember(member);
        setStep(2);
        setLookupError('');
    } else {
        setLookupError('Member not found. Please check ID/Phone and Last Name.');
    }
  };

  const handleCheckIn = async () => {
    if (!selectedMember) return;
    setIsProcessing(true);

    const price = resource ? resource.price * duration : 0;
    
    db.addVisit({
        type: VisitType.MEMBER_VISIT,
        memberId: selectedMember.id,
        intent,
        resourceUsed: resource ? (resource.name as ResourceType) : ResourceType.NONE,
        resourceDurationHours: resource ? duration : 0,
        paymentCollected: price,
    });

    setIsProcessing(false);
    onComplete();
  };

  // Step 1: Identify
  if (step === 1) {
    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full mb-6">
              <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
                  <X size={20} /> Cancel
              </button>
          </div>
          <StepContainer title="Member Check-in">
              <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
                  <button 
                    onClick={() => setLookupMode('SCAN')}
                    className={`flex-1 py-2 font-semibold rounded-lg transition-colors ${lookupMode === 'SCAN' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                      Scan QR
                  </button>
                  <button 
                    onClick={() => setLookupMode('MANUAL')}
                    className={`flex-1 py-2 font-semibold rounded-lg transition-colors ${lookupMode === 'MANUAL' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                      Manual Entry
                  </button>
              </div>

              {lookupMode === 'SCAN' ? (
                <div className="text-center py-8">
                     <div className="bg-slate-100 rounded-2xl p-8 mb-6 inline-block">
                        <ScanLine size={64} className="text-slate-400" />
                     </div>
                     <p className="text-slate-500 mb-6">Simulating scanner...</p>
                     <div className="grid grid-cols-1 gap-2">
                        {db.getMembers().slice(0, 3).map(m => (
                            <button key={m.id} onClick={() => { setSelectedMember(m); setStep(2); }} className="p-3 bg-slate-50 rounded-lg text-left hover:bg-slate-100 flex items-center gap-3">
                                <img src={m.photoUrl} className="w-8 h-8 rounded-full" />
                                <div>
                                    <div className="font-bold text-sm">{m.firstName} {m.lastName}</div>
                                    <div className="text-xs text-slate-500">{m.id}</div>
                                </div>
                            </button>
                        ))}
                     </div>
                </div>
              ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Member ID or Phone</label>
                        <input 
                            type="text" 
                            className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="M001 or 555-0101"
                            value={manualId}
                            onChange={(e) => setManualId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input 
                            type="text" 
                            className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Doe"
                            value={manualLast}
                            onChange={(e) => setManualLast(e.target.value)}
                        />
                    </div>
                    {lookupError && <p className="text-red-500 text-sm font-medium">{lookupError}</p>}
                    <Button onClick={handleManualLookup} disabled={!manualId || !manualLast}>
                        Verify Member
                    </Button>
                </div>
              )}
          </StepContainer>
        </div>
    );
  }

  // Step 2: Purpose
  if (step === 2) {
    return (
       <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
         <StepContainer title={`Welcome, ${selectedMember?.firstName}!`}>
             <p className="text-center text-slate-500 mb-8 text-lg">What's the mission today?</p>
             <div className="grid grid-cols-1 gap-4">
                 <button 
                     onClick={() => { setIntent(MemberIntent.WORK); setStep(3); }}
                     className="p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 text-left group"
                 >
                     <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                     <div>
                         <h3 className="font-bold text-slate-800 text-lg">Need to get work done</h3>
                         <p className="text-slate-500 text-sm">Focus time, deadlines, deep work</p>
                     </div>
                 </button>

                 <button 
                     onClick={() => { setIntent(MemberIntent.WORK); setStep(3); }}
                     className="p-6 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 text-left group"
                 >
                     <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:scale-110 transition-transform"><Monitor size={24} /></div>
                     <div>
                         <h3 className="font-bold text-slate-800 text-lg">Create / Build</h3>
                         <p className="text-slate-500 text-sm">Design, dev, content creation</p>
                     </div>
                 </button>

                 <button 
                    onClick={() => { setIntent(MemberIntent.WORK); setStep(3); }}
                    className="p-6 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4 text-left group"
                 >
                     <div className="bg-orange-100 p-4 rounded-full text-orange-600 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                     <div>
                         <h3 className="font-bold text-slate-800 text-lg">Collaborate / Meet</h3>
                         <p className="text-slate-500 text-sm">Team work, client meetings</p>
                     </div>
                 </button>

                 <button 
                     onClick={() => { setIntent(MemberIntent.HANG_OUT); handleCheckIn(); }}
                     className="p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-4 text-left group"
                 >
                     <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 group-hover:scale-110 transition-transform"><Coffee size={24} /></div>
                     <div>
                         <h3 className="font-bold text-slate-800 text-lg">Hang Out / Recharge</h3>
                         <p className="text-slate-500 text-sm">Social, network, reset (No Booking)</p>
                     </div>
                 </button>
             </div>
         </StepContainer>
       </div>
    );
  }

  // Step 3: Room Selection & Booking
  return (
      <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full mb-6">
            <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} /> Back to Purpose
            </button>
        </div>
        <StepContainer title="Select a Space">
            <div className="space-y-8">
                {Object.entries(ROOM_CATEGORIES).map(([category, rooms]) => (
                    <div key={category}>
                        <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-3">{category}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {rooms.map((r) => (
                                <button 
                                    key={r.id}
                                    onClick={() => setResource(r)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${resource?.id === r.id ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500' : 'border-slate-100 hover:border-slate-300'}`}
                                >
                                    <div>
                                        <div className="font-bold text-slate-800">{r.name}</div>
                                        <div className="text-sm text-slate-500">{r.description}</div>
                                    </div>
                                    <div className="font-semibold text-slate-700">
                                        {r.price === 0 ? 'Free' : `$${r.price}/hr`}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {resource && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in slide-in-from-bottom-2">
                        <h4 className="font-bold text-slate-800 mb-4 flex justify-between">
                            Booking Details
                            <span className="text-blue-600">{resource.name}</span>
                        </h4>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setDuration(Math.max(1, duration - 0.5))} className="w-10 h-10 rounded-lg bg-white border hover:bg-slate-100 font-bold">-</button>
                                <span className="text-xl font-bold w-16 text-center">{duration}h</span>
                                <button onClick={() => setDuration(duration + 0.5)} className="w-10 h-10 rounded-lg bg-white border hover:bg-slate-100 font-bold">+</button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                            <div className="text-slate-500">Total</div>
                            <div className="text-3xl font-bold text-slate-900">${(resource.price * duration).toFixed(2)}</div>
                        </div>
                    </div>
                )}
                
                <Button onClick={handleCheckIn} disabled={isProcessing || !resource}>
                    {isProcessing ? <><Loader2 className="animate-spin" /> Processing...</> : `Confirm Booking & Check-in`}
                </Button>
            </div>
        </StepContainer>
      </div>
  );
};

// --- Kiosk Flow (Self-Service) ---

interface KioskFlowProps {
  onUnlock: () => void;
}

export const KioskFlow: React.FC<KioskFlowProps> = ({ onUnlock }) => {
  const [step, setStep] = useState<'WELCOME' | 'MEMBER_AUTH' | 'GUEST_TYPE' | 'GUEST_FORM' | 'MEMBER_PURPOSE' | 'BOOKING' | 'CONFIRM' | 'SUCCESS'>('WELCOME');
  
  // Member Auth State
  const [authMode, setAuthMode] = useState<'SCAN' | 'MANUAL'>('SCAN');
  const [isScanning, setIsScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [manualLast, setManualLast] = useState('');
  const [authError, setAuthError] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  
  // Flow Path State
  const [intentType, setIntentType] = useState<'QUICK' | 'BOOK'>('QUICK');
  
  // Guest State
  const [guestType, setGuestType] = useState<'TOUR' | 'APPT' | 'QUICK' | 'OTHER'>('TOUR');
  const [guestName, setGuestName] = useState({ first: '', last: '' });
  const [guestHost, setGuestHost] = useState('');

  // Booking State
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [duration, setDuration] = useState(1);

  // Staff Unlock State
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStep('WELCOME');
      setShowPassword(false);
      setPassword('');
      setManualId('');
      setManualLast('');
      setGuestName({ first: '', last: '' });
    }, 60000);
  };

  useEffect(() => {
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    resetTimer();
    return () => {
        window.removeEventListener('click', resetTimer);
        window.removeEventListener('touchstart', resetTimer);
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleUnlockSubmit = () => {
    if (password === 'StartClub!2026') onUnlock();
    else setError('Incorrect password');
  };

  const handleMemberAuth = () => {
      if (authMode === 'MANUAL') {
        const m = db.findMember(manualId, manualLast);
        if (m) {
            setMember(m);
            if (intentType === 'QUICK') {
                completeMemberCheckIn(m, null);
            } else {
                setStep('MEMBER_PURPOSE');
            }
        } else {
            setAuthError('Member not found. Please try again.');
        }
      } else {
          // Simulated Scan
          setIsScanning(true);
          setTimeout(() => {
              const m = db.getMembers()[0]; // Simulating match
              setMember(m);
              setIsScanning(false);
               if (intentType === 'QUICK') {
                completeMemberCheckIn(m, null);
            } else {
                setStep('MEMBER_PURPOSE');
            }
          }, 2000);
      }
  };

  const completeMemberCheckIn = (m: Member, room: RoomOption | null) => {
      db.addVisit({
        type: VisitType.MEMBER_VISIT,
        memberId: m.id,
        intent: room ? MemberIntent.WORK : MemberIntent.HANG_OUT,
        resourceUsed: room ? (room.name as ResourceType) : ResourceType.NONE,
        resourceDurationHours: room ? duration : 0,
        paymentCollected: room ? room.price * duration : 0
      });
      setStep('SUCCESS');
      setTimeout(() => setStep('WELCOME'), 4000);
  };

  const handleGuestSubmit = () => {
      db.addVisit({
        type: VisitType.NEW_GUEST,
        resourceUsed: ResourceType.NONE,
        resourceDurationHours: 0,
        paymentCollected: 0,
        guestProfile: {
            firstName: guestName.first,
            lastName: guestName.last,
            phone: '',
            address: '',
            goal: guestType === 'TOUR' ? 'Tour Request' : (guestType === 'APPT' ? `Meeting: ${guestHost}` : 'Quick Visit'),
            tourAccepted: guestType === 'TOUR'
        }
      });
      setStep('SUCCESS');
      setTimeout(() => setStep('WELCOME'), 4000);
  };

  // --- Kiosk Screens ---

  if (showPassword) return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-4">Staff Unlock</h3>
              <input type="password" placeholder="Password" className="w-full p-4 border rounded-xl mb-4" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-3"><Button variant="secondary" onClick={() => setShowPassword(false)}>Cancel</Button><Button onClick={handleUnlockSubmit}>Unlock</Button></div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-blue-900 to-purple-900"></div>
        <div className="w-full max-w-5xl relative z-10">
            
            {step === 'WELCOME' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl font-extrabold text-white text-center mb-12">Welcome to {APP_NAME}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button onClick={() => { setIntentType('QUICK'); setStep('MEMBER_AUTH'); }} className="h-72 bg-blue-600 hover:bg-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-xl">
                            <div className="bg-white/20 p-6 rounded-full"><Zap size={48} className="text-white" /></div>
                            <div className="text-center text-white"><h2 className="text-2xl font-bold">Quick Check-in</h2><p className="opacity-80">Members only</p></div>
                        </button>
                        <button onClick={() => { setIntentType('BOOK'); setStep('MEMBER_AUTH'); }} className="h-72 bg-purple-600 hover:bg-purple-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-xl">
                            <div className="bg-white/20 p-6 rounded-full"><Calendar size={48} className="text-white" /></div>
                            <div className="text-center text-white"><h2 className="text-2xl font-bold">Book Space</h2><p className="opacity-80">Reserve a room</p></div>
                        </button>
                        <button onClick={() => setStep('GUEST_TYPE')} className="h-72 bg-emerald-600 hover:bg-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-xl">
                            <div className="bg-white/20 p-6 rounded-full"><UserPlus size={48} className="text-white" /></div>
                            <div className="text-center text-white"><h2 className="text-2xl font-bold">I'm New Here</h2><p className="opacity-80">Guest / Visitor</p></div>
                        </button>
                    </div>
                </div>
            )}

            {step === 'MEMBER_AUTH' && (
                <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
                    <h2 className="text-2xl font-bold text-center mb-6">Member Authentication</h2>
                    <div className="flex gap-2 mb-6">
                        <button onClick={() => setAuthMode('SCAN')} className={`flex-1 py-3 rounded-xl font-bold ${authMode === 'SCAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Scan QR</button>
                        <button onClick={() => setAuthMode('MANUAL')} className={`flex-1 py-3 rounded-xl font-bold ${authMode === 'MANUAL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Manual Entry</button>
                    </div>

                    {authMode === 'SCAN' ? (
                        <div className="text-center py-6">
                             {isScanning ? (
                                <div className="animate-pulse"><ScanLine size={80} className="mx-auto text-blue-500 mb-4"/><p>Scanning...</p></div>
                             ) : (
                                <div onClick={handleMemberAuth} className="cursor-pointer"><QrCode size={80} className="mx-auto text-slate-300 mb-4"/><Button>Tap to Simulate Scan</Button></div>
                             )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input type="text" placeholder="Member ID or Phone" className="w-full p-4 border rounded-xl" value={manualId} onChange={e => setManualId(e.target.value)} />
                            <input type="text" placeholder="Last Name" className="w-full p-4 border rounded-xl" value={manualLast} onChange={e => setManualLast(e.target.value)} />
                            {authError && <p className="text-red-500">{authError}</p>}
                            <Button onClick={handleMemberAuth}>Check In</Button>
                        </div>
                    )}
                    <button onClick={() => setStep('WELCOME')} className="w-full mt-4 text-slate-400">Cancel</button>
                </div>
            )}

            {step === 'MEMBER_PURPOSE' && (
                <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95">
                    <h2 className="text-2xl font-bold text-center mb-6">What brings you in?</h2>
                    <div className="grid grid-cols-2 gap-4">
                         {['Need to Focus', 'Collaborate', 'Create / Build', 'Business Admin'].map(p => (
                             <button key={p} onClick={() => setStep('BOOKING')} className="p-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-500 rounded-xl text-center font-bold text-slate-700 transition-all">{p}</button>
                         ))}
                    </div>
                     <button onClick={() => setStep('WELCOME')} className="w-full mt-6 text-slate-400">Cancel</button>
                </div>
            )}

            {step === 'BOOKING' && (
                 <div className="bg-white rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl animate-in zoom-in-95 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Select a Workspace</h2>
                        <button onClick={() => setStep('MEMBER_PURPOSE')} className="text-slate-400 hover:text-slate-600"><X /></button>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(ROOM_CATEGORIES).map(([cat, rooms]) => (
                            <div key={cat}>
                                <h3 className="font-bold text-slate-400 text-sm uppercase mb-2">{cat}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {rooms.map(r => (
                                        <button key={r.id} onClick={() => setSelectedRoom(r)} className={`p-4 rounded-xl border-2 text-left ${selectedRoom?.id === r.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}>
                                            <div className="font-bold">{r.name}</div>
                                            <div className="text-sm text-slate-500">{r.price > 0 ? `$${r.price}/hr` : 'Included'}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedRoom && (
                        <div className="mt-8 pt-6 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <div><span className="font-bold text-slate-700">Duration:</span> {duration}h</div>
                                <div className="flex gap-2"><button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-8 h-8 bg-slate-100 rounded">-</button><button onClick={() => setDuration(duration + 1)} className="w-8 h-8 bg-slate-100 rounded">+</button></div>
                            </div>
                            <Button onClick={() => completeMemberCheckIn(member!, selectedRoom)}>Confirm Booking (${selectedRoom.price * duration})</Button>
                        </div>
                    )}
                 </div>
            )}

            {step === 'GUEST_TYPE' && (
                <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
                    <h2 className="text-2xl font-bold text-center mb-6">How can we help?</h2>
                    <div className="space-y-4">
                        <button onClick={() => { setGuestType('TOUR'); setStep('GUEST_FORM'); }} className="w-full p-4 border-2 rounded-xl text-left font-bold hover:bg-blue-50 hover:border-blue-500">🏆 Tour & Membership Info</button>
                        <button onClick={() => { setGuestType('APPT'); setStep('GUEST_FORM'); }} className="w-full p-4 border-2 rounded-xl text-left font-bold hover:bg-blue-50 hover:border-blue-500">📅 Scheduled Appointment</button>
                        <button onClick={() => { setGuestType('QUICK'); setStep('GUEST_FORM'); }} className="w-full p-4 border-2 rounded-xl text-left font-bold hover:bg-blue-50 hover:border-blue-500">📦 Quick Visit / Drop-off</button>
                    </div>
                    <button onClick={() => setStep('WELCOME')} className="w-full mt-6 text-slate-400">Cancel</button>
                </div>
            )}

            {step === 'GUEST_FORM' && (
                 <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
                    <h2 className="text-2xl font-bold text-center mb-6">Visitor Details</h2>
                    <div className="space-y-4">
                        <input type="text" placeholder="First Name" className="w-full p-4 border rounded-xl" value={guestName.first} onChange={e => setGuestName({...guestName, first: e.target.value})} />
                        <input type="text" placeholder="Last Name" className="w-full p-4 border rounded-xl" value={guestName.last} onChange={e => setGuestName({...guestName, last: e.target.value})} />
                        {guestType === 'APPT' && (
                            <input type="text" placeholder="Who are you meeting?" className="w-full p-4 border rounded-xl" value={guestHost} onChange={e => setGuestHost(e.target.value)} />
                        )}
                        <Button onClick={handleGuestSubmit} disabled={!guestName.first || !guestName.last}>
                            {guestType === 'TOUR' ? 'Notify Concierge' : 'Check In'}
                        </Button>
                    </div>
                    <button onClick={() => setStep('GUEST_TYPE')} className="w-full mt-6 text-slate-400">Back</button>
                 </div>
            )}

            {step === 'SUCCESS' && (
                <div className="bg-white rounded-3xl p-12 max-w-xl mx-auto text-center shadow-2xl animate-in zoom-in-95">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">You're All Set!</h2>
                    <p className="text-slate-500 text-lg">Have a great visit.</p>
                </div>
            )}
        </div>
        <button onClick={() => setShowPassword(true)} className="absolute bottom-8 right-8 p-4 text-white/20 hover:text-white/80 transition-colors rounded-full hover:bg-white/10"><Lock size={24} /></button>
    </div>
  );
};

// --- Quick Log Flow ---

interface QuickLogFlowProps {
    onComplete: () => void;
    onCancel: () => void;
}

export const QuickLogFlow: React.FC<QuickLogFlowProps> = ({ onComplete, onCancel }) => {
    const [view, setView] = useState<'MAIN' | 'OTHER' | 'FORM_GUEST' | 'FORM_VENDOR'>('MAIN');
    const [customReason, setCustomReason] = useState('');

    // Specific Form State
    const [guestForm, setGuestForm] = useState({ firstName: '', lastName: '', hostFirstName: '', hostLastName: '' });
    const [vendorForm, setVendorForm] = useState({ company: '', repName: '' });

    const handleLog = (description: string) => {
        db.addVisit({
            type: VisitType.QUICK_LOG,
            resourceUsed: ResourceType.NONE,
            resourceDurationHours: 0,
            paymentCollected: 0,
            workDescription: description 
        });
        onComplete();
    };

    const handleGuestSubmit = () => {
        const desc = `Scheduled Guest: ${guestForm.firstName} ${guestForm.lastName} visiting ${guestForm.hostFirstName} ${guestForm.hostLastName}`;
        handleLog(desc);
    };

    const handleVendorSubmit = () => {
        const desc = `Vendor: ${vendorForm.company}${vendorForm.repName ? ` (${vendorForm.repName})` : ''}`;
        handleLog(desc);
    };

    const LogButton = ({ label, icon: Icon, onClick }: { label: string, icon: any, onClick: () => void }) => (
        <button 
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-200 rounded-2xl transition-all group h-32"
        >
            <div className="bg-white p-3 rounded-full shadow-sm text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <span className="font-bold text-slate-700 group-hover:text-blue-800">{label}</span>
        </button>
    );

    // --- Views ---

    if (view === 'FORM_GUEST') {
        return (
            <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full mb-6">
                    <button onClick={() => setView('MAIN')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> Back to Options
                    </button>
                </div>
                <StepContainer title="Scheduled Guest Details">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Guest First Name</label>
                                <input 
                                    type="text" 
                                    className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Jane"
                                    value={guestForm.firstName}
                                    onChange={e => setGuestForm({...guestForm, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Guest Last Name</label>
                                <input 
                                    type="text" 
                                    className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Doe"
                                    value={guestForm.lastName}
                                    onChange={e => setGuestForm({...guestForm, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Visiting</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Host First Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Host First"
                                        value={guestForm.hostFirstName}
                                        onChange={e => setGuestForm({...guestForm, hostFirstName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Host Last Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Host Last"
                                        value={guestForm.hostLastName}
                                        onChange={e => setGuestForm({...guestForm, hostLastName: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleGuestSubmit} 
                            disabled={!guestForm.firstName || !guestForm.lastName || !guestForm.hostFirstName || !guestForm.hostLastName}
                        >
                            Log Guest Entry
                        </Button>
                    </div>
                </StepContainer>
            </div>
        );
    }

    if (view === 'FORM_VENDOR') {
        return (
            <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full mb-6">
                    <button onClick={() => setView('OTHER')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> Back to Options
                    </button>
                </div>
                <StepContainer title="Vendor Log Details">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company / Vendor Name</label>
                            <input 
                                type="text" 
                                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. ACME Catering, City Plumbing"
                                value={vendorForm.company}
                                onChange={e => setVendorForm({...vendorForm, company: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Representative Name (Optional)</label>
                            <input 
                                type="text" 
                                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Driver/Rep Name"
                                value={vendorForm.repName}
                                onChange={e => setVendorForm({...vendorForm, repName: e.target.value})}
                            />
                        </div>

                        <Button onClick={handleVendorSubmit} disabled={!vendorForm.company}>
                            Log Vendor Entry
                        </Button>
                    </div>
                </StepContainer>
            </div>
        );
    }

    // Default Main View
    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full mb-6">
                <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
                    <X size={20} /> Cancel Log
                </button>
            </div>

            <StepContainer title={view === 'MAIN' ? "Quick Log Entry" : "Other Log Options"}>
                {view === 'MAIN' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <LogButton label="Delivery" icon={Truck} onClick={() => handleLog('Delivery')} />
                        <LogButton label="Employee" icon={User} onClick={() => handleLog('Employee')} />
                        <LogButton label="Scheduled Guest" icon={Calendar} onClick={() => setView('FORM_GUEST')} />
                        <LogButton label="Contractor" icon={Hammer} onClick={() => handleLog('Contractor')} />
                        <LogButton label="Other..." icon={ClipboardList} onClick={() => setView('OTHER')} />
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                         <button onClick={() => setView('MAIN')} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
                            <ArrowLeft size={16} /> Back to main options
                        </button>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <LogButton label="Courier / Pkg" icon={Package} onClick={() => handleLog('Courier / Package Drop-off')} />
                            <LogButton label="Candidate" icon={Users} onClick={() => handleLog('Interview Candidate')} />
                            <LogButton label="Maintenance" icon={Hammer} onClick={() => handleLog('Maintenance')} />
                            <LogButton label="Personal Guest" icon={UserCheck} onClick={() => handleLog('Personal Guest')} />
                            <LogButton label="Vendor" icon={Briefcase} onClick={() => setView('FORM_VENDOR')} />
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                             <label className="block text-sm font-medium text-slate-700 mb-2">Custom Reason</label>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Type details..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && customReason && handleLog(customReason)}
                                />
                                <Button className="!w-auto px-6" onClick={() => handleLog(customReason)} disabled={!customReason}>
                                    Log
                                </Button>
                             </div>
                        </div>
                    </div>
                )}
            </StepContainer>
        </div>
    );
};

// --- New Member Flow (Restored) ---

type VisitReason = 'ONBOARDING' | 'MEETUP' | 'GUEST' | 'OTHER' | null;

export const NewMemberFlow: React.FC<{ onComplete: () => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [visitReason, setVisitReason] = useState<VisitReason>(null);
  
  // Specific data for reasons
  const [meetupName, setMeetupName] = useState('');
  const [hostSearch, setHostSearch] = useState('');
  const [foundHosts, setFoundHosts] = useState<Member[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [hostNotified, setHostNotified] = useState(false);
  
  // Concierge Handoff
  const [simpleName, setSimpleName] = useState({ firstName: '', lastName: '' });
  const [tourType, setTourType] = useState<string | null>(null);

  const handleHostSearch = () => {
      const results = db.getMembers().filter(m => 
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(hostSearch.toLowerCase())
      );
      setFoundHosts(results);
      setHostNotified(false);
  };

  const notifyHost = (member: Member) => {
      setHostNotified(true);
  };

  const handleQuickVisitComplete = (type: string, details: string) => {
      db.addVisit({
          type: VisitType.NEW_GUEST,
          resourceUsed: ResourceType.NONE,
          resourceDurationHours: 0,
          paymentCollected: 0,
          guestProfile: {
              firstName: 'Guest',
              lastName: 'Visitor',
              phone: '',
              address: '',
              goal: `${type}: ${details}`,
              tourAccepted: false
          }
      });
      onComplete();
  };

  const notifyConcierge = () => {
      db.addVisit({
          type: VisitType.NEW_GUEST,
          resourceUsed: ResourceType.NONE,
          resourceDurationHours: 0,
          paymentCollected: 0,
          guestProfile: {
              firstName: simpleName.firstName,
              lastName: simpleName.lastName,
              phone: '',
              address: '',
              goal: 'New Member Inquiry - Waiting for Concierge Tour',
              onboardingNotes: tourType ? `Requested Tour Duration: ${tourType}` : undefined,
              tourAccepted: true
          }
      });
      onComplete();
  };

  // Step 1: Selection
  if (step === 1) {
      return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
             <div className="max-w-2xl mx-auto w-full mb-6">
                <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
                    <X size={20} /> Cancel Check-in
                </button>
            </div>
            
            <StepContainer title="Welcome! What brings you in?">
                {!visitReason ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => { setVisitReason('ONBOARDING'); setStep(2); }}
                            className="p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-4 text-center group"
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserPlus size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Interested in Membership</h3>
                                <p className="text-sm text-slate-500 mt-1">Take a tour and learn about the club</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => setVisitReason('MEETUP')}
                            className="p-6 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center gap-4 text-center group"
                        >
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Attending a Meetup</h3>
                                <p className="text-sm text-slate-500 mt-1">Check in for an event</p>
                            </div>
                        </button>

                         <button 
                            onClick={() => setVisitReason('GUEST')}
                            className="p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center gap-4 text-center group"
                        >
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserCheck size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Visiting a Guest</h3>
                                <p className="text-sm text-slate-500 mt-1">Meeting a current member</p>
                            </div>
                        </button>

                         <button 
                            onClick={() => setVisitReason('OTHER')}
                            className="p-6 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-4 text-center group"
                        >
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Info size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Other</h3>
                                <p className="text-sm text-slate-500 mt-1">Deliveries, inquiries, etc.</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <button onClick={() => { setVisitReason(null); setFoundHosts([]); setHostNotified(false); }} className="mb-6 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                            <ArrowLeft size={16} /> Back to selection
                        </button>

                        {visitReason === 'MEETUP' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Which meetup are you here for?</label>
                                    <input 
                                        type="text"
                                        autoFocus
                                        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Tech Founders Mixer"
                                        value={meetupName}
                                        onChange={(e) => setMeetupName(e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => handleQuickVisitComplete('Meetup', meetupName)} disabled={!meetupName}>
                                    Check In
                                </Button>
                            </div>
                        )}

                        {visitReason === 'GUEST' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Who are you visiting?</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            autoFocus
                                            className="flex-1 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Member's Name"
                                            value={hostSearch}
                                            onChange={(e) => setHostSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleHostSearch()}
                                        />
                                        <button onClick={handleHostSearch} className="bg-slate-100 px-6 rounded-lg font-semibold text-slate-700 hover:bg-slate-200">
                                            <Search size={20} />
                                        </button>
                                    </div>
                                </div>

                                {foundHosts.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Search Results</p>
                                        {foundHosts.map(host => (
                                            <div key={host.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img src={host.photoUrl} className="w-10 h-10 rounded-full bg-slate-200" alt="" />
                                                    <div>
                                                        <p className="font-bold text-slate-800">{host.firstName} {host.lastName}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <div className={`w-2 h-2 rounded-full ${host.isInBuilding ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                            <span className="text-xs text-slate-500">
                                                                {host.isInBuilding ? 'In Building' : 'Not Checked In'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!hostNotified ? (
                                                    <button 
                                                        onClick={() => notifyHost(host)}
                                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
                                                    >
                                                        <BellRing size={16} /> Notify
                                                    </button>
                                                ) : (
                                                    <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                                                        <CheckCircle size={16} /> Notified
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {hostNotified && (
                                     <Button variant="green" onClick={() => handleQuickVisitComplete('Visiting Guest', `Host: ${hostSearch}`)}>
                                        Complete Check-in
                                    </Button>
                                )}
                            </div>
                        )}

                        {visitReason === 'OTHER' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Please specify the reason for your visit</label>
                                    <textarea 
                                        autoFocus
                                        className="w-full p-4 h-32 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="e.g. Package delivery, maintenance..."
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => handleQuickVisitComplete('Other', otherReason)} disabled={!otherReason}>
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </StepContainer>
        </div>
      );
  }

  // Step 2 & 3: Concierge Handoff
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
       <div className="max-w-2xl mx-auto w-full mb-6">
         <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
           <ArrowLeft size={20} /> Back to Selection
         </button>
       </div>

      {step === 2 && (
        <StepContainer title="Welcome to the Starter Club">
          <div className="text-center py-8">
             <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <Gift size={40} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Membership is free!</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                Would you like a complimentary tour with our Guest Concierge? It's the best way to see how the space works and understand what we can do for you.
            </p>

            <div className="space-y-3">
               <Button onClick={() => setStep(3)}>
                Yes, I'd like a tour
               </Button>
               <Button variant="secondary" onClick={() => handleQuickVisitComplete('Browsing', 'Declined Tour')}>
                No thanks, just looking around
               </Button>
            </div>
          </div>
        </StepContainer>
      )}

      {step === 3 && (
        <StepContainer title="Let's get you connected">
            <div className="space-y-6">
                <p className="text-slate-600 mb-2">We'll notify our concierge to come greet you. May I ask your name?</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input 
                      type="text" 
                      className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                      value={simpleName.firstName}
                      onChange={e => setSimpleName({...simpleName, firstName: e.target.value})}
                      placeholder="Jane"
                      autoFocus
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input 
                      type="text" 
                      className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                      value={simpleName.lastName}
                      onChange={e => setSimpleName({...simpleName, lastName: e.target.value})}
                      placeholder="Doe"
                      />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Clock size={16} /> 
                    Tour Preference <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Quick Tour (< 5 min)', 'Regular Tour (> 5 min)', 'VIP Tour (> 10 min)'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTourType(type === tourType ? null : type)}
                        className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          tourType === type 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={notifyConcierge} 
                        disabled={!simpleName.firstName || !simpleName.lastName}
                    >
                        <BellRing size={20} /> Notify Concierge
                    </Button>
                </div>
            </div>
        </StepContainer>
      )}
    </div>
  );
};