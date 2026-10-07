import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, Award, Zap } from 'lucide-react';

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
    <div className="tooltip-glass p-3 text-xs space-y-1.5 border border-slate-700 bg-slate-900/95 rounded-lg shadow-xl">
      <p className="font-semibold text-slate-200">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between space-x-4">
          <span style={{ color: p.color }} className="font-medium">{p.name}</span>
          <span className="font-mono font-semibold text-slate-100">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const PerplexityComparison = ({ currentComparison }) => {
  const avgImprovement = (STATIC_DATA.reduce((a, b) => a + parseFloat(b.improvement), 0) / STATIC_DATA.length).toFixed(1);

  return (
    <div className="glass overflow-hidden border border-slate-800">
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="neo-icon-box w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Perplexity Benchmark</h3>
              <p className="text-xs text-slate-400">Fine-tuned ESM-2 vs Baseline ESM-2 Model</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="stat-pill px-4 py-2 text-center bg-slate-900/80 border border-slate-800 rounded-xl">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Avg Improvement</p>
              <p className="text-base font-bold font-mono text-emerald-400">{avgImprovement}%</p>
            </div>
            <div className="stat-pill px-4 py-2 text-center bg-slate-900/80 border border-slate-800 rounded-xl">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Proteins Tested</p>
              <p className="text-base font-bold font-mono text-blue-400">5 / 5</p>
            </div>
          </div>
        </div>

        {/* Chart + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Bar Chart */}
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATIC_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -12 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
                <Bar dataKey="baseline" name="Baseline ESM-2" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="finetuned" name="Fine-tuned ESM-2" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  {['Protein', 'Base', 'Fine-tuned', 'Δ Improvement'].map(h => (
                    <th key={h} className="p-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {STATIC_DATA.map(p => (
                  <tr key={p.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200 text-xs">{p.name}</td>
                    <td className="p-3 font-mono text-slate-400 text-xs">{p.baseline}</td>
                    <td className="p-3 font-mono text-slate-200 font-semibold text-xs">{p.finetuned}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 size={12} />
                        <span>+{p.improvement}%</span>
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
          <div className="grid grid-cols-3 gap-3 p-4 border border-slate-800 rounded-xl bg-slate-900/80">
            {[
              { label: 'Baseline Perplexity', value: currentComparison.baseline_perplexity?.toFixed(2), color: 'text-indigo-400' },
              { label: 'Fine-tuned Perplexity', value: currentComparison.finetuned_perplexity?.toFixed(2), color: 'text-blue-400' },
              { label: 'Improvement', value: `${currentComparison.improvement_percent?.toFixed(1)}%`, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="text-center p-2.5 rounded-lg bg-slate-800/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-medium">{s.label}</p>
                <p className={`text-base font-bold font-mono ${s.color}`}>{s.value ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border border-indigo-500/20 bg-indigo-500/10 rounded-xl">
          <div className="flex items-start space-x-3">
            <Zap className="text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-indigo-200 text-xs font-normal leading-relaxed">
              The fine-tuned ESM-2 model consistently achieves lower perplexity across test proteins, confirming superior domain adaptation to human proteomic sequences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerplexityComparison;
