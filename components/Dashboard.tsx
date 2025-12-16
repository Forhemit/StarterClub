import React, { useMemo } from 'react';
import { VisitRecord, VisitType, ResourceType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft } from 'lucide-react';

interface DashboardProps {
  visits: VisitRecord[];
  onBack: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC<DashboardProps> = ({ visits, onBack }) => {

  const stats = useMemo(() => {
    // Basic stats
    const total = visits.length;
    const members = visits.filter(v => v.type === VisitType.MEMBER_VISIT).length;
    const guests = visits.filter(v => v.type === VisitType.NEW_GUEST).length;
    
    // Resource Usage (Filter out Quick Logs for this chart as they don't use resources usually)
    const resourceCount: Record<string, number> = {};
    visits.forEach(v => {
      if (v.type !== VisitType.QUICK_LOG) {
          resourceCount[v.resourceUsed] = (resourceCount[v.resourceUsed] || 0) + 1;
      }
    });
    const resourceData = Object.keys(resourceCount).map(k => ({ name: k, value: resourceCount[k] }));

    // Revenue
    const revenue = visits.reduce((acc, curr) => acc + curr.paymentCollected, 0);

    // AI Categories (Member Work)
    const catCount: Record<string, number> = {};
    visits.forEach(v => {
        if (v.aiCategory) {
            catCount[v.aiCategory] = (catCount[v.aiCategory] || 0) + 1;
        }
    });
    const catData = Object.keys(catCount).map(k => ({ name: k, value: catCount[k] }));

    return { total, members, guests, resourceData, revenue, catData };
  }, [visits]);

  return (
    <div className="px-6 pb-12 pt-28 bg-slate-50 min-h-screen overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Operational Dashboard</h1>
            <p className="text-slate-500 mt-1">Real-time metrics and CRA compliance tracking</p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition font-semibold shadow-sm active:scale-95"
        >
          <ArrowLeft size={18} /> Back to Reception
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Visits (All Types)</p>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">New Guests (Leads)</p>
          <p className="text-4xl font-extrabold text-blue-600 mt-2">{stats.guests}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Revenue Collected</p>
          <p className="text-4xl font-extrabold text-emerald-600 mt-2">${stats.revenue}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Compliance Data</p>
          <p className="text-4xl font-extrabold text-purple-600 mt-2">{stats.guests}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Verified Address Records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
            Resource Utilization
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">This Week</span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.resourceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="value" fill="#3b82f6" name="Bookings" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Member Work Activity <span className="text-slate-400 font-normal">(AI Categorized)</span></h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={stats.catData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {stats.catData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};