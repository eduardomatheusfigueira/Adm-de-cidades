import React, { useEffect, useRef, useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { BIG_KEYS, loadAutosave, storeClear, storeSetMany } from '../utils/projectStore';

// Salvamento automático do trabalho no próprio navegador (IndexedDB).
// Ao abrir o app, se houver um trabalho salvo, pergunta se o aluno quer retomá-lo.
// Enquanto a pergunta não é respondida, nada é gravado (para não apagar o trabalho anterior).

const hasContent = (p) => !!p && (
  (p.annotations?.length || 0) > 0 ||
  (p.municipios?.length || 0) > 1 ||
  (p.geometrias?.features?.length || 0) > 0 ||
  (p.indicadores?.length || 0) > 0 ||
  (p.exportPages?.length || 0) > 0 ||
  !!p.visualizationConfig
);

const formatDate = (ts) => new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export default function AutoSave() {
  const { buildProfile, applyProfile } = useProjectState();
  // 'checking' → procurando trabalho salvo; 'ask' → perguntando; 'on' → gravando; 'off' → sem IndexedDB
  const [status, setStatus] = useState('checking');
  const [pending, setPending] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const writtenRefs = useRef({});
  const buildRef = useRef(buildProfile);
  buildRef.current = buildProfile;

  // 1. Procurar um trabalho salvo ao abrir
  useEffect(() => {
    let cancelled = false;
    loadAutosave()
      .then(saved => {
        if (cancelled) return;
        if (saved && hasContent(saved.profile)) { setPending(saved); setStatus('ask'); }
        else setStatus('on');
      })
      .catch(() => { if (!cancelled) setStatus('off'); });
    return () => { cancelled = true; };
  }, []);

  // 2. Gravar (com atraso de 1,5 s depois da última mudança)
  const profile = buildProfile();
  const save = useRef(null);
  save.current = async () => {
    const p = buildRef.current();
    const entries = { meta: { savedAt: Date.now(), version: p.version } };
    const state = { ...p };
    for (const k of BIG_KEYS) {
      delete state[k];
      // Só regrava dados grandes quando o objeto mudou
      if (writtenRefs.current[k] !== p[k]) { entries[k] = p[k] ?? null; writtenRefs.current[k] = p[k]; }
    }
    entries.state = state;
    try {
      await storeSetMany(entries);
      setLastSaved(entries.meta.savedAt);
    } catch (e) {
      console.warn('[AutoSave] Falha ao salvar:', e);
      BIG_KEYS.forEach(k => { delete writtenRefs.current[k]; });
    }
  };

  useEffect(() => {
    if (status !== 'on') return undefined;
    const t = setTimeout(() => save.current(), 1500);
    return () => clearTimeout(t);
  }, [status, profile]);

  // Ao esconder a aba (trocar de app no celular, fechar), gravar imediatamente
  useEffect(() => {
    if (status !== 'on') return undefined;
    const flush = () => { if (document.visibilityState === 'hidden') save.current(); };
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pagehide', flush);
    return () => { document.removeEventListener('visibilitychange', flush); window.removeEventListener('pagehide', flush); };
  }, [status]);

  const resume = () => {
    try { applyProfile(pending.profile); } catch (e) { console.error('[AutoSave] Falha ao restaurar:', e); }
    // Os dados restaurados já estão no banco: não precisam ser regravados
    BIG_KEYS.forEach(k => { writtenRefs.current[k] = undefined; });
    setPending(null);
    setStatus('on');
  };

  const startFresh = async () => {
    try { await storeClear(); } catch (e) { /* ignore */ }
    setPending(null);
    setStatus('on');
  };

  if (status === 'ask' && pending) {
    const p = pending.profile;
    const parts = [
      p.municipios?.length > 1 && `${p.municipios.length} municípios`,
      p.geometrias?.features?.length && `${p.geometrias.features.length} geometrias`,
      p.annotations?.length && `${p.annotations.length} anotações`,
      p.exportPages?.length && `${p.exportPages.length} página(s) no Estúdio`,
    ].filter(Boolean);
    return (
      <div className="autosave-resume" role="dialog" aria-live="polite">
        <div className="autosave-resume-text">
          <strong>Continuar de onde parou?</strong>
          <span>Encontramos um trabalho salvo neste aparelho em {formatDate(pending.savedAt)}{parts.length ? ` (${parts.join(', ')})` : ''}.</span>
        </div>
        <div className="autosave-resume-actions">
          <button type="button" className="autosave-btn-primary" onClick={resume}>Retomar trabalho</button>
          <button type="button" className="autosave-btn" onClick={startFresh}>Começar do zero</button>
        </div>
      </div>
    );
  }

  if (status === 'on' && lastSaved) {
    return <div className="autosave-indicator" title="O trabalho é salvo automaticamente neste navegador">✓ Salvo às {new Date(lastSaved).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>;
  }
  return null;
}
