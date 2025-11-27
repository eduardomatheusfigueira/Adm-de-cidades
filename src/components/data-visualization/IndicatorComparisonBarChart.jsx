import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../../styles/data-visualization/IndicatorComparisonBarChart.css';
import Select from 'react-select';

const IndicatorComparisonBarChart = ({ indicadoresData, cityCode, selectedYear }) => {
  const chartRef = useRef();
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]);

  useEffect(() => {
    if (!indicadoresData || !cityCode || !selectedYear) {
      return;
    }

    const cityIndicatorsAll = indicadoresData.filter(
      indicator => indicator.Codigo_Municipio === cityCode && indicator.Ano_Observacao === selectedYear
    );

    if (cityIndicatorsAll.length === 0) {
      d3.select(chartRef.current).select("svg").remove();
      return;
    }

    // Set available indicators for selection
    const indicatorNames = cityIndicatorsAll.map(indicator => indicator.Nome_Indicador);
    setAvailableIndicators(indicatorNames);

    // Pre-select top 5 indicators if none selected
    if (selectedIndicators.length === 0 && indicatorNames.length > 0) {
      const sortedByScore = [...cityIndicatorsAll].sort((a, b) => parseFloat(b.Indice_Posicional) - parseFloat(a.Indice_Posicional));
      const top5 = sortedByScore.slice(0, 5).map(d => d.Nome_Indicador);
      setSelectedIndicators(top5);
      return;
    }

    // Initially, no indicators are selected, chart will be empty until selection
    if (selectedIndicators.length === 0) {
      d3.select(chartRef.current).select("svg").remove();
      return;
    }

    const cityIndicators = cityIndicatorsAll.filter(indicator =>
      selectedIndicators.includes(indicator.Nome_Indicador)
    );

    // Sort indicators by Indice_Posicional in descending order
    cityIndicators.sort((a, b) => parseFloat(b.Indice_Posicional) - parseFloat(a.Indice_Posicional));

    // Responsive dimensions
    const margin = { top: 10, right: 120, bottom: 40, left: 40 };
    const width = 800;
    const height = 180;

    // Clear previous SVG
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%")
      .style("max-height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create an index for each indicator
    const indicatorIndexMap = selectedIndicators.reduce((map, name, index) => {
      map[name] = index + 1;
      return map;
    }, {});

    const x = d3.scaleBand()
      .range([0, width])
      .domain(cityIndicators.map(d => indicatorIndexMap[d.Nome_Indicador]))
      .padding(0.2);

    // Fix Scale: Use dynamic max based on data
    const maxVal = d3.max(cityIndicators, d => parseFloat(d.Indice_Posicional)) || 0;
    // Ensure we have a valid domain even if maxVal is 0
    const yDomainMax = maxVal > 0 ? maxVal * 1.1 : 1;

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, yDomainMax]);

    // Color scale for indicators
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(selectedIndicators);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", "var(--text-primary)")
      .style("font-size", "12px")
      .text(d => d);

    // Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", "var(--text-primary)")
      .style("font-size", "12px");

    // Bars
    svg.selectAll(".bar")
      .data(cityIndicators)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(indicatorIndexMap[d.Nome_Indicador]))
      .attr("y", d => y(parseFloat(d.Indice_Posicional)))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(parseFloat(d.Indice_Posicional)))
      .attr("fill", d => colorScale(d.Nome_Indicador));

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "var(--text-secondary)")
      .style("font-size", "12px")
      .text("Índice Posicional");

    // Legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 10}, 0)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(selectedIndicators)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 15})`);

    legendItems.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => colorScale(d));

    legendItems.append("text")
      .attr("x", 15)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("fill", "var(--text-primary)")
      .style("font-size", "12px")
      .text(d => `${indicatorIndexMap[d]} - ${d.substring(0, 15)}...`);

  }, [indicadoresData, cityCode, selectedYear, selectedIndicators]);

  const handleIndicatorChange = (selectedOptions) => {
    setSelectedIndicators(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
  };

  const options = availableIndicators.map(ind => ({ value: ind, label: ind }));
  const valueOptions = selectedIndicators.map(ind => ({ value: ind, label: ind }));

  return (
    <div className="indicator-comparison-bar-chart" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="chart-header" style={{ marginBottom: '5px', zIndex: 1001 }}>
        <div className="indicator-selection" style={{ width: '100%' }}>
          <Select
            isMulti
            options={options}
            value={valueOptions}
            onChange={handleIndicatorChange}
            placeholder="Selecione indicadores..."
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              control: base => ({ ...base, minHeight: '28px', height: '28px', fontSize: '0.75rem', padding: '0' }),
              valueContainer: base => ({ ...base, padding: '0 4px' }),
              input: base => ({ ...base, margin: '0', padding: '0' }),
              indicatorsContainer: base => ({ ...base, height: '28px' }),
              dropdownIndicator: base => ({ ...base, padding: '2px' }),
              clearIndicator: base => ({ ...base, padding: '2px' }),
              multiValue: base => ({ ...base, margin: '1px' }),
              multiValueLabel: base => ({ ...base, padding: '1px 4px', fontSize: '0.7rem' }),
              multiValueRemove: base => ({ ...base, padding: '0 2px' }),
            }}
          />
        </div>
      </div>
      <div ref={chartRef} style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}></div>
    </div>
  );
};

export default IndicatorComparisonBarChart;
