import React from 'react';
import { AlertTriangle, CheckCircle, Database, TrendingDown, ShieldAlert, Atom, Dna, Activity, Info } from 'lucide-react';

const getSeverityStyles = (severity) => {
  const s = severity?.toLowerCase() || '';
  if (s.includes('pathogenic') && !s.includes('likely')) return { bg: '#FF6B6B', text: '#0a0a0a' };
  if (s.includes('likely pathogenic')) return { bg: '#FF9F43', text: '#0a0a0a' };
  if (s.includes('uncertain')) return { bg: '#FFE600', text: '#0a0a0a' };
  if (s.includes('likely benign')) return { bg: '#4ECDC4', text: '#0a0a0a' };
  if (s.includes('benign')) return { bg: '#7CFF6B', text: '#0a0a0a' };
  return { bg: '#C9A0FF', text: '#0a0a0a' };
};

const StatBox = ({ label, value, sub, icon, color }) => (
  <div className="stat-pill p-4 space-y-2 flex flex-col" style={{ background: color }}>
    <div className="flex items-center space-x-1.5">
      <span className="text-[#0a0a0a]">{icon}</span>
      <p className="text-[9px] text-[#0a0a0a] uppercase tracking-widest font-extrabold">{label}</p>
    </div>
    <p className="text-xl font-extrabold font-mono text-[#0a0a0a]">{value}</p>
    {sub && <p className="text-[9px] text-[#0a0a0a]/70 leading-tight font-bold">{sub}</p>}
  </div>
);

const MutationCard = ({ analysis, geneName, plddtAtPos }) => {
  if (!analysis) {
    return (
      <div className="glass p-8 space-y-4 text-center">
        <div className="neo-icon-box w-12 h-12 mx-auto bg-accent-cyan">
          <Info className="text-[#0a0a0a]" size={22} strokeWidth={2.5} />
        </div>
        <p className="text-white font-extrabold text-sm">No mutation analysis available.</p>
        <p className="text-white/50 text-xs font-medium">Enter a mutation and gene name to see pathogenicity data.</p>
      </div>
    );
  }

  const isPathogenic = analysis.pathogenicity === 'Likely Pathogenic';
  const sevStyles = getSeverityStyles(analysis.severity);
  const llrAbs = Math.min(Math.abs(analysis.llr_score) * 20, 100);

  return (
    <div className="glass overflow-hidden animate-scale-in">
      <div className={`h-3 w-full border-b-3 border-white ${isPathogenic ? 'bg-accent-red' : 'bg-accent-emerald'}`} />

      <div className="p-7 space-y-6">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] text-white/50 uppercase tracking-widest font-extrabold">Variant Analysis</p>
            <h2 className="text-xl font-extrabold text-white font-display flex items-center flex-wrap gap-2">
              <Atom size={18} className="text-white flex-shrink-0" strokeWidth={2.5} />
              <span className="truncate">{geneName || 'Unknown Gene'}</span>
              <span>·</span>
              <span className="bg-accent-violet px-1 font-mono text-base text-[#0a0a0a]">{analysis.mutation}</span>
            </h2>
          </div>
          <div className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 text-xs font-extrabold ${isPathogenic ? 'badge-danger' : 'badge-success'}`}>
            {isPathogenic ? <ShieldAlert size={12} strokeWidth={2.5} /> : <CheckCircle size={12} strokeWidth={2.5} />}
            <span className="whitespace-nowrap">{analysis.pathogenicity}</span>
          </div>
        </div>

        <div className="space-y-4 py-5 border-y-3 border-white">
          <div className="flex items-start space-x-3">
            <div className="neo-icon-box w-8 h-8 bg-accent-pink flex-shrink-0 mt-0.5">
              <Dna className="text-[#0a0a0a]" size={15} strokeWidth={2.5} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[9px] text-white/50 uppercase font-extrabold tracking-widest">Linked Disease</p>
              <p className="text-sm font-extrabold text-white leading-snug">{analysis.disease_name || 'Not found in database'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="neo-icon-box w-8 h-8 bg-accent-orange flex-shrink-0 mt-0.5">
              <Activity className="text-[#0a0a0a]" size={15} strokeWidth={2.5} />
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-[9px] text-white/50 uppercase font-extrabold tracking-widest">Organs Affected</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.organs_affected?.length > 0
                  ? analysis.organs_affected.map(organ => (
                    <span key={organ} className="px-2 py-0.5 bg-accent-cyan border-3 border-white text-[10px] text-[#0a0a0a] font-bold shadow-neo-sm">{organ}</span>
                  ))
                  : <span className="text-xs text-white/40 italic font-medium">No specific organ data</span>
                }
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[9px] text-white/50 uppercase font-extrabold tracking-widest">ClinVar Severity</p>
            <span className="px-2.5 py-1 border-3 border-white text-[10px] font-extrabold shadow-neo-sm"
              style={{ background: sevStyles.bg, color: sevStyles.text }}>
              {analysis.severity || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="LLR Score" value={analysis.llr_score}
            icon={<TrendingDown size={10} strokeWidth={2.5} />} color="#C9A0FF"
            sub={isPathogenic ? 'Pathogenic signal' : 'Benign signal'}
          />
          <StatBox
            label="ClinVar" value={analysis.clinvar_count}
            icon={<Database size={10} strokeWidth={2.5} />} color="#7C9EFF"
            sub="pathogenic variants"
          />
          <StatBox
            label="pLDDT" value={plddtAtPos ? plddtAtPos.toFixed(1) : 'N/A'}
            icon={<Activity size={10} strokeWidth={2.5} />} color="#FFE600"
            sub={`at pos ${analysis.mutation?.match(/\d+/)?.[0] || '?'}`}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] text-white/50 uppercase tracking-wider font-extrabold">
            <span>Pathogenicity Signal</span>
            <span className="font-mono text-white">{llrAbs.toFixed(0)}%</span>
          </div>
          <div className="neo-bar-track">
            <div className={`h-full transition-all duration-1000 ${isPathogenic ? 'bg-accent-red' : 'bg-accent-emerald'}`}
              style={{ width: `${llrAbs}%` }} />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t-3 border-white">
          <p className="text-[9px] text-white/50 uppercase tracking-widest font-extrabold">Probability Distribution</p>
          {[
            { label: 'Original AA', prob: analysis.original_prob, color: '#7C9EFF' },
            { label: 'Mutant AA', prob: analysis.mutant_prob, color: '#FF6B9D' }
          ].map(({ label, prob, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white font-bold">{label}</span>
                <span className="text-white font-mono font-extrabold">{(prob * 100).toFixed(4)}%</span>
              </div>
              <div className="neo-bar-track h-2">
                <div className="h-full"
                  style={{ width: `${Math.max(prob * 100, 0.5)}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MutationCard;
