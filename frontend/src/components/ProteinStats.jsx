import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Hash, Layers, Box, Activity } from 'lucide-react';

const AA_COLORS = {
    hydrophobic: '#f59e0b', polar: '#22c55e', positive: '#3b82f6', negative: '#ef4444', special: '#a855f7'
};
const AA_GROUPING = {
    A: 'hydrophobic', V: 'hydrophobic', L: 'hydrophobic', I: 'hydrophobic', M: 'hydrophobic', F: 'hydrophobic', W: 'hydrophobic', P: 'hydrophobic',
    S: 'polar', T: 'polar', C: 'polar', Y: 'polar', N: 'polar', Q: 'polar',
    K: 'positive', R: 'positive', H: 'positive',
    D: 'negative', E: 'negative',
    G: 'special'
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
    const avgPlddt = plddt_scores.length > 0 ? (plddt_scores.reduce((a, b) => a + b.score, 0) / plddt_scores.length).toFixed(1) : 'N/A';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Length', value: sequence.length, icon: <Hash size={15} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Avg pLDDT', value: avgPlddt, icon: <Activity size={15} />, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Chains', value: 1, icon: <Layers size={15} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Residues', value: sequence.length, icon: <Box size={15} />, color: 'text-amber-400', bg: 'bg-amber-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="glass rounded-2xl p-4 flex items-center space-x-3 card-3d">
                        <div className={`${stat.color} ${stat.bg} p-2.5 rounded-xl`}>{stat.icon}</div>
                        <div>
                            <p className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">{stat.label}</p>
                            <p className="text-lg font-bold font-mono text-gray-200">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-3xl p-6 flex flex-col items-center">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Chemical Composition</h3>
                    <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} innerRadius={55} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={AA_COLORS[entry.name.toLowerCase()] || '#6b7280'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                        {Object.entries(AA_COLORS).map(([name, color]) => (
                            <div key={name} className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-[9px] text-gray-500 capitalize">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-3xl p-6">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Sequence Viewer</h3>
                    <div className="bg-black/30 p-4 rounded-2xl font-mono text-xs break-all leading-loose h-48 overflow-y-auto custom-scrollbar">
                        {Array.from(sequence).map((aa, i) => (
                            <span
                                key={i}
                                style={{ color: AA_COLORS[AA_GROUPING[aa]] || AA_COLORS.special }}
                                className="inline-block w-4 h-5 text-center hover:bg-white/10 cursor-pointer rounded transition-all duration-150 hover:scale-125"
                                title={`${aa} at pos ${i + 1}`}
                            >
                                {aa}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProteinStats;
