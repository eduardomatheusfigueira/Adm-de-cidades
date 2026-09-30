import React from 'react';
import '../../styles/Logo.css';

// Símbolo da "malha": um recorte da malha municipal em quatro células.
// Três tons de petróleo (a escala de um mapa coroplético) e uma célula em
// terracota — o município selecionado. Geometria fixa: não redesenhe as células.
const CELULAS = [
  'M12 0 L25.25 0 L17.87 16.6 L0 20.36 L0 12 A12 12 0 0 1 12 0 Z',
  'M48 12 L48 19.23 L31.29 27.1 L20.93 17.6 L28.75 0 L36 0 A12 12 0 0 1 48 12 Z',
  'M0 36 L0 23.64 L18.52 19.74 L29.01 29.35 L19.19 48 L12 48 A12 12 0 0 1 0 36 Z',
  'M36 48 L22.81 48 L32.17 30.22 L48 22.77 L48 36 A12 12 0 0 1 36 48 Z',
];

const VARIANTES = {
  positiva: { celulas: ['#93C4D2', '#015668', '#3D899D', '#D5683B'], texto: '#00242D' },
  negativa: { celulas: ['#1D6E82', '#D6ECF3', '#67A6B8', '#E5845E'], texto: '#FFFFFF' },
  mono: { celulas: ['#00242D', '#00242D', '#00242D', '#00242D'], texto: '#00242D' },
  branca: { celulas: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], texto: '#FFFFFF' },
};

export const Simbolo = ({ tamanho = 32, variante = 'positiva', className = '', titulo }) => {
  const { celulas } = VARIANTES[variante] || VARIANTES.positiva;
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 48 48"
      className={`simbolo-sisinfo ${className}`}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {CELULAS.map((d, i) => <path key={i} d={d} fill={celulas[i]} />)}
    </svg>
  );
};

// Assinatura horizontal: o nome tem 70% da altura do símbolo, a 28% de distância.
const Logo = ({ tamanho = 32, variante = 'positiva', descritor = false, className = '' }) => {
  const { texto } = VARIANTES[variante] || VARIANTES.positiva;
  return (
    <span
      className={`logo-sisinfo ${className}`}
      style={{ gap: Math.round(tamanho * 0.28) }}
      role="img"
      aria-label={descritor ? 'SisInfo — Inteligência de dados municipais' : 'SisInfo'}
    >
      <Simbolo tamanho={tamanho} variante={variante} />
      <span className="logo-sisinfo-textos">
        <span className="logo-sisinfo-nome" style={{ fontSize: Math.round(tamanho * (descritor ? 0.62 : 0.7)), color: texto }}>
          SisInfo
        </span>
        {descritor && (
          <span className="logo-sisinfo-descritor" style={{ fontSize: Math.max(9, Math.round(tamanho * 0.17)) }}>
            Inteligência de dados municipais
          </span>
        )}
      </span>
    </span>
  );
};

export default Logo;
