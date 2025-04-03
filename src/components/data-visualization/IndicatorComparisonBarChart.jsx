import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../../styles/data-visualization/IndicatorComparisonBarChart.css';

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
    setAvailableIndicators(cityIndicatorsAll.map(indicator => indicator.Nome_Indicador));

    // Initially, no indicators are selected, chart will be empty until selection
    if (selectedIndicators.length === 0) {
      d3.select(chartRef.current).select("svg").remove(); // Clear previous chart
      return;
    }

    const cityIndicators = cityIndicatorsAll.filter(indicator =>
      selectedIndicators.includes(indicator.Nome_Indicador)
    );

    // Sort indicators by Indice_Posicional in descending order
    cityIndicators.sort((a, b) => parseFloat(b.Indice_Posicional) - parseFloat(a.Indice_Posicional));

    const margin = { top: 40, right: 150, bottom: 70, left: 90 }; // Increased right margin for legend
    const width = 1200 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom; // Reduced chart height

    // Clear previous SVG
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create an index for each indicator
    const indicatorIndexMap = selectedIndicators.reduce((map, name, index) => {
      map[name] = index + 1;
      return map;
    }, {});

    const x = d3.scaleBand()
      .range([0, width])
      .domain(cityIndicators.map(d => indicatorIndexMap[d.Nome_Indicador])) // Use index for x-axis domain
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(cityIndicators, d => parseFloat(d.Indice_Posicional))]);

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
      .style("fill", "white")
      .text(d => d); // Display index on x-axis

    // Y axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white");

    // Bars
    svg.selectAll(".bar")
      .data(cityIndicators)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(indicatorIndexMap[d.Nome_Indicador])) // Use index for x position
      .attr("y", d => y(parseFloat(d.Indice_Posicional)))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(parseFloat(d.Indice_Posicional)))
      .attr("fill", d => colorScale(d.Nome_Indicador)); // Use color scale here

    // Chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text(`Comparação de Indicadores - ${selectedYear}`); // Title is set here

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .text("Índice Posicional");

    // Legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 20}, ${height / 2 - (selectedIndicators.length * 10)})`); // Position legend on the right

    const legendItems = legend.selectAll(".legend-item")
      .data(selectedIndicators)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

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
      .style("fill", "white")
      .text(d => `${indicatorIndexMap[d]} - ${d}`); // Add index to legend text

  }, [indicadoresData, cityCode, selectedYear, selectedIndicators]);

  const handleIndicatorChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedIndicators(selectedOptions);
  };

  return (
    <div className="indicator-comparison-bar-chart">
      <div className="chart-header">
        <h3>Comparação de Indicadores - {selectedYear}</h3>
        <div className="indicator-selection">
          <select
            multiple
            value={selectedIndicators}
            onChange={handleIndicatorChange}
          >
            {availableIndicators.map(indicatorName => (
              <option key={indicatorName} value={indicatorName}>
                {indicatorName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div ref={chartRef}></div>
    </div>
  );
};

export default IndicatorComparisonBarChart;
