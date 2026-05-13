import React, { useContext, useRef, useCallback, useState } from 'react';
import '../styles/Graticule.css';
import { UIContext } from '../contexts/UIContext';

const Graticule = () => {
  const { showGraticule, setShowGraticule, graticuleStyle, setGraticuleStyle } = useContext(UIContext);
  const [editorOpen, setEditorOpen] = useState(false);
  const elRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onDragStart = useCallback((e) => {
    // Only drag from the header area
    if (!elRef.current || !e.target.closest('.graticule-header')) return;
    if (e.target.closest('button')) return;
    e.preventDefault();
    isDraggingRef.current = true;
    const rect = elRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const onMove = (ev) => {
      if (!isDraggingRef.current || !elRef.current) return;
      const parent = elRef.current.parentElement;
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      let x = ev.clientX - pr.left - offsetRef.current.x;
      let y = ev.clientY - pr.top - offsetRef.current.y;
      const w = elRef.current.offsetWidth;
      const h = elRef.current.offsetHeight;
      x = Math.max(0, Math.min(x, pr.width - w));
      y = Math.max(0, Math.min(y, pr.height - h));
      elRef.current.style.left = x + 'px';
      elRef.current.style.top = y + 'px';
      elRef.current.style.right = 'auto';
      elRef.current.style.transform = 'none';
    };

    const onUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const updateStyle = useCallback((key, value) => {
    setGraticuleStyle(prev => ({ ...prev, [key]: value }));
  }, [setGraticuleStyle]);

  if (!showGraticule) return null;

  return (
    <div
      ref={elRef}
      className="graticule-control"
      onMouseDown={onDragStart}
    >
      {/* Header */}
      <div className="graticule-header">
        <span className="graticule-label">🌐 Paralelos e Meridianos</span>
        <div className="graticule-header-btns">
          <button
            onClick={(e) => { e.stopPropagation(); setEditorOpen(v => !v); }}
            title={editorOpen ? 'Fechar editor de estilo' : 'Editar estilo'}
            style={{ fontSize: '0.75rem' }}
          >
            ⚙
          </button>
          <button
            className="graticule-close-btn"
            onClick={(e) => { e.stopPropagation(); setShowGraticule(false); }}
            title="Ocultar paralelos e meridianos"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Editor Panel */}
      {editorOpen && (
        <div className="graticule-editor" onClick={e => e.stopPropagation()}>
          {/* === TEXT Section === */}
          <div className="graticule-editor-section">
            <span className="graticule-editor-section-title">Texto</span>

            {/* Font size + Bold + Italic */}
            <div className="graticule-editor-row">
              <label>Tamanho</label>
              <input
                type="number"
                min={6}
                max={18}
                step={1}
                value={graticuleStyle.fontSize}
                onChange={e => updateStyle('fontSize', Number(e.target.value))}
              />
              <button
                className={`graticule-toggle-btn ${graticuleStyle.bold ? 'active' : ''}`}
                onClick={() => updateStyle('bold', !graticuleStyle.bold)}
                title="Negrito"
                style={{ fontWeight: 'bold' }}
              >
                B
              </button>
              <button
                className={`graticule-toggle-btn ${graticuleStyle.italic ? 'active' : ''}`}
                onClick={() => updateStyle('italic', !graticuleStyle.italic)}
                title="Itálico"
                style={{ fontStyle: 'italic' }}
              >
                I
              </button>
            </div>

            {/* Text color */}
            <div className="graticule-editor-row">
              <label>Cor texto</label>
              <input
                type="color"
                value={graticuleStyle.textColor}
                onChange={e => updateStyle('textColor', e.target.value)}
              />
              <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{graticuleStyle.textColor}</span>
            </div>

            {/* Halo toggle + color + width */}
            <div className="graticule-editor-row">
              <label>Borda</label>
              <button
                className={`graticule-toggle-btn ${graticuleStyle.showHalo ? 'active' : ''}`}
                onClick={() => updateStyle('showHalo', !graticuleStyle.showHalo)}
                title={graticuleStyle.showHalo ? 'Desativar borda' : 'Ativar borda'}
              >
                {graticuleStyle.showHalo ? 'ON' : 'OFF'}
              </button>
              {graticuleStyle.showHalo && (
                <>
                  <input
                    type="color"
                    value={graticuleStyle.haloColor}
                    onChange={e => updateStyle('haloColor', e.target.value)}
                    title="Cor da borda"
                  />
                  <input
                    type="range"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={graticuleStyle.haloWidth}
                    onChange={e => updateStyle('haloWidth', Number(e.target.value))}
                    title="Espessura da borda"
                  />
                  <span style={{ fontSize: '0.6rem', opacity: 0.5, minWidth: 20 }}>{graticuleStyle.haloWidth}</span>
                </>
              )}
            </div>
          </div>

          <div className="graticule-editor-sep" />

          {/* === LINE Section === */}
          <div className="graticule-editor-section">
            <span className="graticule-editor-section-title">Linha</span>

            {/* Line color */}
            <div className="graticule-editor-row">
              <label>Cor</label>
              <input
                type="color"
                value={rgbaToHex(graticuleStyle.lineColor)}
                onChange={e => {
                  const hex = e.target.value;
                  const opacity = graticuleStyle.lineOpacity;
                  updateStyle('lineColor', hexToRgba(hex, opacity));
                }}
              />
            </div>

            {/* Line width */}
            <div className="graticule-editor-row">
              <label>Espessura</label>
              <input
                type="range"
                min={0.2}
                max={3}
                step={0.1}
                value={graticuleStyle.lineWidth}
                onChange={e => updateStyle('lineWidth', Number(e.target.value))}
              />
              <span style={{ fontSize: '0.6rem', opacity: 0.5, minWidth: 20 }}>{graticuleStyle.lineWidth}</span>
            </div>

            {/* Line opacity */}
            <div className="graticule-editor-row">
              <label>Opacidade</label>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={graticuleStyle.lineOpacity}
                onChange={e => {
                  const opacity = Number(e.target.value);
                  updateStyle('lineOpacity', opacity);
                  // Also update the lineColor rgba
                  const hex = rgbaToHex(graticuleStyle.lineColor);
                  updateStyle('lineColor', hexToRgba(hex, opacity));
                }}
              />
              <span style={{ fontSize: '0.6rem', opacity: 0.5, minWidth: 25 }}>{Math.round(graticuleStyle.lineOpacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility: extract hex from rgba string
function rgbaToHex(rgba) {
  if (!rgba) return '#788caa';
  if (rgba.startsWith('#')) return rgba;
  const match = rgba.match(/[\d.]+/g);
  if (!match || match.length < 3) return '#788caa';
  const r = Math.round(Number(match[0]));
  const g = Math.round(Number(match[1]));
  const b = Math.round(Number(match[2]));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Utility: hex + alpha → rgba string
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default Graticule;
