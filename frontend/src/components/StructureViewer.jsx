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
    const v = window.$3Dmol.createViewer(viewerRef.current, { backgroundColor: 'rgba(0,0,0,0)' });
    v.addModel(pdbString, 'pdb');
    v.setStyle({}, { cartoon: { color: 'spectrum' } });
    if (mutationPos) {
      v.addStyle({ resi: mutationPos }, { stick: { color: '#ef4444', radius: 0.5 } });
      v.addLabel(`Mut ${mutationPos}`, {
        backgroundColor: 'rgba(220,38,38,0.75)',
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
    <div className="glass rounded-3xl overflow-hidden relative group">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
        <div className="flex items-center space-x-2">
          <Layers size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-gray-400 font-display">3D Structure</span>
          {mutationPos && (
            <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 font-bold">
              Mut @ {mutationPos}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={toggleSpin} title={spinning ? 'Pause' : 'Spin'}
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-500 hover:text-gray-200">
            {spinning ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button onClick={takeScreenshot} title="Screenshot"
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-500 hover:text-gray-200">
            <Camera size={13} />
          </button>
          <button onClick={() => { viewer?.spin(false); viewer?.zoomTo(); viewer?.render(); setSpinning(false); }} title="Reset"
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-500 hover:text-gray-200">
            <RefreshCw size={13} />
          </button>
          <button onClick={toggleFullscreen} title="Fullscreen"
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-500 hover:text-gray-200">
            <Expand size={13} />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div
        ref={viewerRef}
        className="w-full"
        style={{
          height: '480px',
          background: 'radial-gradient(ellipse at center, rgba(10,18,40,0.9) 0%, rgba(2,4,12,0.98) 100%)'
        }}
      />

      {/* Bottom Controls */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
        {/* Style */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {STYLES.map(s => (
            <button key={s} onClick={() => changeStyle(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                style === s ? 'bg-blue-600/20 text-blue-300' : 'text-gray-600 hover:text-gray-300'
              }`}>
              {s}
            </button>
          ))}
        </div>
        {/* Color */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => changeColor(c)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                color === c ? 'bg-violet-600/20 text-violet-300' : 'text-gray-600 hover:text-gray-300'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StructureViewer;
