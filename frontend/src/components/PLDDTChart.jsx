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
    <div className="tooltip-glass p-3 text-xs space-y-1">
      <p className="font-bold text-white">Position {d.position}</p>
      <p className="text-gray-400">Residue: <span className="text-white font-mono font-bold">{d.residue}</span></p>
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
    <div className="glass rounded-3xl overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="text-blue-400" size={15} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-200 font-display">Per-residue Confidence</h3>
              <p className="text-[9px] text-gray-600 uppercase tracking-wider">pLDDT Score</p>
            </div>
          </div>
          <div className="stat-pill px-3 py-2 rounded-xl text-center">
            <p className="text-[8px] text-gray-600 uppercase tracking-wider">Mean</p>
            <p className="text-base font-bold font-mono" style={{ color: meanColor }}>{meanScore}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="position" stroke="#334155" tick={{ fontSize: 8, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#334155" tick={{ fontSize: 8, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
              <ReferenceLine y={90} stroke="rgba(59,130,246,0.15)" strokeDasharray="4 4" />
              <ReferenceLine y={70} stroke="rgba(16,185,129,0.15)" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="rgba(245,158,11,0.15)" strokeDasharray="4 4" />
              <Bar dataKey="score" radius={[2, 2, 0, 0]} maxBarSize={8}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.score)}
                    fillOpacity={entry.position === mutationPos ? 1 : 0.75}
                    stroke={entry.position === mutationPos ? '#fff' : 'transparent'}
                    strokeWidth={entry.position === mutationPos ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />
              <span className="text-[9px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PLDDTChart;
