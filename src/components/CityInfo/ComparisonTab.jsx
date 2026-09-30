import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Select from 'react-select';

const ComparisonTab = ({ indicators }) => {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedIndicators, setSelectedIndicators] = useState([]);

    // Get unique years
    const availableYears = useMemo(() => {
        if (!indicators) return [];
        return [...new Set(indicators.map(ind => ind.Ano_Observacao))].sort((a, b) => b - a);
    }, [indicators]);

    // Set default year
    useMemo(() => {
        if (availableYears.length > 0 && !selectedYear) {
            setSelectedYear(availableYears[0]);
        }
    }, [availableYears, selectedYear]);

    // Get indicators for selected year
    const indicatorsForYear = useMemo(() => {
        if (!selectedYear || !indicators) return [];
        return indicators.filter(ind => ind.Ano_Observacao === selectedYear);
    }, [selectedYear, indicators]);

    // Options for multi-select
    const indicatorOptions = useMemo(() => {
        return indicatorsForYear.map(ind => ({
            value: ind.Nome_Indicador,
            label: ind.Nome_Indicador
        }));
    }, [indicatorsForYear]);

    // Prepare chart data
    const chartData = useMemo(() => {
        if (selectedIndicators.length === 0) return [];

        // For comparison, we might want to normalize or just show raw values.
        // Since units differ, showing raw values on one axis is tricky.
        // Let's show "Indice_Posicional" (0-1) for fair comparison if available, 
        // OR just show the raw values and let the user deal with scale diffs (or use multiple axes - complex).
        // The requirement says "comparação de indicadores... com gráfico de barras".
        // Let's use Indice_Posicional as it's normalized (assuming it exists and is 0-1).

        return selectedIndicators.map(option => {
            const ind = indicatorsForYear.find(i => i.Nome_Indicador === option.value);
            return {
                name: option.label,
                indice: parseFloat(ind?.Indice_Posicional || 0),
                valor: parseFloat(ind?.Valor || 0),
                unit: ind?.Unidade_Medida
            };
        });
    }, [selectedIndicators, indicatorsForYear]);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '40px',
            borderColor: state.isFocused ? '#015668' : '#CCC7BC',
            boxShadow: state.isFocused ? '0 0 0 3px #D6ECF3' : 'none',
            borderRadius: '8px',
            '&:hover': { borderColor: '#A39E93' },
        }),
        menu: (provided) => ({ ...provided, zIndex: 9999, borderRadius: '10px', boxShadow: '0 16px 40px rgba(0, 36, 45, 0.22)' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#015668' : state.isFocused ? '#EDF7FB' : '#FFFFFF',
            color: state.isSelected ? '#FFFFFF' : '#1A1814',
        }),
        multiValue: (provided) => ({ ...provided, backgroundColor: '#D6ECF3', borderRadius: '999px' }),
        multiValueLabel: (provided) => ({ ...provided, color: '#004554', fontWeight: 600 }),
    };

    return (
        <div className="comparison-tab">
            <div className="chart-controls">
                <div className="control-group">
                    <label htmlFor="cmp-ano">Ano</label>
                    <select
                        id="cmp-ano"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="year-select"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="control-group full-width">
                    <label>Indicadores para comparar</label>
                    <Select
                        isMulti
                        options={indicatorOptions}
                        value={selectedIndicators}
                        onChange={setSelectedIndicators}
                        styles={customStyles}
                        placeholder="Selecione indicadores..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>

            <div className="chart-container">
                {selectedIndicators.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid vertical={false} stroke="#F0ECE5" />
                            <XAxis dataKey="name" stroke="#CCC7BC" tick={{ fontSize: 12, fill: '#67635A' }} tickLine={false} interval={0} />
                            <YAxis stroke="#CCC7BC" tick={{ fontSize: 12, fill: '#67635A' }} axisLine={false} tickLine={false} label={{ value: 'Índice posicional', angle: -90, position: 'insideLeft', fill: '#67635A', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: '#EDF7FB' }}
                                contentStyle={{ backgroundColor: '#00242D', border: 'none', borderRadius: '8px', color: '#FFFFFF' }}
                                formatter={(value, name, props) => [
                                    <div key="valor">
                                        <div>Índice: {value.toFixed(4)}</div>
                                        <div style={{ fontSize: '0.8em', color: '#B8DBE6' }}>Valor real: {props.payload.valor} {props.payload.unit}</div>
                                    </div>,
                                    ''
                                ]}
                            />
                            <Bar dataKey="indice" fill="#3D899D" name="Índice posicional" radius={[4, 4, 0, 0]} maxBarSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-placeholder">
                        {indicators && indicators.length ? 'Escolha indicadores para comparar.' : 'Nenhum indicador importado para este município.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonTab;
