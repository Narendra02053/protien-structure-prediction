import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ProteinProvider, useProtein } from './context/ProteinContext';
import SequenceInput from './components/SequenceInput';
import StructureViewer from './components/StructureViewer';
import PLDDTChart from './components/PLDDTChart';
import MutationCard from './components/MutationCard';
import PerplexityComparison from './components/PerplexityComparison';
import ProteinStats from './components/ProteinStats';
import AboutPage from './components/AboutPage';
import Toast from './components/Toast';
import { Microscope, Info, ChevronLeft, Dna } from 'lucide-react';

/* ─── Floating Molecular Shapes (like herbs drifting in a breeze) ─── */

/* Small SVG shape components */
const VirusShape = ({ size = 20, color = '#ef4444' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="10" fill="none" stroke={color} strokeWidth="1" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
            const rad = (deg * Math.PI) / 180;
            return <g key={deg}>
                <line x1={20+Math.cos(rad)*10} y1={20+Math.sin(rad)*10} x2={20+Math.cos(rad)*18} y2={20+Math.sin(rad)*18} stroke={color} strokeWidth="0.8" />
                <circle cx={20+Math.cos(rad)*18} cy={20+Math.sin(rad)*18} r="2" fill={color} opacity="0.6" />
            </g>;
        })}
    </svg>
);

const HexagonShape = ({ size = 22, color = '#f97316' }) => (
    <svg width={size} height={size} viewBox="0 0 30 30">
        <polygon points="15,2 27,9 27,21 15,28 3,21 3,9" fill="none" stroke={color} strokeWidth="0.8" />
    </svg>
);

const AntibodyShape = ({ size = 28, color = '#ffffff' }) => (
    <svg width={size} height={size} viewBox="0 0 40 50">
        <path d="M 20,45 L 20,25 L 8,10 M 20,25 L 32,10" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <circle cx="8" cy="10" r="4" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="32" cy="10" r="4" fill="none" stroke={color} strokeWidth="0.8" />
    </svg>
);

const DNASegment = ({ size = 30, color = '#ec4899' }) => (
    <svg width={size} height={size * 2} viewBox="0 0 30 60">
        <path d="M 5,0 Q 25,15 5,30 Q -15,45 5,60" fill="none" stroke={color} strokeWidth="1" />
        <path d="M 25,0 Q 5,15 25,30 Q 45,45 25,60" fill="none" stroke={color} strokeWidth="1" />
        {[10,20,30,40,50].map(y => <line key={y} x1="10" y1={y} x2="20" y2={y} stroke={color} strokeWidth="0.5" opacity="0.5" />)}
    </svg>
);

const ProteinRibbon = ({ size = 35, color = '#f97316' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
        <path d="M 5,35 C 10,20 15,25 20,10 C 25,-5 30,15 35,5" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {[{x:10,y:27},{x:20,y:10},{x:30,y:12}].map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} opacity="0.5" />)}
    </svg>
);

const MutationX = ({ size = 18, color = '#ef4444' }) => (
    <svg width={size} height={size} viewBox="0 0 20 20">
        <line x1="3" y1="3" x2="17" y2="17" stroke={color} strokeWidth="1.2" />
        <line x1="17" y1="3" x2="3" y2="17" stroke={color} strokeWidth="1.2" />
        <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="3 3" />
    </svg>
);

const CellShape = ({ size = 25, color = '#ec4899' }) => (
    <svg width={size} height={size} viewBox="0 0 30 30">
        <ellipse cx="15" cy="15" rx="13" ry="10" fill="none" stroke={color} strokeWidth="0.8" />
        <ellipse cx="15" cy="15" rx="5" ry="4" fill="none" stroke={color} strokeWidth="0.6" />
    </svg>
);

const MoleculeShape = ({ size = 22, color = '#ffffff' }) => (
    <svg width={size} height={size} viewBox="0 0 30 30">
        <circle cx="15" cy="8" r="3" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="8" cy="22" r="3" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="22" cy="22" r="3" fill="none" stroke={color} strokeWidth="0.8" />
        <line x1="15" y1="11" x2="10" y2="19" stroke={color} strokeWidth="0.6" />
        <line x1="15" y1="11" x2="20" y2="19" stroke={color} strokeWidth="0.6" />
        <line x1="11" y1="22" x2="19" y2="22" stroke={color} strokeWidth="0.6" />
    </svg>
);

const SHAPES = [VirusShape, HexagonShape, AntibodyShape, DNASegment, ProteinRibbon, MutationX, CellShape, MoleculeShape];
const COLORS = ['#ef4444', '#ec4899', '#f97316', '#ffffff', '#ef4444', '#ec4899', '#f97316', '#ffffff', '#fca5a5', '#fb923c'];

const AnimatedBackground = () => {
    const floaters = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => {
            const ShapeComponent = SHAPES[i % SHAPES.length];
            const color = COLORS[i % COLORS.length];
            const size = 12 + Math.random() * 20;
            return {
                id: i,
                ShapeComponent,
                color,
                size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.03 + Math.random() * 0.05,
                duration: 25 + Math.random() * 35,
                delay: -Math.random() * 20,
                rotateDur: 20 + Math.random() * 40,
                floatType: Math.floor(i % 4),
            };
        }), []);

    const particles = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: -Math.random() * 20,
            duration: `${10 + Math.random() * 10}s`,
            size: `${1 + Math.random() * 2}px`,
            opacity: 0.1 + Math.random() * 0.2,
        })), []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            <div className="bg-scene" />
            <div className="grid-pattern" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="orb orb-4" />

            {/* Floating molecular shapes — drifting like leaves in wind */}
            {floaters.map(f => (
                <div
                    key={f.id}
                    className="absolute"
                    style={{
                        left: f.left,
                        top: f.top,
                        opacity: f.opacity,
                        animation: `floatDrift${f.floatType} ${f.duration}s ease-in-out ${f.delay}s infinite`,
                        willChange: 'transform'
                    }}
                >
                    <div style={{
                        animation: `spin ${f.rotateDur}s linear infinite`,
                        willChange: 'transform'
                    }}>
                        <f.ShapeComponent size={f.size} color={f.color} />
                    </div>
                </div>
            ))}

            {/* Floating particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        animationDelay: `${p.delay}s`,
                        animationDuration: p.duration,
                        width: p.size,
                        height: p.size,
                        opacity: p.opacity,
                    }}
                />
            ))}

            {/* ─── Giant Background Decorators ─── */}
            
            {/* Left Side Decorators */}
            <div className="absolute -left-40 -top-20 opacity-[0.06]" style={{ animation: 'spin 120s linear infinite', willChange: 'transform' }}>
                <ProteinRibbon size={650} color="#ef4444" />
            </div>
            <div className="absolute -left-48 top-[35vh] opacity-[0.04]" style={{ animation: 'spin 90s linear infinite reverse', willChange: 'transform' }}>
                <MutationX size={700} color="#ec4899" />
            </div>
            <div className="absolute -left-32 top-[70vh] opacity-[0.05]" style={{ animation: 'spin 110s linear infinite', willChange: 'transform' }}>
                <MoleculeShape size={550} color="#f97316" />
            </div>
            <div className="absolute left-10 -bottom-40 opacity-[0.07]" style={{ animation: 'spin 130s linear infinite reverse', willChange: 'transform' }}>
                <AntibodyShape size={450} color="#ffffff" />
            </div>

            {/* Right Side Decorators */}
            <div className="absolute -right-32 -top-10 opacity-[0.05]" style={{ animation: 'spin 100s linear infinite reverse', willChange: 'transform' }}>
                <VirusShape size={500} color="#ffffff" />
            </div>
            <div className="absolute -right-48 top-[25vh] opacity-[0.07]" style={{ animation: 'spin 110s linear infinite', willChange: 'transform' }}>
                <CellShape size={750} color="#ec4899" />
            </div>
            <div className="absolute -right-40 top-[55vh] opacity-[0.04]" style={{ animation: 'spin 95s linear infinite reverse', willChange: 'transform' }}>
                <DNASegment size={600} color="#fb923c" />
            </div>
            <div className="absolute -right-20 -bottom-32 opacity-[0.06]" style={{ animation: 'spin 140s linear infinite', willChange: 'transform' }}>
                <HexagonShape size={550} color="#fca5a5" />
            </div>
        </div>
    );
};

/* ─── Results Dashboard ─── */
const ResultsDashboard = () => {
    const { proteinData } = useProtein();
    const mutationPos = proteinData.mutation ? parseInt(proteinData.mutation.match(/\d+/)?.[0]) : null;

    if (!proteinData.structure) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 relative z-10">
                <div className="glass rounded-3xl p-12 text-center space-y-4 max-w-md">
                    <Dna className="mx-auto text-blue-400 animate-pulse" size={48} />
                    <p className="text-gray-300 text-lg">No protein data yet</p>
                    <p className="text-gray-500 text-sm">Enter a sequence to begin analysis</p>
                    <Link to="/" className="inline-block mt-4 px-8 py-3 btn-primary rounded-xl font-semibold text-white">
                        <span>Start Analysis</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-blue-400 mb-2 transition-colors group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Analysis</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white text-glow">Analysis Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Structural & Mutational Insights</p>
                </div>
                <div className="flex gap-3">
                    <div className="stat-pill px-4 py-2 rounded-xl">
                        <p className="text-[9px] text-blue-400 uppercase font-bold tracking-widest">Length</p>
                        <p className="text-base font-bold font-mono">{proteinData.structure.sequence_length}</p>
                    </div>
                    <div className="stat-pill px-4 py-2 rounded-xl">
                        <p className="text-[9px] text-green-400 uppercase font-bold tracking-widest">pLDDT</p>
                        <p className="text-base font-bold font-mono">{proteinData.structure.mean_plddt}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 space-y-8">
                    <div className="animate-fade-in-up stagger-1">
                        <StructureViewer pdbString={proteinData.structure.pdb_string} mutationPos={mutationPos} />
                    </div>
                    <div className="animate-fade-in-up stagger-2">
                        <ProteinStats sequence={proteinData.sequence} plddt_scores={proteinData.structure.plddt_scores} />
                    </div>
                    <div className="animate-fade-in-up stagger-3">
                        <PerplexityComparison currentComparison={proteinData.comparison} />
                    </div>
                </div>
                <div className="xl:col-span-4 space-y-8">
                    <div className="animate-slide-right stagger-1">
                        <MutationCard analysis={proteinData.analysis} geneName={proteinData.geneName} plddtAtPos={proteinData.analysis?.plddt_at_position} />
                    </div>
                    <div className="animate-slide-right stagger-2">
                        <PLDDTChart data={proteinData.structure.plddt_scores} mutationPos={mutationPos} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Navigation ─── */
const Navigation = () => {
    const location = useLocation();
    return (
        <nav className="relative z-20 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        <Microscope className="text-white" size={22} />
                    </div>
                    <div>
                        <span className="text-base font-bold tracking-tight">
                            Prot<span className="text-blue-400">Path</span>
                        </span>
                        <p className="text-[8px] text-gray-600 uppercase tracking-[0.2em] font-semibold">Mutation Pipeline</p>
                    </div>
                </Link>
                <div className="flex items-center space-x-1">
                    {[
                        { path: '/', label: 'Analyze' },
                        { path: '/results', label: 'Dashboard' },
                        { path: '/about', label: 'About' },
                    ].map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                location.pathname === path
                                    ? 'text-blue-400 bg-blue-500/10 font-semibold'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

/* ─── Root App ─── */
const App = () => {
    const [toast, setToast] = useState(null);
    const showToast = (message, type) => setToast({ message, type });

    return (
        <ProteinProvider>
            <Router>
                <div className="min-h-screen relative">
                    <AnimatedBackground />
                    <div className="relative z-10">
                        <Navigation />
                        <main className="pb-20">
                            <Routes>
                                <Route path="/" element={<SequenceInput onToast={showToast} />} />
                                <Route path="/results" element={<ResultsDashboard />} />
                                <Route path="/about" element={<AboutPage />} />
                            </Routes>
                        </main>
                    </div>
                    {toast && <Toast {...toast} onClose={() => setToast(null)} />}
                </div>
            </Router>
        </ProteinProvider>
    );
};

export default App;
