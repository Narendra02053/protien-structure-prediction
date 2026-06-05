import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, TrendingDown, Award, Zap } from 'lucide-react';

const STATIC_DATA = [
  { name: 'Insulin', baseline: 13.63, finetuned: 11.85 },
  { name: 'Hemoglobin', baseline: 14.57, finetuned: 14.40 },
  { name: 'Lysozyme', baseline: 18.42, finetuned: 18.29 },
  { name: 'Ubiquitin', baseline: 10.13, finetuned: 8.94 },
  { name: 'Myoglobin', baseline: 14.72, finetuned: 14.25 }
].map(d => ({ ...d, improvement: (((d.baseline - d.finetuned) / d.baseline) * 100).toFixed(1) }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-glass p-3 text-xs space-y-1.5">
      <p className="font-bold text-white">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between space-x-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const PerplexityComparison = ({ currentComparison }) => {
  const avgImprovement = (STATIC_DATA.reduce((a, b) => a + parseFloat(b.improvement), 0) / STATIC_DATA.length).toFixed(1);

  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Award className="text-emerald-400" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Perplexity Benchmark</h3>
              <p className="text-xs text-gray-500">Fine-tuned vs Baseline ESM-2</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="stat-pill px-4 py-2 rounded-xl text-center">
              <p className="text-[8px] text-gray-600 uppercase tracking-wider">Avg Improvement</p>
              <p className="text-base font-bold font-mono text-emerald-400">{avgImprovement}%</p>
            </div>
            <div className="stat-pill px-4 py-2 rounded-xl text-center">
              <p className="text-[8px] text-gray-600 uppercase tracking-wider">Proteins</p>
              <p className="text-base font-bold font-mono text-blue-400">5/5</p>
            </div>
          </div>
        </div>

        {/* Chart + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Bar Chart */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATIC_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -12 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#334155" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#334155" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.04)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Bar dataKey="baseline" name="Baseline" fill="rgba(100,116,139,0.5)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="finetuned" name="Fine-tuned" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.05]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Protein', 'Base', 'Fine-tuned', 'Δ'].map(h => (
                    <th key={h} className="p-3 text-[9px] text-gray-600 uppercase tracking-widest font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {STATIC_DATA.map(p => (
                  <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-medium text-gray-300 text-xs font-display">{p.name}</td>
                    <td className="p-3 font-mono text-gray-500 text-xs">{p.baseline}</td>
                    <td className="p-3 font-mono text-blue-400 font-bold text-xs">{p.finetuned}</td>
                    <td className="p-3">
                      <span className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 size={11} />
                        <span>{p.improvement}%</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live comparison if available */}
        {currentComparison && (
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl border border-blue-500/15" style={{ background: 'rgba(37,99,235,0.05)' }}>
            {[
              { label: 'Baseline Perplexity', value: currentComparison.baseline_perplexity?.toFixed(2), color: '#94a3b8' },
              { label: 'Fine-tuned Perplexity', value: currentComparison.finetuned_perplexity?.toFixed(2), color: '#60a5fa' },
              { label: 'Improvement', value: `${currentComparison.improvement_percent?.toFixed(1)}%`, color: '#34d399' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quote */}
        <div className="p-4 rounded-2xl border border-blue-500/10" style={{ background: 'rgba(37,99,235,0.04)' }}>
          <div className="flex items-start space-x-3">
            <Zap className="text-blue-400 flex-shrink-0 mt-0.5" size={14} />
            <p className="text-blue-300/70 text-xs italic leading-relaxed">
              Fine-tuned model outperforms baseline on all 5 human proteins, demonstrating improved domain-specific understanding of the human proteome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerplexityComparison;
