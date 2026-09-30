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

    if (!indicators || indicators.length === 0) return <div className="no-data-placeholder">Nenhum indicador importado para este município.</div>;

    return (
        <div className="time-series-tab">
            <div className="chart-controls">
                <label htmlFor="ts-indicador">Indicador</label>
                <select
                    id="ts-indicador"
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
                        <CartesianGrid vertical={false} stroke="#F0ECE5" />
                        <XAxis dataKey="year" stroke="#CCC7BC" tick={{ fill: '#67635A', fontSize: 12 }} tickLine={false} />
                        <YAxis stroke="#CCC7BC" tick={{ fill: '#67635A', fontSize: 12 }} tickLine={false} axisLine={false}
                            tickFormatter={(v) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v)} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#00242D', border: 'none', borderRadius: '8px', color: '#FFFFFF' }}
                            itemStyle={{ color: '#FFFFFF' }}
                            formatter={(value) => [new Intl.NumberFormat('pt-BR').format(value), 'Valor']}
                            labelStyle={{ color: '#B8DBE6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#015668"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#015668', stroke: '#FFFFFF', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TimeSeriesTab;
