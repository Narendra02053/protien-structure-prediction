import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Activity } from 'lucide-react';

const getColor = (score) => {
  if (score >= 90) return '#7C9EFF';
  if (score >= 70) return '#7CFF6B';
  if (score >= 50) return '#FF9F43';
  return '#FF6B6B';
};

const LEGEND = [
  { label: '>90 Very High', color: '#7C9EFF' },
  { label: '70–90 Confident', color: '#7CFF6B' },
  { label: '50–70 Low', color: '#FF9F43' },
  { label: '<50 Very Low', color: '#FF6B6B' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = getColor(d.score);
  return (
    <div className="tooltip-glass p-3 text-xs space-y-1">
      <p className="font-extrabold text-white">Position {d.position}</p>
      <p className="text-white/60">Residue: <span className="text-white font-mono font-extrabold">{d.residue}</span></p>
      <p className="font-extrabold mt-1" style={{ color }}>pLDDT: {d.score.toFixed(1)}</p>
    </div>
  );
};

const PLDDTChart = ({ data, mutationPos }) => {
  const meanScore = data.length > 0
    ? (data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1)
    : 0;
  const meanColor = getColor(parseFloat(meanScore));

  return (
    <div className="glass overflow-hidden">
      <div className="h-3 bg-accent-yellow border-b-3 border-white" />
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="neo-icon-box w-8 h-8 bg-accent-blue">
              <Activity className="text-[#0a0a0a]" size={15} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-display">Per-residue Confidence</h3>
              <p className="text-[9px] text-white/50 uppercase tracking-wider font-bold">pLDDT Score</p>
            </div>
          </div>
          <div className="stat-pill px-3 py-2 text-center bg-accent-emerald">
            <p className="text-[8px] text-[#0a0a0a] uppercase tracking-wider font-extrabold">Mean</p>
            <p className="text-base font-extrabold font-mono" style={{ color: meanColor }}>{meanScore}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -14 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="position" stroke="#ffffff" tick={{ fontSize: 8, fill: '#ffffff', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#ffffff" tick={{ fontSize: 8, fill: '#ffffff', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,230,0,0.15)' }} />
              <ReferenceLine y={90} stroke="rgba(124,158,255,0.2)" strokeDasharray="4 4" />
              <ReferenceLine y={70} stroke="rgba(124,255,107,0.2)" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="rgba(255,159,67,0.2)" strokeDasharray="4 4" />
              <Bar dataKey="score" radius={[2, 2, 0, 0]} maxBarSize={8}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.score)}
                    fillOpacity={entry.position === mutationPos ? 1 : 0.75}
                    stroke={entry.position === mutationPos ? '#ffffff' : 'transparent'}
                    strokeWidth={entry.position === mutationPos ? 2 : 0}
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
              <div className="w-3 h-3 flex-shrink-0 border-2 border-white" style={{ backgroundColor: color }} />
              <span className="text-[9px] text-white/70 font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PLDDTChart;
