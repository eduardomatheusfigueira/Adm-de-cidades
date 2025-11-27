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
        control: (provided) => ({
            ...provided,
            backgroundColor: '#333',
            borderColor: '#555',
            color: '#fff',
            minHeight: '38px'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#333',
            color: '#fff',
            zIndex: 9999
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#555' : '#333',
            color: '#fff'
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#555',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        input: (provided) => ({
            ...provided,
            color: '#fff'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#fff'
        })
    };

    return (
        <div className="comparison-tab">
            <div className="chart-controls">
                <div className="control-group">
                    <label>Ano:</label>
                    <select
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
                    <label>Indicadores (Selecione para comparar):</label>
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
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 12 }} interval={0} />
                            <YAxis stroke="#ccc" label={{ value: 'Índice Posicional', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
                            <Tooltip
                                cursor={{ fill: '#444' }}
                                contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                                formatter={(value, name, props) => [
                                    <div>
                                        <div>Índice: {value.toFixed(4)}</div>
                                        <div style={{ fontSize: '0.8em', color: '#aaa' }}>Valor Real: {props.payload.valor} {props.payload.unit}</div>
                                    </div>,
                                    ''
                                ]}
                            />
                            <Bar dataKey="indice" fill="#82ca9d" name="Índice Posicional" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-placeholder">
                        Selecione indicadores para visualizar a comparação.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonTab;
