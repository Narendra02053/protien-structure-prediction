import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, TrendingDown, Award } from 'lucide-react';

const STATIC_DATA = [
    { name: 'Insulin', baseline: 13.63, finetuned: 11.85 },
    { name: 'Hemoglobin', baseline: 14.57, finetuned: 14.40 },
    { name: 'Lysozyme', baseline: 18.42, finetuned: 18.29 },
    { name: 'Ubiquitin', baseline: 10.13, finetuned: 8.94 },
    { name: 'Myoglobin', baseline: 14.72, finetuned: 14.25 }
].map(d => ({ ...d, improvement: (((d.baseline - d.finetuned) / d.baseline) * 100).toFixed(1) }));

const PerplexityComparison = ({ currentComparison }) => {
    return (
        <div className="glass rounded-3xl p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Award className="text-green-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Perplexity Benchmark</h3>
                        <p className="text-xs text-gray-500">Fine-tuned vs Baseline ESM-2</p>
                    </div>
                </div>
                <div className="stat-pill px-3 py-1.5 rounded-xl text-[9px] font-bold text-green-400 uppercase tracking-wider">
                    5/5 improved
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={STATIC_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                            <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} axisLine={{ stroke: 'rgba(148,163,184,0.08)' }} />
                            <YAxis stroke="#475569" tick={{ fontSize: 10 }} axisLine={{ stroke: 'rgba(148,163,184,0.08)' }} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', backdropFilter: 'blur(16px)' }}
                                itemStyle={{ color: '#e2e8f0', fontSize: '11px' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="baseline" name="Baseline" fill="#475569" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="finetuned" name="Fine-tuned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/5">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="p-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Protein</th>
                                <th className="p-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Base</th>
                                <th className="p-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Fine-tuned</th>
                                <th className="p-3 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Δ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {STATIC_DATA.map(p => (
                                <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-3 font-medium text-gray-300 text-xs">{p.name}</td>
                                    <td className="p-3 font-mono text-gray-500 text-xs">{p.baseline}</td>
                                    <td className="p-3 font-mono text-blue-400 font-bold text-xs">{p.finetuned}</td>
                                    <td className="p-3">
                                        <span className="flex items-center space-x-1 text-green-400 text-xs font-bold">
                                            <CheckCircle2 size={12} />
                                            <span>{p.improvement}%</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-blue-300/80 text-xs italic leading-relaxed">
                    "Fine-tuned model outperforms baseline on all 5 human proteins, demonstrating improved domain-specific understanding of the human proteome."
                </p>
            </div>
        </div>
    );
};

export default PerplexityComparison;
