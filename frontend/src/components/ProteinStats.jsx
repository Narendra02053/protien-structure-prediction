import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Hash, Layers, Box, Activity } from 'lucide-react';

const AA_COLORS = {
  hydrophobic: '#FF9F43',
  polar: '#7CFF6B',
  positive: '#7C9EFF',
  negative: '#FF6B6B',
  special: '#C9A0FF'
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
      <p className="font-extrabold text-white">{payload[0].name}</p>
      <p className="text-white/60 font-bold">{payload[0].value} residues</p>
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
    { label: 'Length', value: sequence.length, icon: <Hash size={14} strokeWidth={2.5} />, bg: '#7C9EFF' },
    { label: 'Avg pLDDT', value: avgPlddt, icon: <Activity size={14} strokeWidth={2.5} />, bg: '#7CFF6B' },
    { label: 'Chains', value: 1, icon: <Layers size={14} strokeWidth={2.5} />, bg: '#C9A0FF' },
    { label: 'Residues', value: sequence.length, icon: <Box size={14} strokeWidth={2.5} />, bg: '#FFE600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="glass p-4 flex items-center space-x-3 card-3d group" style={{ background: s.bg }}>
            <div className="neo-icon-box w-10 h-10 flex-shrink-0 bg-[#0a0a0a] text-white">
              {s.icon}
            </div>
            <div>
              <p className="text-[8px] text-[#0a0a0a] uppercase font-extrabold tracking-widest">{s.label}</p>
              <p className="text-lg font-extrabold font-mono text-[#0a0a0a]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass overflow-hidden">
          <div className="h-3 bg-accent-violet border-b-3 border-white" />
          <div className="p-6 flex flex-col items-center space-y-4">
            <h3 className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest self-start">Chemical Composition</h3>
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
                  <div className="w-3 h-3 border-2 border-white" style={{ backgroundColor: color }} />
                  <span className="text-[9px] text-white/60 font-bold capitalize">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sequence Viewer */}
        <div className="glass overflow-hidden">
          <div className="h-3 bg-accent-cyan border-b-3 border-white" />
          <div className="p-6 space-y-3">
            <h3 className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">Sequence Viewer</h3>
            <div className="bg-[#0a0a0a] p-4 font-mono text-xs break-all leading-loose h-52 overflow-y-auto custom-scrollbar border-3 border-white shadow-neo-sm">
              {Array.from(sequence).map((aa, i) => (
                <span
                  key={i}
                  style={{ color: AA_COLORS[AA_GROUPING[aa]] || AA_COLORS.special }}
                  className="inline-block w-4 h-5 text-center hover:bg-accent-yellow/30 cursor-pointer transition-all duration-100 hover:scale-125 font-extrabold"
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
