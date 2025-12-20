import React, { useState } from 'react';
import { X, UserPlus, Users, UserCheck, Info, ArrowLeft, Search, Gift } from 'lucide-react';
import { Member, VisitType, ResourceType } from '../../types';
import { db } from '../../services/database';
import { StepContainer, Button } from './Shared';

type VisitReason = 'ONBOARDING' | 'MEETUP' | 'GUEST' | 'OTHER' | null;

interface NewMemberFlowProps {
    onComplete: () => void;
    onCancel: () => void;
    members: Member[];
}

export const NewMemberFlow: React.FC<NewMemberFlowProps> = ({ onComplete, onCancel, members }) => {
    const [step, setStep] = useState(1);
    const [visitReason, setVisitReason] = useState<VisitReason>(null);

    const [meetupName, setMeetupName] = useState('');
    const [hostSearch, setHostSearch] = useState('');
    const [foundHosts, setFoundHosts] = useState<Member[]>([]);
    const [otherReason, setOtherReason] = useState('');
    const [hostNotified, setHostNotified] = useState(false);
    const [simpleName, setSimpleName] = useState({ firstName: '', lastName: '' });
    const [tourType, setTourType] = useState<string | null>(null);

    const handleHostSearch = () => {
        const results = members.filter(m =>
            `${m.firstName} ${m.lastName}`.toLowerCase().includes(hostSearch.toLowerCase())
        );
        setFoundHosts(results);
        setHostNotified(false);
    };

    const notifyHost = (member: Member) => {
        setHostNotified(true);
    };

    const handleQuickVisitComplete = async (type: string, details: string) => {
        await db.addVisit({
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

    const notifyConcierge = async () => {
        await db.addVisit({
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

    if (step === 1) {
        return (
            <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full mb-6">
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><X size={20} /> Cancel Check-in</button>
                </div>
                <StepContainer title="Welcome! What brings you in?">
                    {!visitReason ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => { setVisitReason('ONBOARDING'); setStep(2); }} className="p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-4 text-center group">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><UserPlus size={32} /></div><div><h3 className="font-bold text-slate-800 text-lg">Interested in Membership</h3><p className="text-sm text-slate-500 mt-1">Take a tour and learn about the club</p></div>
                            </button>
                            <button onClick={() => setVisitReason('MEETUP')} className="p-6 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center gap-4 text-center group">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Users size={32} /></div><div><h3 className="font-bold text-slate-800 text-lg">Attending a Meetup</h3><p className="text-sm text-slate-500 mt-1">Check in for an event</p></div>
                            </button>
                            <button onClick={() => setVisitReason('GUEST')} className="p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center gap-4 text-center group">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><UserCheck size={32} /></div><div><h3 className="font-bold text-slate-800 text-lg">Visiting a Guest</h3><p className="text-sm text-slate-500 mt-1">Meeting a current member</p></div>
                            </button>
                            <button onClick={() => setVisitReason('OTHER')} className="p-6 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-4 text-center group">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Info size={32} /></div><div><h3 className="font-bold text-slate-800 text-lg">Other</h3><p className="text-sm text-slate-500 mt-1">Deliveries, inquiries, etc.</p></div>
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => { setVisitReason(null); setFoundHosts([]); setHostNotified(false); }} className="mb-6 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1"><ArrowLeft size={16} /> Back</button>
                            {visitReason === 'MEETUP' && (
                                <div className="space-y-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Which meetup?</label><input type="text" autoFocus className="w-full p-4 border rounded" value={meetupName} onChange={e => setMeetupName(e.target.value)} /></div><Button onClick={() => handleQuickVisitComplete('Meetup', meetupName)} disabled={!meetupName}>Check In</Button></div>
                            )}
                            {visitReason === 'GUEST' && (
                                <div className="space-y-6">
                                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Who are you visiting?</label><div className="flex gap-2"><input type="text" autoFocus className="flex-1 p-4 border rounded" value={hostSearch} onChange={e => setHostSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleHostSearch()} /><button onClick={handleHostSearch} className="bg-slate-100 px-6 rounded-lg"><Search /></button></div></div>
                                    {foundHosts.length > 0 && (
                                        <div className="space-y-3"><p className="text-sm font-bold text-slate-500">Search Results</p>
                                            {foundHosts.map(host => (
                                                <div key={host.id} className="p-4 border rounded-xl flex justify-between items-center">
                                                    <div className="flex items-center gap-3"><img src={host.photoUrl} className="w-10 h-10 rounded-full" /><div><p className="font-bold">{host.firstName} {host.lastName}</p><span className="text-xs text-slate-500">{host.isInBuilding ? 'In Building' : 'Not Checked In'}</span></div></div>
                                                    {!hostNotified ? <button onClick={() => notifyHost(host)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">Notify</button> : <span className="text-green-600">Notified</span>}
                                                </div>
                                            ))}</div>
                                    )}
                                    {hostNotified && <Button variant="green" onClick={() => handleQuickVisitComplete('Visiting Guest', `Host: ${hostSearch}`)}>Complete Check-in</Button>}
                                </div>
                            )}
                            {visitReason === 'OTHER' && (
                                <div className="space-y-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Reason</label><textarea autoFocus className="w-full p-4 h-32 border rounded" value={otherReason} onChange={e => setOtherReason(e.target.value)} /></div><Button onClick={() => handleQuickVisitComplete('Other', otherReason)} disabled={!otherReason}>Submit</Button></div>
                            )}
                        </div>
                    )}
                </StepContainer>
            </div>
        );
    }

    // Step 2 & 3
    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full mb-6">
                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><ArrowLeft size={20} /> Back to Selection</button>
            </div>
            {step === 2 && (
                <StepContainer title="Welcome to the Starter Club">
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><Gift size={40} /></div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Membership is free!</h3>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">Would you like a complimentary tour?</p>
                        <div className="space-y-3"><Button onClick={() => setStep(3)}>Yes, I'd like a tour</Button><Button variant="secondary" onClick={() => handleQuickVisitComplete('Browsing', 'Declined Tour')}>No thanks, just looking around</Button></div>
                    </div>
                </StepContainer>
            )}
            {step === 3 && (
                <StepContainer title="Let's get you connected">
                    <div className="space-y-6">
                        <p className="text-slate-600 mb-2">May I ask your name?</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-slate-700 mb-1">First Name</label><input type="text" className="w-full p-4 border rounded" value={simpleName.firstName} onChange={e => setSimpleName({ ...simpleName, firstName: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label><input type="text" className="w-full p-4 border rounded" value={simpleName.lastName} onChange={e => setSimpleName({ ...simpleName, lastName: e.target.value })} /></div>
                        </div>
                        <div className="pt-4"><Button onClick={notifyConcierge} disabled={!simpleName.firstName || !simpleName.lastName}>Notify Concierge</Button></div>
                    </div>
                </StepContainer>
            )}
        </div>
    );
};
