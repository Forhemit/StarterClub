import React, { useState, useRef, useEffect } from 'react';
import { Zap, Calendar, UserPlus, ScanLine, QrCode, X, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Member, ResourceType, VisitType, MemberIntent, RoomOption } from '../../types';
import { APP_NAME, ROOM_CATEGORIES } from '../../constants';
import { db } from '../../services/database';
import { Button } from './Shared';

interface KioskFlowProps {
    onUnlock: () => void;
    members: Member[];
    onComplete: () => void; // Refresh callback
}

export const KioskFlow: React.FC<KioskFlowProps> = ({ onUnlock, members, onComplete }) => {
    const [step, setStep] = useState<'WELCOME' | 'MEMBER_AUTH' | 'GUEST_TYPE' | 'GUEST_FORM' | 'MEMBER_PURPOSE' | 'BOOKING' | 'CONFIRM' | 'SUCCESS'>('WELCOME');
    const [authMode, setAuthMode] = useState<'SCAN' | 'MANUAL'>('SCAN');
    const [isScanning, setIsScanning] = useState(false);
    const [manualId, setManualId] = useState('');
    const [manualLast, setManualLast] = useState('');
    const [authError, setAuthError] = useState('');
    const [member, setMember] = useState<Member | null>(null);
    const [intentType, setIntentType] = useState<'QUICK' | 'BOOK'>('QUICK');
    const [guestType, setGuestType] = useState<'TOUR' | 'APPT' | 'QUICK' | 'OTHER'>('TOUR');
    const [guestName, setGuestName] = useState({ first: '', last: '' });
    const [guestHost, setGuestHost] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
    const [duration, setDuration] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setStep('WELCOME');
            setShowPassword(false); setPassword(''); setManualId(''); setManualLast(''); setGuestName({ first: '', last: '' });
        }, 60000);
    };

    useEffect(() => {
        window.addEventListener('click', resetTimer); window.addEventListener('touchstart', resetTimer); resetTimer();
        return () => { window.removeEventListener('click', resetTimer); window.removeEventListener('touchstart', resetTimer); if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleUnlockSubmit = () => {
        if (password === 'StarterClub!2025') {
            toast.success('Kiosk unlocked');
            onUnlock();
        } else {
            toast.error('Incorrect password');
            setError('Incorrect password');
        }
    };

    const handleMemberAuth = async () => {
        if (authMode === 'MANUAL') {
            const m = await db.findMember(manualId, manualLast);
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
            setIsScanning(true);
            setTimeout(() => {
                const m = members[0]; // Simulating match
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

    const completeMemberCheckIn = async (m: Member, room: RoomOption | null) => {
        await db.addVisit({
            type: VisitType.MEMBER_VISIT,
            memberId: m.id,
            intent: room ? MemberIntent.WORK : MemberIntent.HANG_OUT,
            resourceUsed: room ? (room.name as ResourceType) : ResourceType.NONE,
            resourceDurationHours: room ? duration : 0,
            paymentCollected: room ? room.price * duration : 0
        });
        onComplete();
        setStep('SUCCESS');
        setTimeout(() => setStep('WELCOME'), 4000);
    };

    const handleGuestSubmit = async () => {
        await db.addVisit({
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
        onComplete();
        setStep('SUCCESS');
        setTimeout(() => setStep('WELCOME'), 4000);
    };

    // Unlock Screen
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
                                <div className="bg-white/20 p-6 rounded-full"><Zap size={48} className="text-white" /></div><div className="text-center text-white"><h2 className="text-2xl font-bold">Quick Check-in</h2><p className="opacity-80">Members only</p></div>
                            </button>
                            <button onClick={() => { setIntentType('BOOK'); setStep('MEMBER_AUTH'); }} className="h-72 bg-purple-600 hover:bg-purple-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-xl">
                                <div className="bg-white/20 p-6 rounded-full"><Calendar size={48} className="text-white" /></div><div className="text-center text-white"><h2 className="text-2xl font-bold">Book Space</h2><p className="opacity-80">Reserve a room</p></div>
                            </button>
                            <button onClick={() => setStep('GUEST_TYPE')} className="h-72 bg-emerald-600 hover:bg-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-xl">
                                <div className="bg-white/20 p-6 rounded-full"><UserPlus size={48} className="text-white" /></div><div className="text-center text-white"><h2 className="text-2xl font-bold">I'm New Here</h2><p className="opacity-80">Guest / Visitor</p></div>
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
                                    <div className="animate-pulse"><ScanLine size={80} className="mx-auto text-blue-500 mb-4" /><p>Scanning...</p></div>
                                ) : (
                                    <div onClick={handleMemberAuth} className="cursor-pointer"><QrCode size={80} className="mx-auto text-slate-300 mb-4" /><Button>Tap to Simulate Scan</Button></div>
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
                        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Select a Workspace</h2><button onClick={() => setStep('MEMBER_PURPOSE')} className="text-slate-400 hover:text-slate-600"><X /></button></div>
                        <div className="space-y-6">
                            {Object.entries(ROOM_CATEGORIES).map(([cat, rooms]) => (
                                <div key={cat}>
                                    <h3 className="font-bold text-slate-400 text-sm uppercase mb-2">{cat}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {rooms.map(r => (
                                            <button key={r.id} onClick={() => setSelectedRoom(r)} className={`p-4 rounded-xl border-2 text-left ${selectedRoom?.id === r.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}>
                                                <div className="font-bold">{r.name}</div><div className="text-sm text-slate-500">{r.price > 0 ? `$${r.price}/hr` : 'Included'}</div>
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
                            <input type="text" placeholder="First Name" className="w-full p-4 border rounded-xl" value={guestName.first} onChange={e => setGuestName({ ...guestName, first: e.target.value })} />
                            <input type="text" placeholder="Last Name" className="w-full p-4 border rounded-xl" value={guestName.last} onChange={e => setGuestName({ ...guestName, last: e.target.value })} />
                            {guestType === 'APPT' && (<input type="text" placeholder="Who are you meeting?" className="w-full p-4 border rounded-xl" value={guestHost} onChange={e => setGuestHost(e.target.value)} />)}
                            <Button onClick={handleGuestSubmit} disabled={!guestName.first || !guestName.last}>{guestType === 'TOUR' ? 'Notify Concierge' : 'Check In'}</Button>
                        </div>
                        <button onClick={() => setStep('GUEST_TYPE')} className="w-full mt-6 text-slate-400">Back</button>
                    </div>
                )}
                {step === 'SUCCESS' && (
                    <div className="bg-white rounded-3xl p-12 max-w-xl mx-auto text-center shadow-2xl animate-in zoom-in-95">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div><h2 className="text-3xl font-bold text-slate-900 mb-2">You're All Set!</h2><p className="text-slate-500 text-lg">Have a great visit.</p>
                    </div>
                )}
            </div>
            <button onClick={() => setShowPassword(true)} className="absolute bottom-8 right-8 p-4 text-white/20 hover:text-white/80 transition-colors rounded-full hover:bg-white/10"><Lock size={24} /></button>
        </div>
    );
};
