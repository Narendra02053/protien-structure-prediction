import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const PLDDTChart = ({ data, mutationPos }) => {
    const getColor = (score) => {
        if (score >= 90) return '#3b82f6';
        if (score >= 70) return '#22c55e';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="glass p-3 rounded-xl text-xs border-0 shadow-2xl">
                    <p className="font-bold text-blue-300">Position {d.position}</p>
                    <p className="text-gray-400">Residue: <span className="text-white font-mono">{d.residue}</span></p>
                    <p style={{ color: getColor(d.score) }} className="font-bold mt-1">
                        pLDDT: {d.score.toFixed(1)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const meanScore = data.length > 0 ? (data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1) : 0;

    return (
        <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-300">Per-residue Confidence</h3>
                <div className="stat-pill px-3 py-1 rounded-lg">
                    <span className="text-[9px] text-gray-500">Mean </span>
                    <span className="text-xs font-bold font-mono text-blue-300">{meanScore}</span>
                </div>
            </div>
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                        <XAxis dataKey="position" stroke="#475569" tick={{ fontSize: 9 }} axisLine={{ stroke: 'rgba(148,163,184,0.08)' }} />
                        <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} axisLine={{ stroke: 'rgba(148,163,184,0.08)' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                        <ReferenceLine y={90} stroke="rgba(59,130,246,0.2)" strokeDasharray="3 3" />
                        <ReferenceLine y={70} stroke="rgba(34,197,94,0.2)" strokeDasharray="3 3" />
                        <ReferenceLine y={50} stroke="rgba(245,158,11,0.2)" strokeDasharray="3 3" />
                        <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColor(entry.score)}
                                    fillOpacity={0.8}
                                    stroke={entry.position === mutationPos ? '#fff' : 'transparent'}
                                    strokeWidth={entry.position === mutationPos ? 2 : 0}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 pt-2">
                {[
                    { label: '>90 High', color: '#3b82f6' },
                    { label: '70-90', color: '#22c55e' },
                    { label: '50-70', color: '#f59e0b' },
                    { label: '<50 Low', color: '#ef4444' }
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[9px] text-gray-500">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PLDDTChart;
