import React, { useContext, useEffect, useRef, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { UIContext } from '../contexts/UIContext';
import { useProjectState } from '../hooks/useProjectState';
import { BIG_KEYS, loadAutosave, storeClear, storeSetMany } from '../utils/projectStore';

// Salvamento automático do trabalho no próprio navegador (IndexedDB).
// Ao abrir o app, se houver um trabalho salvo, pergunta se o aluno quer retomá-lo.
// Enquanto a pergunta não é respondida, nada é gravado (para não apagar o trabalho anterior).

const hasContent = (p) => !!p && (
  (p.annotations?.length || 0) > 0 ||
  (p.municipios?.length || 0) > 1 ||
  (p.geometrias?.features?.length || 0) > 0 ||
  (p.camadas?.length || 0) > 0 ||
  (p.indicadores?.length || 0) > 0 ||
  (p.exportPages?.length || 0) > 0 ||
  !!p.visualizationConfig
);

// Busca o modelo: nome simples → public/modelos/<nome>.json; ou uma URL completa de um .json público
async function fetchTemplate(modelo) {
  const isUrl = /^https?:\/\//i.test(modelo);
  if (!isUrl && !/^[\w-]{1,80}$/.test(modelo)) throw new Error('Nome de modelo inválido');
  const url = isUrl ? modelo : `${import.meta.env.BASE_URL || '/'}modelos/${modelo}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Arquivo não encontrado (HTTP ${res.status})`);
  const profile = await res.json();
  if (!profile || typeof profile !== 'object' || !('version' in profile)) throw new Error('O arquivo não é um perfil do SisInfo');
  return profile;
}

const formatDate = (ts) => new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export default function AutoSave() {
  const { buildProfile, applyProfile } = useProjectState();
  const { setActiveEnvironment } = useContext(UIContext);
  // 'checking' → procurando trabalho salvo; 'ask' → perguntando; 'on' → gravando; 'off' → sem IndexedDB
  const [status, setStatus] = useState('checking');
  const [pending, setPending] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const hideTimer = useRef(null);
  const writtenRefs = useRef({});
  const buildRef = useRef(buildProfile);
  buildRef.current = buildProfile;

  // Modelo do professor aberto por link (?modelo=nome ou ?modelo=https://...)
  const [template, setTemplate] = useState(null); // { name, profile, error }
  const [hasSaved, setHasSaved] = useState(false);

  const checkAutosave = () => loadAutosave()
    .then(saved => {
      if (saved && hasContent(saved.profile)) { setPending(saved); setStatus('ask'); }
      else setStatus('on');
    })
    .catch(() => setStatus('off'));

  // 1. Ao abrir: modelo do link (se houver) e depois o trabalho salvo neste aparelho
  useEffect(() => {
    const modelo = new URLSearchParams(window.location.search).get('modelo');
    if (!modelo) { checkAutosave(); return; }
    loadAutosave().then(saved => setHasSaved(!!saved && hasContent(saved.profile))).catch(() => {});
    fetchTemplate(modelo)
      .then(profile => { setTemplate({ name: modelo, profile }); setStatus('template'); })
      .catch(e => { setTemplate({ name: modelo, error: e.message }); setStatus('template'); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearModeloParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('modelo');
    window.history.replaceState(null, '', url.pathname + (url.search || '') + url.hash);
  };

  const openTemplate = () => {
    try { applyProfile(template.profile); } catch (e) { console.error('[AutoSave] Falha ao abrir o modelo:', e); }
    BIG_KEYS.forEach(k => { writtenRefs.current[k] = undefined; });
    setActiveEnvironment?.('map');
    clearModeloParam();
    setTemplate(null);
    setStatus('on');
  };

  const skipTemplate = () => {
    clearModeloParam();
    setTemplate(null);
    setStatus('checking');
    checkAutosave();
  };

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
      // O aviso "Salvo" aparece por alguns segundos e some (não fica por cima do mapa)
      setShowSaved(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowSaved(false), 2500);
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

  if (status === 'template' && template) {
    const info = template.profile?.modelo || {};
    return (
      <div className="autosave-resume" role="dialog" aria-live="polite">
        <div className="autosave-resume-text">
          {template.error ? (
            <>
              <strong>Não foi possível abrir o modelo “{template.name}”.</strong>
              <span>{template.error}. Confira o link com o professor.</span>
            </>
          ) : (
            <>
              <strong><GraduationCap size={16} strokeWidth={1.75} aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 6 }} />Modelo do professor: {info.titulo || template.name}</strong>
              {info.instrucoes && <span className="autosave-instructions">{info.instrucoes}</span>}
              <span>O mapa, os dados e as páginas do Estúdio deste modelo serão abertos para você continuar.
                {hasSaved ? ' O trabalho salvo neste aparelho será substituído.' : ''}</span>
            </>
          )}
        </div>
        <div className="autosave-resume-actions">
          {!template.error && <button type="button" className="autosave-btn-primary" onClick={openTemplate}>Abrir modelo</button>}
          <button type="button" className="autosave-btn" onClick={skipTemplate}>{template.error ? 'OK' : 'Agora não'}</button>
        </div>
      </div>
    );
  }

  if (status === 'ask' && pending) {
    const p = pending.profile;
    const parts = [
      p.municipios?.length > 1 && `${p.municipios.length} municípios`,
      p.geometrias?.features?.length && `${p.geometrias.features.length} geometrias`,
      p.camadas?.length && `${p.camadas.length} camada(s) de referência`,
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

  if (status === 'on' && lastSaved && showSaved) {
    return <div className="autosave-indicator" title="O trabalho é salvo automaticamente neste navegador">✓ Salvo às {new Date(lastSaved).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>;
  }
  return null;
}
