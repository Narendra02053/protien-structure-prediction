import React from 'react';
import { AlertTriangle, CheckCircle, Database, TrendingDown, ShieldAlert, Atom, Dna, Activity, Info } from 'lucide-react';

const getSeverityBadge = (severity) => {
  const s = severity?.toLowerCase() || '';
  if (s.includes('pathogenic') && !s.includes('likely')) return 'bg-red-500/10 text-red-400 border-red-500/30';
  if (s.includes('likely pathogenic')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
  if (s.includes('uncertain')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  if (s.includes('likely benign')) return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
  if (s.includes('benign')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
};

const StatBox = ({ label, value, sub, icon, valueColor = 'text-white' }) => (
  <div className="stat-pill p-3.5 space-y-1 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col justify-between">
    <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
      <span>{icon}</span>
      <span className="text-[10px] uppercase font-semibold tracking-wider">{label}</span>
    </div>
    <p className={`text-lg font-bold font-mono ${valueColor}`}>{value}</p>
    {sub && <p className="text-[10px] text-slate-500 leading-tight font-medium">{sub}</p>}
  </div>
);

const MutationCard = ({ analysis, geneName, plddtAtPos }) => {
  if (!analysis) {
    return (
      <div className="glass p-8 space-y-3 text-center border border-slate-800">
        <div className="neo-icon-box w-10 h-10 mx-auto bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
          <Info size={20} />
        </div>
        <p className="text-slate-200 font-semibold text-sm">No Mutation Specified</p>
        <p className="text-slate-400 text-xs">Enter a mutation (e.g. A23K) and gene name to see pathogenicity and ClinVar analysis.</p>
      </div>
    );
  }

  const isPathogenic = analysis.pathogenicity === 'Likely Pathogenic';
  const badgeClasses = getSeverityBadge(analysis.severity);
  const llrAbs = Math.min(Math.abs(analysis.llr_score) * 20, 100);

  return (
    <div className="glass overflow-hidden animate-scale-in border border-slate-800">
      <div className={`h-1 w-full ${isPathogenic ? 'bg-red-500' : 'bg-emerald-500'}`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Variant Analysis</p>
            <h2 className="text-lg font-bold text-white font-display flex items-center flex-wrap gap-2">
              <Atom size={18} className="text-indigo-400 flex-shrink-0" />
              <span className="truncate">{geneName || 'Gene'}</span>
              <span className="text-slate-500">·</span>
              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-sm rounded-md">{analysis.mutation}</span>
            </h2>
          </div>
          <div className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${isPathogenic ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
            {isPathogenic ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
            <span className="whitespace-nowrap">{analysis.pathogenicity}</span>
          </div>
        </div>

        {/* Linked Details */}
        <div className="space-y-3.5 py-4 border-y border-slate-800/80">
          <div className="flex items-start space-x-3">
            <div className="neo-icon-box w-7 h-7 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg flex-shrink-0 mt-0.5">
              <Dna size={14} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Linked Disease</p>
              <p className="text-sm font-semibold text-slate-200 leading-snug">{analysis.disease_name || 'Not found in database'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="neo-icon-box w-7 h-7 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg flex-shrink-0 mt-0.5">
              <Activity size={14} />
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Organs Affected</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.organs_affected?.length > 0
                  ? analysis.organs_affected.map(organ => (
                    <span key={organ} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-medium rounded-md">{organ}</span>
                  ))
                  : <span className="text-xs text-slate-500 italic">No specific organ data</span>
                }
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">ClinVar Classification</p>
            <span className={`px-2.5 py-0.5 border text-xs font-medium rounded-md ${badgeClasses}`}>
              {analysis.severity || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatBox
            label="LLR Score" value={analysis.llr_score}
            icon={<TrendingDown size={12} className="text-indigo-400" />}
            valueColor={isPathogenic ? 'text-red-400' : 'text-emerald-400'}
            sub={isPathogenic ? 'Pathogenic' : 'Benign'}
          />
          <StatBox
            label="ClinVar" value={analysis.clinvar_count}
            icon={<Database size={12} className="text-blue-400" />}
            valueColor="text-blue-400"
            sub="Pathogenic entries"
          />
          <StatBox
            label="pLDDT" value={plddtAtPos ? plddtAtPos.toFixed(1) : 'N/A'}
            icon={<Activity size={12} className="text-emerald-400" />}
            valueColor="text-emerald-400"
            sub={`At pos ${analysis.mutation?.match(/\d+/)?.[0] || '?'}`}
          />
        </div>

        {/* LLR Signal Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Pathogenicity Confidence</span>
            <span className="font-mono text-slate-200 font-semibold">{llrAbs.toFixed(0)}%</span>
          </div>
          <div className="neo-bar-track">
            <div className={`h-full rounded-full transition-all duration-700 ${isPathogenic ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
              style={{ width: `${llrAbs}%` }} />
          </div>
        </div>

        {/* Probabilities */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Residue Probabilities</p>
          {[
            { label: 'Wild-type Residue', prob: analysis.original_prob, color: '#818cf8' },
            { label: 'Mutant Residue', prob: analysis.mutant_prob, color: '#f472b6' }
          ].map(({ label, prob, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{label}</span>
                <span className="text-slate-200 font-mono font-semibold">{(prob * 100).toFixed(4)}%</span>
              </div>
              <div className="neo-bar-track h-1.5">
                <div className="h-full rounded-full"
                  style={{ width: `${Math.max(prob * 100, 1)}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MutationCard;
