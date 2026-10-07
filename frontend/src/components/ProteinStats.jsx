import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Hash, Layers, Box, Activity } from 'lucide-react';

const AA_COLORS = {
  hydrophobic: '#f59e0b',
  polar: '#10b981',
  positive: '#3b82f6',
  negative: '#ef4444',
  special: '#8b5cf6'
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
    <div className="tooltip-glass p-2.5 text-xs bg-slate-900/95 border border-slate-700 rounded-lg shadow-xl">
      <p className="font-semibold text-slate-200">{payload[0].name}</p>
      <p className="text-slate-400">{payload[0].value} residues</p>
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
    { label: 'Length', value: `${sequence.length} AA`, icon: <Hash size={16} className="text-indigo-400" /> },
    { label: 'Avg pLDDT', value: avgPlddt, icon: <Activity size={16} className="text-emerald-400" /> },
    { label: 'Chains', value: 1, icon: <Layers size={16} className="text-purple-400" /> },
    { label: 'Residues', value: sequence.length, icon: <Box size={16} className="text-blue-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass p-4 flex items-center space-x-3.5 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <div className="neo-icon-box w-10 h-10 flex-shrink-0 bg-slate-900 border border-slate-800 rounded-xl">
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{s.label}</p>
              <p className="text-lg font-bold font-mono text-slate-100">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass overflow-hidden border border-slate-800">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <div className="p-6 flex flex-col items-center space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">Chemical Composition</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={AA_COLORS[entry.name.toLowerCase()] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-1 border-t border-slate-800/60 w-full">
              {Object.entries(AA_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[11px] text-slate-400 capitalize font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sequence Viewer */}
        <div className="glass overflow-hidden border border-slate-800">
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="p-6 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sequence Interactive Map</h3>
            <div className="bg-slate-950 p-4 font-mono text-xs break-all leading-loose h-48 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl">
              {Array.from(sequence).map((aa, i) => (
                <span
                  key={i}
                  style={{ color: AA_COLORS[AA_GROUPING[aa]] || AA_COLORS.special }}
                  className="inline-block w-4 h-5 text-center hover:bg-slate-800 rounded cursor-pointer transition-colors font-semibold"
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
