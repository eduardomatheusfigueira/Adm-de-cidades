import React from 'react';

// Captura erros de renderização para que uma falha em um componente não deixe a tela
// inteira em branco. Mostra uma mensagem em português e permite tentar de novo.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div role="alert" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: '#f6f7f8', fontFamily: 'Inter, system-ui, sans-serif', color: '#14213d',
      }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: 20, margin: '0 0 12px' }}>Algo deu errado</h1>
          <p style={{ margin: '0 0 12px', lineHeight: 1.5 }}>
            Uma parte do aplicativo encontrou um erro. Tente continuar; se não funcionar, recarregue a página.
          </p>
          <p style={{ margin: '0 0 20px', lineHeight: 1.5, fontSize: 14, color: '#475569' }}>
            Dica: use <strong>Salvar Perfil</strong> no menu de dados com frequência para não perder o trabalho.
          </p>
          <details style={{ marginBottom: 20, fontSize: 12, color: '#64748b' }}>
            <summary>Detalhes técnicos</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{String(error?.message || error)}</pre>
          </details>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => this.setState({ error: null })}
              style={{ minHeight: 44, padding: '0 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 15 }}>
              Tentar continuar
            </button>
            <button type="button" onClick={() => window.location.reload()}
              style={{ minHeight: 44, padding: '0 16px', borderRadius: 8, border: 'none', background: '#14213d', color: '#fff', cursor: 'pointer', fontSize: 15 }}>
              Recarregar a página
            </button>
          </div>
        </div>
      </div>
    );
  }
}
