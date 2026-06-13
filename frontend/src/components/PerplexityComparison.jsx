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
      <p className="font-extrabold text-white">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between space-x-4">
          <span style={{ color: p.color }} className="font-bold">{p.name}</span>
          <span className="font-mono font-extrabold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const PerplexityComparison = ({ currentComparison }) => {
  const avgImprovement = (STATIC_DATA.reduce((a, b) => a + parseFloat(b.improvement), 0) / STATIC_DATA.length).toFixed(1);

  return (
    <div className="glass overflow-hidden">
      <div className="h-3 bg-accent-emerald border-b-3 border-white" />
      <div className="p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="neo-icon-box w-12 h-12 bg-accent-emerald">
              <Award className="text-[#0a0a0a]" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-display">Perplexity Benchmark</h3>
              <p className="text-xs text-white/50 font-bold">Fine-tuned vs Baseline ESM-2</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="stat-pill px-4 py-2 text-center bg-accent-emerald">
              <p className="text-[8px] text-[#0a0a0a] uppercase tracking-wider font-extrabold">Avg Improvement</p>
              <p className="text-base font-extrabold font-mono text-[#0a0a0a]">{avgImprovement}%</p>
            </div>
            <div className="stat-pill px-4 py-2 text-center bg-accent-blue">
              <p className="text-[8px] text-[#0a0a0a] uppercase tracking-wider font-extrabold">Proteins</p>
              <p className="text-base font-extrabold font-mono text-[#0a0a0a]">5/5</p>
            </div>
          </div>
        </div>

        {/* Chart + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Bar Chart */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATIC_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -12 }} barGap={4}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff" tick={{ fontSize: 10, fill: '#ffffff', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff" tick={{ fontSize: 10, fill: '#ffffff', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,230,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#ffffff', fontWeight: 700 }} />
                <Bar dataKey="baseline" name="Baseline" fill="#C9A0FF" radius={0} />
                <Bar dataKey="finetuned" name="Fine-tuned" fill="#7C9EFF" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-hidden border-3 border-white shadow-neo-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-accent-yellow border-b-3 border-white">
                  {['Protein', 'Base', 'Fine-tuned', 'Δ'].map(h => (
                    <th key={h} className="p-3 text-[9px] text-[#0a0a0a] uppercase tracking-widest font-extrabold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-white/20">
                {STATIC_DATA.map(p => (
                  <tr key={p.name} className="hover:bg-accent-cyan/10 transition-colors bg-[#141414]">
                    <td className="p-3 font-extrabold text-white text-xs font-display">{p.name}</td>
                    <td className="p-3 font-mono text-white/50 text-xs font-bold">{p.baseline}</td>
                    <td className="p-3 font-mono text-white font-extrabold text-xs">{p.finetuned}</td>
                    <td className="p-3">
                      <span className="flex items-center space-x-1 text-accent-emerald text-xs font-extrabold">
                        <CheckCircle2 size={11} strokeWidth={2.5} />
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
          <div className="grid grid-cols-3 gap-4 p-4 border-3 border-white bg-accent-blue shadow-neo-sm">
            {[
              { label: 'Baseline Perplexity', value: currentComparison.baseline_perplexity?.toFixed(2), bg: '#C9A0FF' },
              { label: 'Fine-tuned Perplexity', value: currentComparison.finetuned_perplexity?.toFixed(2), bg: '#7C9EFF' },
              { label: 'Improvement', value: `${currentComparison.improvement_percent?.toFixed(1)}%`, bg: '#7CFF6B' },
            ].map(s => (
              <div key={s.label} className="text-center stat-pill p-3" style={{ background: s.bg }}>
                <p className="text-[9px] text-[#0a0a0a] uppercase tracking-wider mb-1 font-extrabold">{s.label}</p>
                <p className="text-lg font-extrabold font-mono text-[#0a0a0a]">{s.value ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-3 border-white bg-accent-yellow shadow-neo-sm">
          <div className="flex items-start space-x-3">
            <Zap className="text-[#0a0a0a] flex-shrink-0 mt-0.5" size={14} strokeWidth={2.5} />
            <p className="text-[#0a0a0a] text-xs font-bold leading-relaxed">
              Fine-tuned model outperforms baseline on all 5 human proteins, demonstrating improved domain-specific understanding of the human proteome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerplexityComparison;
