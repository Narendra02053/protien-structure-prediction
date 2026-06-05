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
import { Microscope, ChevronLeft, Dna, BarChart3, BookOpen, Atom, Zap } from 'lucide-react';

/* ─── SVG Molecular Shapes ─── */
const VirusShape = ({ size = 20, color = '#2563eb' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="9" fill="none" stroke={color} strokeWidth="0.8" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
      const rad = (deg * Math.PI) / 180;
      return <g key={deg}>
        <line x1={20+Math.cos(rad)*9} y1={20+Math.sin(rad)*9} x2={20+Math.cos(rad)*17} y2={20+Math.sin(rad)*17} stroke={color} strokeWidth="0.7" />
        <circle cx={20+Math.cos(rad)*17} cy={20+Math.sin(rad)*17} r="1.5" fill={color} opacity="0.5" />
      </g>;
    })}
  </svg>
);
const HexShape = ({ size = 22, color = '#7c3aed' }) => (
  <svg width={size} height={size} viewBox="0 0 30 30">
    <polygon points="15,2 27,9 27,21 15,28 3,21 3,9" fill="none" stroke={color} strokeWidth="0.8" />
    <polygon points="15,7 22,11 22,19 15,23 8,19 8,11" fill="none" stroke={color} strokeWidth="0.4" opacity="0.5" />
  </svg>
);
const DNAShape = ({ size = 28, color = '#06b6d4' }) => (
  <svg width={size} height={size * 2} viewBox="0 0 30 60">
    <path d="M 5,0 Q 25,15 5,30 Q -15,45 5,60" fill="none" stroke={color} strokeWidth="1" />
    <path d="M 25,0 Q 5,15 25,30 Q 45,45 25,60" fill="none" stroke={color} strokeWidth="1" />
    {[8,18,28,38,48].map(y => <line key={y} x1="9" y1={y} x2="21" y2={y} stroke={color} strokeWidth="0.5" opacity="0.4" />)}
  </svg>
);
const MolShape = ({ size = 22, color = '#a78bfa' }) => (
  <svg width={size} height={size} viewBox="0 0 30 30">
    <circle cx="15" cy="7" r="3" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="7" cy="22" r="3" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="23" cy="22" r="3" fill="none" stroke={color} strokeWidth="0.8" />
    <line x1="15" y1="10" x2="9" y2="19" stroke={color} strokeWidth="0.6" />
    <line x1="15" y1="10" x2="21" y2="19" stroke={color} strokeWidth="0.6" />
    <line x1="10" y1="22" x2="20" y2="22" stroke={color} strokeWidth="0.6" />
  </svg>
);
const RibbonShape = ({ size = 35, color = '#34d399' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M 5,35 C 10,20 15,25 20,10 C 25,-5 30,15 35,5" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    {[{x:10,y:27},{x:20,y:10},{x:30,y:12}].map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} opacity="0.5" />)}
  </svg>
);

const SHAPES = [VirusShape, HexShape, DNAShape, MolShape, RibbonShape];
const SHAPE_COLORS = ['#2563eb','#7c3aed','#06b6d4','#a78bfa','#34d399','#60a5fa','#818cf8','#22d3ee'];

/* ─── Animated Background ─── */
const AnimatedBackground = () => {
  const floaters = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => {
      const ShapeComponent = SHAPES[i % SHAPES.length];
      const color = SHAPE_COLORS[i % SHAPE_COLORS.length];
      const size = 10 + Math.random() * 18;
      return {
        id: i, ShapeComponent, color, size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.025 + Math.random() * 0.04,
        duration: 28 + Math.random() * 30,
        delay: -Math.random() * 25,
        rotateDur: 25 + Math.random() * 45,
        floatType: i % 4,
      };
    }), []);

  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${-Math.random() * 18}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${1 + Math.random() * 1.5}px`,
      opacity: 0.15 + Math.random() * 0.25,
      color: SHAPE_COLORS[i % SHAPE_COLORS.length],
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="bg-scene" />
      <div className="grid-pattern" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      {floaters.map(f => (
        <div key={f.id} className="absolute" style={{
          left: f.left, top: f.top, opacity: f.opacity,
          animation: `floatDrift${f.floatType} ${f.duration}s ease-in-out ${f.delay}s infinite`,
          willChange: 'transform'
        }}>
          <div style={{ animation: `spin ${f.rotateDur}s linear infinite`, willChange: 'transform' }}>
            <f.ShapeComponent size={f.size} color={f.color} />
          </div>
        </div>
      ))}

      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left,
          animationDelay: p.delay,
          animationDuration: p.duration,
          width: p.size, height: p.size,
          opacity: p.opacity,
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
        }} />
      ))}

      {/* Large decorative shapes */}
      <div className="absolute -left-48 -top-24 opacity-[0.04]" style={{ animation: 'spin 150s linear infinite' }}>
        <DNAShape size={700} color="#2563eb" />
      </div>
      <div className="absolute -right-40 top-[20vh] opacity-[0.03]" style={{ animation: 'spin 120s linear infinite reverse' }}>
        <VirusShape size={600} color="#7c3aed" />
      </div>
      <div className="absolute -right-32 bottom-[10vh] opacity-[0.04]" style={{ animation: 'spin 100s linear infinite' }}>
        <HexShape size={500} color="#06b6d4" />
      </div>
      <div className="absolute left-[5vw] bottom-[5vh] opacity-[0.03]" style={{ animation: 'spin 130s linear infinite reverse' }}>
        <MolShape size={450} color="#a78bfa" />
      </div>
    </div>
  );
};

/* ─── Navigation ─── */
const Navigation = () => {
  const location = useLocation();
  const navLinks = [
    { path: '/', label: 'Analyze', icon: <Zap size={14} /> },
    { path: '/results', label: 'Dashboard', icon: <BarChart3 size={14} /> },
    { path: '/about', label: 'About', icon: <BookOpen size={14} /> },
  ];

  return (
    <nav className="relative z-20 border-b border-white/[0.05]" style={{
      background: 'rgba(4, 8, 20, 0.80)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center">
              <Atom className="text-white" size={20} />
            </div>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight font-display">
              Prot<span className="text-blue-400">Path</span>
            </div>
            <div className="text-[8px] text-gray-600 uppercase tracking-[0.25em] font-semibold">Mutation Pipeline</div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {navLinks.map(({ path, label, icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-blue-600/20 text-blue-300 shadow-inner'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}>
                <span className={active ? 'text-blue-400' : 'text-gray-600'}>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Status badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)' }}>
          <div className="pulse-dot" />
          <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">API Online</span>
        </div>
      </div>
    </nav>
  );
};

/* ─── Results Dashboard ─── */
const ResultsDashboard = () => {
  const { proteinData } = useProtein();
  const match = proteinData.mutation?.match(/\d+/);
  const mutationPos = match ? parseInt(match[0]) : null;

  if (!proteinData.structure) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative z-10 px-6">
        <div className="glass rounded-3xl p-14 text-center space-y-6 max-w-md w-full animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Dna className="text-blue-400" size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white font-display">No Analysis Yet</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Enter a protein sequence on the Analyze page to generate structural and mutational insights.</p>
          </div>
          <Link to="/" className="inline-flex items-center space-x-2 px-8 py-3.5 btn-primary rounded-xl font-semibold text-white text-sm">
            <Zap size={16} />
            <span>Start Analysis</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
        <div>
          <Link to="/" className="inline-flex items-center text-xs text-gray-600 hover:text-blue-400 mb-3 transition-colors group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform mr-1" />
            Back to Analysis
          </Link>
          <h1 className="text-3xl font-bold text-white font-display text-glow">Analysis Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Structural & Mutational Insights</p>
        </div>
        <div className="flex gap-3">
          {[
            { label: 'Length', value: proteinData.structure.sequence_length, color: 'text-blue-400', accent: 'border-blue-500/20' },
            { label: 'Mean pLDDT', value: proteinData.structure.mean_plddt, color: 'text-emerald-400', accent: 'border-emerald-500/20' },
          ].map(s => (
            <div key={s.label} className={`stat-pill px-5 py-3 rounded-xl border ${s.accent}`}>
              <p className={`text-[9px] ${s.color} uppercase font-bold tracking-widest`}>{s.label}</p>
              <p className="text-lg font-bold font-mono text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="section-divider" />

      {/* Main Grid */}
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
            <main className="pb-24">
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
