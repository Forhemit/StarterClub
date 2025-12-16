import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, FileText, User, UserCheck, ClipboardList } from 'lucide-react';
import { VisitRecord, VisitType } from '../types';
import { db } from '../services/mockDatabase';

interface VisitorLogsProps {
  onBack: () => void;
}

export const VisitorLogs: React.FC<VisitorLogsProps> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const visits = db.getVisits();

  const filteredVisits = useMemo(() => {
    return visits
        .filter(v => v.timestamp.startsWith(selectedDate))
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [visits, selectedDate]);

  const getVisitorName = (visit: VisitRecord) => {
    if (visit.type === VisitType.NEW_GUEST && visit.guestProfile) {
      return `${visit.guestProfile.firstName} ${visit.guestProfile.lastName}`;
    }
    if (visit.type === VisitType.MEMBER_VISIT && visit.memberId) {
      const member = db.getMemberById(visit.memberId);
      return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
    }
    if (visit.type === VisitType.QUICK_LOG) {
        return visit.workDescription || 'Log Entry';
    }
    return 'Unknown';
  };

  const getDetails = (visit: VisitRecord) => {
      if (visit.type === VisitType.NEW_GUEST) {
          return visit.guestProfile?.goal || 'No details';
      }
      if (visit.type === VisitType.MEMBER_VISIT) {
          if (visit.resourceUsed !== 'None') {
              return `Booked: ${visit.resourceUsed} (${visit.resourceDurationHours}h)`;
          }
          return visit.workDescription || visit.intent || 'Hanging out';
      }
      if (visit.type === VisitType.QUICK_LOG) {
          return 'Operational Log';
      }
      return '-';
  };

  const getTypeBadge = (type: VisitType) => {
      switch(type) {
          case VisitType.MEMBER_VISIT:
              return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <UserCheck size={12}/> Member
                </span>
              );
          case VisitType.NEW_GUEST:
              return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <User size={12}/> Guest
                </span>
              );
          case VisitType.QUICK_LOG:
              return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <ClipboardList size={12}/> Log
                </span>
              );
          default: 
            return null;
      }
  };

  return (
    <div className="px-6 pb-12 pt-28 bg-slate-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="text-blue-600" size={32} />
            Visitor Logs
          </h1>
          <p className="text-slate-500 mt-1">Daily check-in registry</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition font-semibold shadow-sm active:scale-95"
            >
            <ArrowLeft size={18} /> Back to Reception
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor / Entry</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details / Purpose</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredVisits.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                No visits recorded for this date.
                            </td>
                        </tr>
                    ) : (
                        filteredVisits.map((visit) => (
                            <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-600 font-mono text-sm whitespace-nowrap">
                                    {new Date(visit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                                    {getVisitorName(visit)}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {getTypeBadge(visit.type)}
                                </td>
                                <td className="p-4 text-slate-600 text-sm max-w-md truncate" title={getDetails(visit)}>
                                    {getDetails(visit)}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {visit.paymentCollected > 0 ? (
                                        <span className="text-emerald-600 font-bold text-sm">${visit.paymentCollected.toFixed(2)}</span>
                                    ) : (
                                        <span className="text-slate-400 text-sm">-</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};