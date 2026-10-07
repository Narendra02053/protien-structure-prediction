import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Expand, Pause, Play, Layers } from 'lucide-react';

const STYLES = ['cartoon', 'stick', 'sphere', 'surface'];
const COLORS = ['spectrum', 'chain', 'white'];

const StructureViewer = ({ pdbString, mutationPos }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [style, setStyle] = useState('cartoon');
  const [color, setColor] = useState('spectrum');
  const [spinning, setSpinning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!pdbString || !viewerRef.current) return;
    const v = window.$3Dmol.createViewer(viewerRef.current, { backgroundColor: '#0b0f19' });
    v.addModel(pdbString, 'pdb');
    v.setStyle({}, { cartoon: { color: 'spectrum' } });
    if (mutationPos) {
      v.addStyle({ resi: mutationPos }, { stick: { color: '#ef4444', radius: 0.5 } });
      v.addLabel(`Mut ${mutationPos}`, {
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        fontColor: 'white',
        fontSize: 11,
        position: { resi: mutationPos }
      });
    }
    v.zoomTo();
    v.render();
    v.spin('y', 0.5);
    setViewer(v);
    return () => { if (v) v.clear(); };
  }, [pdbString, mutationPos]);

  const applyStyle = (s, c) => {
    if (!viewer) return;
    viewer.setStyle({}, { [s]: { color: c } });
    if (mutationPos) viewer.addStyle({ resi: mutationPos }, { stick: { color: '#ef4444', radius: 0.5 } });
    viewer.render();
  };

  const changeStyle = (s) => { setStyle(s); applyStyle(s, color); };
  const changeColor = (c) => { setColor(c); applyStyle(style, c); };

  const toggleSpin = () => {
    if (!viewer) return;
    if (spinning) { viewer.spin(false); } else { viewer.spin('y', 0.5); }
    setSpinning(!spinning);
  };

  const takeScreenshot = () => {
    if (!viewer) return;
    const link = document.createElement('a');
    link.href = viewer.pngURI();
    link.download = 'protein_structure.png';
    link.click();
  };

  const toggleFullscreen = () => {
    const el = viewerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) { el.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  return (
    <div className="glass overflow-hidden relative border border-slate-800">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Control Bar Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center space-x-2.5">
          <Layers size={16} className="text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200">Interactive 3D Structure Viewer</span>
          {mutationPos && (
            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-[11px] text-red-400 font-medium rounded-full">
              Mut @ {mutationPos}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <button onClick={toggleSpin} title={spinning ? 'Pause Rotation' : 'Rotate Structure'} className="neo-btn-icon">
            {spinning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={takeScreenshot} title="Save High-Res PNG" className="neo-btn-icon">
            <Camera size={14} />
          </button>
          <button onClick={() => { viewer?.spin(false); viewer?.zoomTo(); viewer?.render(); setSpinning(false); }} title="Reset Orientation" className="neo-btn-icon">
            <RefreshCw size={14} />
          </button>
          <button onClick={toggleFullscreen} title="Toggle Fullscreen" className="neo-btn-icon">
            <Expand size={14} />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        ref={viewerRef}
        className="w-full border-b border-slate-800"
        style={{
          height: '460px',
          background: '#0b0f19'
        }}
      />

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-950/80">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Representation:</span>
          <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
            {STYLES.map(s => (
              <button key={s} onClick={() => changeStyle(s)}
                className={`px-3 py-1 text-xs font-medium capitalize rounded-md transition-all ${
                  style === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Coloring:</span>
          <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
            {COLORS.map(c => (
              <button key={c} onClick={() => changeColor(c)}
                className={`px-3 py-1 text-xs font-medium capitalize rounded-md transition-all ${
                  color === c ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureViewer;
