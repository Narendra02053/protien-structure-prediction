import React from 'react';
import { AlertTriangle, CheckCircle, Database, TrendingDown, ShieldAlert, Atom, Dna, Activity } from 'lucide-react';

const MutationCard = ({ analysis, geneName, plddtAtPos }) => {
    if (!analysis) return null;
    const isPathogenic = analysis.pathogenicity === "Likely Pathogenic";

    // Severity color mapping
    const getSeverityStyles = (severity) => {
        const s = severity?.toLowerCase() || "";
        if (s.includes("pathogenic") && !s.includes("likely")) return "bg-red-500/20 border-red-500/50 text-red-500";
        if (s.includes("likely pathogenic")) return "bg-orange-500/20 border-orange-500/50 text-orange-500";
        if (s.includes("uncertain")) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-500";
        if (s.includes("likely benign")) return "bg-cyan-500/20 border-cyan-500/50 text-cyan-500";
        if (s.includes("benign")) return "bg-green-500/20 border-green-500/50 text-green-500";
        return "bg-gray-500/20 border-gray-500/50 text-gray-400";
    };

    return (
        <div className={`glass rounded-3xl p-8 space-y-6 relative overflow-hidden animate-scale-in`}>
            {/* Glow accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${isPathogenic ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} />

            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-1">Variant Analysis</p>
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <Atom size={20} className="text-blue-400" />
                        <span>{geneName}</span>
                        <span className="text-gray-600">·</span>
                        <span className="text-purple-400 font-mono">{analysis.mutation}</span>
                    </h2>
                </div>
                <div className={`${isPathogenic ? 'badge-danger' : 'badge-success'} px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5`}>
                    {isPathogenic ? <ShieldAlert size={13} /> : <CheckCircle size={13} />}
                    <span>{analysis.pathogenicity}</span>
                </div>
            </div>

            {/* Disease & Organs Section */}
            <div className="space-y-4 py-4 border-y border-white/5">
                <div className="flex items-start space-x-3">
                    <Dna className="text-pink-400 mt-1" size={18} />
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Linked Disease</p>
                        <p className="text-sm font-semibold text-gray-200">{analysis.disease_name || "Not found in database"}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Activity className="text-orange-400 mt-1" size={18} />
                    <div className="space-y-2">
                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Organs Affected</p>
                        <div className="flex flex-wrap gap-2">
                            {analysis.organs_affected?.map(organ => (
                                <span key={organ} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400">
                                    {organ}
                                </span>
                            )) || <span className="text-xs text-gray-600 italic">No specific organ data</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">ClinVar Severity</p>
                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${getSeverityStyles(analysis.severity)}`}>
                        {analysis.severity || "Unknown"} (ClinVar confirmed)
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="stat-pill p-4 rounded-2xl space-y-1.5">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold flex items-center space-x-1">
                        <TrendingDown size={10} className="text-purple-400" />
                        <span>LLR Score</span>
                    </p>
                    <p className="text-xl font-bold font-mono text-purple-300">{analysis.llr_score}</p>
                    <div className="w-full bg-gray-800/50 h-1 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isPathogenic ? 'bg-red-500' : 'bg-green-500'}`}
                             style={{ width: `${Math.min(Math.abs(analysis.llr_score) * 20, 100)}%` }} />
                    </div>
                </div>

                <div className="stat-pill p-4 rounded-2xl space-y-1.5">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold flex items-center space-x-1">
                        <Database size={10} className="text-blue-400" />
                        <span>ClinVar</span>
                    </p>
                    <p className="text-xl font-bold font-mono text-blue-300">{analysis.clinvar_count}</p>
                    <p className="text-[8px] text-gray-600">pathogenic variants</p>
                </div>

                <div className="stat-pill p-4 rounded-2xl space-y-1.5">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">pLDDT</p>
                    <p className="text-xl font-bold font-mono text-yellow-300">{plddtAtPos ? plddtAtPos.toFixed(1) : 'N/A'}</p>
                    <p className="text-[8px] text-gray-600">at {analysis.mutation?.match(/\d+/)?.[0] || 'pos'}</p>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
                <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Probability Distribution</p>
                {[
                    { label: 'Original AA', prob: analysis.original_prob, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Mutant AA', prob: analysis.mutant_prob, color: 'from-purple-500 to-pink-500' }
                ].map(({ label, prob, color }) => (
                    <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">{label}</span>
                            <span className="text-gray-300 font-mono">{(prob * 100).toFixed(4)}%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${color}`}
                                 style={{ width: `${Math.max(prob * 100, 1)}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MutationCard;
