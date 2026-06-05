import React from 'react';
import { AlertTriangle, CheckCircle, Database, TrendingDown, ShieldAlert, Atom, Dna, Activity, Info } from 'lucide-react';

const getSeverityStyles = (severity) => {
  const s = severity?.toLowerCase() || '';
  if (s.includes('pathogenic') && !s.includes('likely')) return { bg: 'rgba(220,38,38,0.10)', border: 'rgba(220,38,38,0.25)', text: '#fca5a5' };
  if (s.includes('likely pathogenic')) return { bg: 'rgba(234,88,12,0.10)', border: 'rgba(234,88,12,0.25)', text: '#fdba74' };
  if (s.includes('uncertain')) return { bg: 'rgba(217,119,6,0.10)', border: 'rgba(217,119,6,0.25)', text: '#fcd34d' };
  if (s.includes('likely benign')) return { bg: 'rgba(6,182,212,0.10)', border: 'rgba(6,182,212,0.25)', text: '#67e8f9' };
  if (s.includes('benign')) return { bg: 'rgba(5,150,105,0.10)', border: 'rgba(5,150,105,0.25)', text: '#6ee7b7' };
  return { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.20)', text: '#94a3b8' };
};

const StatBox = ({ label, value, sub, icon, color }) => (
  <div className="stat-pill p-4 rounded-2xl space-y-2 flex flex-col">
    <div className="flex items-center space-x-1.5">
      <span style={{ color }}>{icon}</span>
      <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">{label}</p>
    </div>
    <p className="text-xl font-bold font-mono" style={{ color }}>{value}</p>
    {sub && <p className="text-[9px] text-gray-600 leading-tight">{sub}</p>}
  </div>
);

const MutationCard = ({ analysis, geneName, plddtAtPos }) => {
  if (!analysis) {
    return (
      <div className="glass rounded-3xl p-8 space-y-4 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gray-800/50 flex items-center justify-center">
          <Info className="text-gray-600" size={22} />
        </div>
        <p className="text-gray-500 text-sm">No mutation analysis available.</p>
        <p className="text-gray-600 text-xs">Enter a mutation and gene name to see pathogenicity data.</p>
      </div>
    );
  }

  const isPathogenic = analysis.pathogenicity === 'Likely Pathogenic';
  const sevStyles = getSeverityStyles(analysis.severity);
  const llrAbs = Math.min(Math.abs(analysis.llr_score) * 20, 100);

  return (
    <div className="glass rounded-3xl overflow-hidden animate-scale-in">
      {/* Top gradient bar */}
      <div className={`h-1 w-full ${isPathogenic
        ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600'
        : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600'}`}
        style={{ backgroundSize: '200% 100%', animation: 'gradientShift 4s ease-in-out infinite' }}
      />

      <div className="p-7 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Variant Analysis</p>
            <h2 className="text-xl font-bold text-white font-display flex items-center flex-wrap gap-2">
              <Atom size={18} className="text-blue-400 flex-shrink-0" />
              <span className="truncate">{geneName || 'Unknown Gene'}</span>
              <span className="text-gray-700">·</span>
              <span className="text-violet-400 font-mono text-base">{analysis.mutation}</span>
            </h2>
          </div>
          <div className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isPathogenic ? 'badge-danger' : 'badge-success'}`}>
            {isPathogenic ? <ShieldAlert size={12} /> : <CheckCircle size={12} />}
            <span className="whitespace-nowrap">{analysis.pathogenicity}</span>
          </div>
        </div>

        {/* Disease & Organs */}
        <div className="space-y-4 py-5 border-y border-white/[0.05]">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Dna className="text-pink-400" size={15} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Linked Disease</p>
              <p className="text-sm font-semibold text-gray-200 leading-snug">{analysis.disease_name || 'Not found in database'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Activity className="text-orange-400" size={15} />
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Organs Affected</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.organs_affected?.length > 0
                  ? analysis.organs_affected.map(organ => (
                    <span key={organ} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-gray-400">{organ}</span>
                  ))
                  : <span className="text-xs text-gray-600 italic">No specific organ data</span>
                }
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">ClinVar Severity</p>
            <span className="px-2.5 py-1 rounded-lg border text-[10px] font-bold"
              style={{ background: sevStyles.bg, borderColor: sevStyles.border, color: sevStyles.text }}>
              {analysis.severity || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="LLR Score" value={analysis.llr_score}
            icon={<TrendingDown size={10} />} color="#c4b5fd"
            sub={isPathogenic ? 'Pathogenic signal' : 'Benign signal'}
          />
          <StatBox
            label="ClinVar" value={analysis.clinvar_count}
            icon={<Database size={10} />} color="#93c5fd"
            sub="pathogenic variants"
          />
          <StatBox
            label="pLDDT" value={plddtAtPos ? plddtAtPos.toFixed(1) : 'N/A'}
            icon={<Activity size={10} />} color="#fcd34d"
            sub={`at pos ${analysis.mutation?.match(/\d+/)?.[0] || '?'}`}
          />
        </div>

        {/* LLR Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] text-gray-600 uppercase tracking-wider font-bold">
            <span>Pathogenicity Signal</span>
            <span className="font-mono">{llrAbs.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-900/60 h-2 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${isPathogenic ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-teal-500'}`}
              style={{ width: `${llrAbs}%` }} />
          </div>
        </div>

        {/* Probability Distribution */}
        <div className="space-y-3 pt-2 border-t border-white/[0.05]">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Probability Distribution</p>
          {[
            { label: 'Original AA', prob: analysis.original_prob, gradient: 'from-blue-600 to-cyan-500' },
            { label: 'Mutant AA', prob: analysis.mutant_prob, gradient: 'from-violet-600 to-pink-500' }
          ].map(({ label, prob, gradient }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-300 font-mono">{(prob * 100).toFixed(4)}%</span>
              </div>
              <div className="w-full bg-gray-900/60 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                  style={{ width: `${Math.max(prob * 100, 0.5)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MutationCard;
