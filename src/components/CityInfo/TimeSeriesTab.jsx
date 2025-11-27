import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimeSeriesTab = ({ indicators }) => {
    const [selectedIndicator, setSelectedIndicator] = useState('');

    // Get unique indicator names
    const uniqueIndicators = useMemo(() => {
        if (!indicators) return [];
        return [...new Set(indicators.map(ind => ind.Nome_Indicador))].sort();
    }, [indicators]);

    // Set default selection
    useMemo(() => {
        if (uniqueIndicators.length > 0 && !selectedIndicator) {
            setSelectedIndicator(uniqueIndicators[0]);
        }
    }, [uniqueIndicators, selectedIndicator]);

    // Prepare data for chart
    const chartData = useMemo(() => {
        if (!selectedIndicator || !indicators) return [];
        return indicators
            .filter(ind => ind.Nome_Indicador === selectedIndicator)
            .map(ind => ({
                year: ind.Ano_Observacao,
                value: parseFloat(ind.Valor),
                unit: ind.Unidade_Medida
            }))
            .sort((a, b) => a.year - b.year);
    }, [selectedIndicator, indicators]);

    if (!indicators || indicators.length === 0) return <div className="no-data">Sem dados disponíveis.</div>;

    return (
        <div className="time-series-tab">
            <div className="chart-controls">
                <label>Selecione o Indicador:</label>
                <select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    className="indicator-select"
                >
                    {uniqueIndicators.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                    ))}
                </select>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="year" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [new Intl.NumberFormat('pt-BR').format(value), 'Valor']}
                            labelStyle={{ color: '#aaa' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#8884d8' }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TimeSeriesTab;
