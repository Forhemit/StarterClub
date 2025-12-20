import React, { useState } from 'react';
import { X, Truck, User, Calendar, Hammer, ClipboardList, ArrowLeft, Package } from 'lucide-react';
import { VisitType, ResourceType } from '../../types';
import { db } from '../../services/database';
import { StepContainer, Button } from './Shared';

interface QuickLogFlowProps {
    onComplete: () => void;
    onCancel: () => void;
}

export const QuickLogFlow: React.FC<QuickLogFlowProps> = ({ onComplete, onCancel }) => {
    const [view, setView] = useState<'MAIN' | 'OTHER' | 'FORM_GUEST' | 'FORM_VENDOR'>('MAIN');
    const [customReason, setCustomReason] = useState('');
    const [guestForm, setGuestForm] = useState({ firstName: '', lastName: '', hostFirstName: '', hostLastName: '' });
    const [vendorForm, setVendorForm] = useState({ company: '', repName: '' });

    const handleLog = async (description: string) => {
        await db.addVisit({
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
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-200 rounded-2xl transition-all group h-32">
            <div className="bg-white p-3 rounded-full shadow-sm text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-transform"><Icon size={24} /></div><span className="font-bold text-slate-700 group-hover:text-blue-800">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full mb-6">
                <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><X size={20} /> Cancel Log</button>
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
                ) : (view === 'FORM_GUEST' ? (
                    <div className="space-y-6">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label><input type="text" className="w-full p-4 border rounded" value={guestForm.firstName} onChange={e => setGuestForm({ ...guestForm, firstName: e.target.value })} placeholder="First" /></div>
                        <Button onClick={handleGuestSubmit}>Log Guest</Button>
                    </div>
                ) : (view === 'FORM_VENDOR' ? (
                    <div className="space-y-6">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Company</label><input type="text" className="w-full p-4 border rounded" value={vendorForm.company} onChange={e => setVendorForm({ ...vendorForm, company: e.target.value })} /></div>
                        <Button onClick={handleVendorSubmit}>Log Vendor</Button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <button onClick={() => setView('MAIN')} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2"><ArrowLeft size={16} /> Back</button>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <LogButton label="Courier" icon={Package} onClick={() => handleLog('Courier')} />
                            <LogButton label="Maintenance" icon={Hammer} onClick={() => handleLog('Maintenance')} />
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Custom Reason</label>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 p-3 border rounded-lg" value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
                                <Button className="!w-auto px-6" onClick={() => handleLog(customReason)} disabled={!customReason}>Log</Button>
                            </div>
                        </div>
                    </div>
                )))}
            </StepContainer>
        </div>
    );
};
