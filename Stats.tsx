import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Stat {
  timestamp: number;
  type: string;
  wpm: number;
}

const Stats: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('read_drill_stats');
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  }, []);

  const chartData = useMemo(() => {
    return stats.map(s => ({
      ...s,
      date: new Date(s.timestamp).toLocaleDateString(),
      formattedTime: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }, [stats]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 sticky top-24 bg-white/80 backdrop-blur-xl py-4 z-50 border-b border-slate-200 px-6 rounded-2xl shadow-sm">
          <button 
            onClick={() => navigate('/read-drill')}
            className="text-blue-600 font-bold hover:underline flex items-center gap-2"
          >
            ← Back to Read Drill
          </button>
          <span className="text-slate-900 font-black text-xl">YOUR PROGRESS</span>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl border border-slate-100">
          {stats.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-xl font-medium">No reading stats recorded yet.</p>
              <p className="mt-2">Complete a drill to see your progress!</p>
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    domain={['auto', 'auto']}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      border: '1px solid #e2e8f0'
                    }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                    name="WPM"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* History Table */}
        {stats.length > 0 && (
           <div className="mt-12 bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900">Drill History</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
                   <tr>
                     <th className="px-8 py-4">Date</th>
                     <th className="px-8 py-4">Drill Type</th>
                     <th className="px-8 py-4 text-right">WPM</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {stats.slice().reverse().map((stat, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="px-8 py-4 font-medium text-slate-600">
                         {new Date(stat.timestamp).toLocaleDateString()} <span className="text-slate-400 text-xs ml-2">{new Date(stat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       </td>
                       <td className="px-8 py-4">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 capitalize">
                           {stat.type}
                         </span>
                       </td>
                       <td className="px-8 py-4 text-right font-black text-slate-900">
                         {stat.wpm}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
