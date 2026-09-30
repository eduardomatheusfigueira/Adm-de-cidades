import React, { useState } from 'react';

// Navegadores embutidos (link aberto dentro do Instagram, Facebook, WhatsApp no Android etc.)
// costumam bloquear downloads e apagar o armazenamento local. Avisa o aluno para abrir no
// navegador do aparelho.
const IN_APP_UA = /FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|MicroMessenger|; wv\)/i;

export default function InAppBrowserNotice() {
  const [dismissed, setDismissed] = useState(false);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  if (dismissed || !IN_APP_UA.test(ua)) return null;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  return (
    <div className="inapp-notice" role="alert">
      <span>
        <strong>Abra este site no {isIOS ? 'Safari' : 'Chrome'}.</strong> Dentro deste app, baixar imagens e salvar o trabalho pode não funcionar.
        Toque em <strong>⋯</strong> e escolha <strong>Abrir no navegador</strong>.
      </span>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Fechar aviso">✕</button>
    </div>
  );
}
