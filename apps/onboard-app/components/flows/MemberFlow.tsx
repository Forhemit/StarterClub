import React, { useState } from 'react';
import { X, ScanLine, Zap, Monitor, Users, Coffee, ArrowLeft, Loader2 } from 'lucide-react';
import { Member, ResourceType, VisitType, MemberIntent, RoomOption } from '../../types';
import { ROOM_CATEGORIES } from '../../constants';
import { db } from '../../services/database';
import { StepContainer, Button } from './Shared';

interface MemberFlowProps {
    onComplete: () => void;
    onCancel: () => void;
    members: Member[];
}

export const MemberFlow: React.FC<MemberFlowProps> = ({ onComplete, onCancel, members }) => {
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

    const handleManualLookup = async () => {
        setIsProcessing(true);
        const member = await db.findMember(manualId, manualLast);
        setIsProcessing(false);

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

        await db.addVisit({
            type: VisitType.MEMBER_VISIT,
            memberId: selectedMember.id,
            intent,
            resourceUsed: resource ? (resource.name as ResourceType) : ResourceType.NONE,
            resourceDurationHours: resource ? duration : 0,
            paymentCollected: price,
            guestProfile: undefined // Explicitly undefined
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
                                {members.slice(0, 3).map(m => (
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
                            <Button onClick={handleManualLookup} disabled={!manualId || !manualLast || isProcessing}>
                                {isProcessing ? 'Verifying...' : 'Verify Member'}
                            </Button>
                        </div>
                    )}
                </StepContainer>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
                <StepContainer title={`Welcome, ${selectedMember?.firstName}!`}>
                    <p className="text-center text-slate-500 mb-8 text-lg">What's the mission today?</p>
                    <div className="grid grid-cols-1 gap-4">
                        <button onClick={() => { setIntent(MemberIntent.WORK); setStep(3); }} className="p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 text-left group">
                            <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                            <div><h3 className="font-bold text-slate-800 text-lg">Need to get work done</h3><p className="text-slate-500 text-sm">Focus time, deadlines, deep work</p></div>
                        </button>
                        <button onClick={() => { setIntent(MemberIntent.WORK); setStep(3); }} className="p-6 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 text-left group">
                            <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:scale-110 transition-transform"><Monitor size={24} /></div>
                            <div><h3 className="font-bold text-slate-800 text-lg">Create / Build</h3><p className="text-slate-500 text-sm">Design, dev, content creation</p></div>
                        </button>
                        <button onClick={() => { setIntent(MemberIntent.WORK); setStep(3); }} className="p-6 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4 text-left group">
                            <div className="bg-orange-100 p-4 rounded-full text-orange-600 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                            <div><h3 className="font-bold text-slate-800 text-lg">Collaborate / Meet</h3><p className="text-slate-500 text-sm">Team work, client meetings</p></div>
                        </button>
                        <button onClick={() => { setIntent(MemberIntent.HANG_OUT); handleCheckIn(); }} disabled={isProcessing} className="p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-4 text-left group">
                            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 group-hover:scale-110 transition-transform"><Coffee size={24} /></div>
                            <div><h3 className="font-bold text-slate-800 text-lg">Hang Out / Recharge</h3><p className="text-slate-500 text-sm">Social, network, reset (No Booking)</p></div>
                        </button>
                    </div>
                </StepContainer>
            </div>
        );
    }

    // Step 3
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
                                    <button key={r.id} onClick={() => setResource(r)} className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${resource?.id === r.id ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <div><div className="font-bold text-slate-800">{r.name}</div><div className="text-sm text-slate-500">{r.description}</div></div>
                                        <div className="font-semibold text-slate-700">{r.price === 0 ? 'Free' : `$${r.price}/hr`}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {resource && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in slide-in-from-bottom-2">
                            <h4 className="font-bold text-slate-800 mb-4 flex justify-between">Booking Details <span className="text-blue-600">{resource.name}</span></h4>
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
