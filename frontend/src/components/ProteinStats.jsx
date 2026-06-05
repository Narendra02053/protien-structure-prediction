import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Hash, Layers, Box, Activity } from 'lucide-react';

const AA_COLORS = {
  hydrophobic: '#f59e0b',
  polar: '#10b981',
  positive: '#3b82f6',
  negative: '#ef4444',
  special: '#a855f7'
};
const AA_GROUPING = {
  A:'hydrophobic',V:'hydrophobic',L:'hydrophobic',I:'hydrophobic',M:'hydrophobic',
  F:'hydrophobic',W:'hydrophobic',P:'hydrophobic',
  S:'polar',T:'polar',C:'polar',Y:'polar',N:'polar',Q:'polar',
  K:'positive',R:'positive',H:'positive',
  D:'negative',E:'negative',
  G:'special'
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-glass p-2.5 text-xs">
      <p className="font-bold text-white">{payload[0].name}</p>
      <p className="text-gray-400">{payload[0].value} residues</p>
    </div>
  );
};

const ProteinStats = ({ sequence, plddt_scores }) => {
  const distribution = {};
  Array.from(sequence).forEach(aa => {
    const g = AA_GROUPING[aa] || 'special';
    distribution[g] = (distribution[g] || 0) + 1;
  });
  const chartData = Object.entries(distribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), value
  }));
  const avgPlddt = plddt_scores.length > 0
    ? (plddt_scores.reduce((a, b) => a + b.score, 0) / plddt_scores.length).toFixed(1)
    : 'N/A';

  const stats = [
    { label: 'Length', value: sequence.length, icon: <Hash size={14} />, color: '#60a5fa', bg: 'rgba(37,99,235,0.10)' },
    { label: 'Avg pLDDT', value: avgPlddt, icon: <Activity size={14} />, color: '#34d399', bg: 'rgba(5,150,105,0.10)' },
    { label: 'Chains', value: 1, icon: <Layers size={14} />, color: '#c4b5fd', bg: 'rgba(124,58,237,0.10)' },
    { label: 'Residues', value: sequence.length, icon: <Box size={14} />, color: '#fcd34d', bg: 'rgba(217,119,6,0.10)' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4 flex items-center space-x-3 card-3d group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
              style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">{s.label}</p>
              <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="p-6 flex flex-col items-center space-y-4">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest self-start">Chemical Composition</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={52} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={AA_COLORS[entry.name.toLowerCase()] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {Object.entries(AA_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}80` }} />
                  <span className="text-[9px] text-gray-500 capitalize">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sequence Viewer */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="p-6 space-y-3">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sequence Viewer</h3>
            <div className="bg-black/40 p-4 rounded-2xl font-mono text-xs break-all leading-loose h-52 overflow-y-auto custom-scrollbar border border-white/[0.04]">
              {Array.from(sequence).map((aa, i) => (
                <span
                  key={i}
                  style={{ color: AA_COLORS[AA_GROUPING[aa]] || AA_COLORS.special }}
                  className="inline-block w-4 h-5 text-center hover:bg-white/10 cursor-pointer rounded transition-all duration-100 hover:scale-125"
                  title={`${aa} at position ${i + 1}`}
                >
                  {aa}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProteinStats;
