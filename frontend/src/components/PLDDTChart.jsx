import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Activity } from 'lucide-react';

const getColor = (score) => {
  if (score >= 90) return '#3b82f6';
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

const LEGEND = [
  { label: '>90 Very High', color: '#3b82f6' },
  { label: '70–90 Confident', color: '#10b981' },
  { label: '50–70 Low', color: '#f59e0b' },
  { label: '<50 Very Low', color: '#ef4444' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = getColor(d.score);
  return (
    <div className="tooltip-glass p-3 text-xs space-y-1 border border-slate-700 bg-slate-900/95 rounded-lg shadow-xl">
      <p className="font-semibold text-slate-200">Position {d.position}</p>
      <p className="text-slate-400">Residue: <span className="text-slate-100 font-mono font-semibold">{d.residue}</span></p>
      <p className="font-bold mt-1" style={{ color }}>pLDDT: {d.score.toFixed(1)}</p>
    </div>
  );
};

const PLDDTChart = ({ data, mutationPos }) => {
  const meanScore = data.length > 0
    ? (data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1)
    : 0;
  const meanColor = getColor(parseFloat(meanScore));

  return (
    <div className="glass overflow-hidden border border-slate-800">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="neo-icon-box w-9 h-9 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Per-Residue Confidence</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">pLDDT Score Profile</p>
            </div>
          </div>
          <div className="stat-pill px-3.5 py-1.5 text-center bg-slate-900/80 border border-slate-800 rounded-xl">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Mean pLDDT</p>
            <p className="text-base font-bold font-mono" style={{ color: meanColor }}>{meanScore}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[230px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="position" stroke="#64748b" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <ReferenceLine y={90} stroke="rgba(59,130,246,0.3)" strokeDasharray="3 3" />
              <ReferenceLine y={70} stroke="rgba(16,185,129,0.3)" strokeDasharray="3 3" />
              <ReferenceLine y={50} stroke="rgba(245,158,11,0.3)" strokeDasharray="3 3" />
              <Bar dataKey="score" radius={[2, 2, 0, 0]} maxBarSize={8}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.score)}
                    fillOpacity={entry.position === mutationPos ? 1 : 0.8}
                    stroke={entry.position === mutationPos ? '#ffffff' : 'transparent'}
                    strokeWidth={entry.position === mutationPos ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PLDDTChart;
