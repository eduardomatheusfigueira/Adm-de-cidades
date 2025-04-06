import React, { useState, useEffect } from 'react';
import '../../styles/data-visualization/TimeSeriesView.css';
import * as d3 from 'd3';

const TimeSeriesView = ({ indicadoresData, selectedCity }) => {
  const [timeSeriesData, setTimeSeriesData] = useState({}); // Changed to object to hold multiple indicators data
  const [selectedIndicators, setSelectedIndicators] = useState([]); // Changed to array for multiple indicators
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [valueType, setValueType] = useState('value'); // 'value' or 'position'
  const [chart, setChart] = useState(null); // State to hold the chart instance

  // Effect to load available indicators for the selected city
  useEffect(() => {
    if (!indicadoresData || !selectedCity) {
      setAvailableIndicators([]);
      return;
    }

    // Get all unique indicators for the selected city
    const uniqueIndicators = [...new Set(
      indicadoresData
        .filter(item => item.Codigo_Municipio === selectedCity.properties.CD_MUN) // Correct access using properties
        .map(item => item.Nome_Indicador)
    )];

    setAvailableIndicators(uniqueIndicators);

    // Initialize selectedIndicators with the first indicator if available
    if (uniqueIndicators.length > 0 && selectedIndicators.length === 0) {
      setSelectedIndicators([uniqueIndicators[0]]);
    }
  }, [indicadoresData, selectedCity, selectedIndicators]);

  // Effect to fetch time series data for selected indicators
  useEffect(() => {
    if (!indicadoresData || !selectedCity || selectedIndicators.length === 0) {
      setTimeSeriesData({});
      return;
    }

    const fetchData = async () => {
      const newData = {};
      for (const indicator of selectedIndicators) {
        const filteredData = indicadoresData.filter(
          item => item.Nome_Indicador === indicator &&
                  item.Codigo_Municipio === selectedCity.properties.CD_MUN // Correct access using properties
        );
        if (filteredData.length > 0) {
          // Sort data by year
          const sortedData = filteredData.sort((a, b) =>
            d3.ascending(parseInt(a.Ano_Observacao), parseInt(b.Ano_Observacao))
          );
          newData[indicator] = sortedData;
        } else {
          newData[indicator] = [];
        }
      }
      setTimeSeriesData(newData);
    };

    fetchData();
  }, [indicadoresData, selectedCity, selectedIndicators]);

  // Effect to render the chart when data changes
  useEffect(() => {
    if (Object.keys(timeSeriesData).length > 0) {
      // Clear any existing chart
      d3.select(".time-series-chart svg").remove();

      // Setup dimensions and margins for the chart
      const margin = { top: 30, right: 60, bottom: 40, left: 60 }; // Increased right margin for legend
      const width = 800 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      // Create the SVG element
      const svg = d3.select(".time-series-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#2c3e50") // Blue background
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Prepare data for chart
      const parsedTimeSeriesData = Object.entries(timeSeriesData).reduce((acc, [indicatorName, data]) => {
        acc[indicatorName] = data.map(d => ({
          year: parseInt(d.Ano_Observacao),
          value: valueType === 'value' ? parseFloat(d.Valor) || 0 : parseFloat(d.Indice_Posicional) || 0
        }));
        return acc;
      }, {});

      // Set scales X and Y
      const allValues = Object.values(parsedTimeSeriesData).flatMap(data => data.map(d => d.value));
      const yMax = d3.max(allValues) || 0;

      const x = d3.scaleLinear()
        .domain([d3.min(Object.values(parsedTimeSeriesData).flatMap(data => data.map(d => d.year))), d3.max(Object.values(parsedTimeSeriesData).flatMap(data => data.map(d => d.year)))])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, yMax * 1.1]) // 10% top margin
        .range([height, 0]);

      // Add X axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d"))) // Year format without decimal
        .attr("color", "white") // White color for axis
        .selectAll("text")
        .attr("fill", "white"); // White color for text

      // Add Y axis
      svg.append("g")
        .call(d3.axisLeft(y))
        .attr("color", "white") // White color for axis
        .selectAll("text")
        .attr("fill", "white"); // White color for text

      // Add horizontal grid lines
      svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat("")
        )
        .attr("color", "rgba(255, 255, 255, 0.1)"); // Subtle grid lines

      // Define color palette for lines
      const colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

      // Add lines for each indicator
      Object.entries(parsedTimeSeriesData).forEach(([indicatorName, indicatorData], index) => {
        const sanitizedIndicatorName = indicatorName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase(); // Sanitize indicator name for CSS class
        svg.append("path")
          .datum(indicatorData)
          .attr("fill", "none")
          .attr("stroke", colorPalette(index)) // Use color from palette
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX) // Smooth curve
          );

        // Add dots for each year on each line
        svg.selectAll(`.dot-${sanitizedIndicatorName}`) // Use sanitized class name
          .data(indicatorData)
          .enter().append("circle")
          .attr("class", `dot dot-${sanitizedIndicatorName}`) // Use sanitized class name
          .attr("cx", d => x(d.year))
          .attr("cy", d => y(d.value))
          .attr("r", 4)
          .attr("fill", colorPalette(index)); // Color dots same as line
      });


      // Add chart title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("fill", "white") // White text
        .text(`Evolução de Indicadores (${valueType === 'value' ? 'Valor' : 'Índice Posicional'})`);

      // Add Y axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("fill", "white") // White text
        .text(valueType === 'value' ? "Valor" : "Índice Posicional");

      // Add X axis label
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("fill", "white") // White text
        .text("Ano");

      // Add legend
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 20}, 0)`); // Position legend to the right

      const legendItems = legend.selectAll(".legend-item")
        .data(selectedIndicators)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      legendItems.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d, i) => colorPalette(i));

      legendItems.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("dy", "0.32em")
        .style("text-anchor", "start")
        .style("fill", "white")
        .text(d => d);
    }
  }, [timeSeriesData, selectedIndicators, valueType]);


  const handleIndicatorChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedIndicators(selectedOptions);
  };

  const handleValueTypeChange = (event) => {
    setValueType(event.target.value);
  };

  const addIndicator = () => {
    if (availableIndicators.length > selectedIndicators.length) {
      const nextAvailableIndicator = availableIndicators.find(indicator => !selectedIndicators.includes(indicator));
      setSelectedIndicators([...selectedIndicators, nextAvailableIndicator]);
    } else {
      alert("Todos os indicadores disponíveis já foram selecionados.");
    }
  };

  const removeIndicator = (indicatorToRemove) => {
    setSelectedIndicators(selectedIndicators.filter(indicator => indicator !== indicatorToRemove));
  };


  return (
    <div className="time-series-view">
      <div className="time-series-header">
        <h3>Série Temporal</h3>
        <div className="time-series-controls">
          <select
            value={selectedIndicators}
            onChange={handleIndicatorChange}
            className="visualization-dropdown"
            multiple // Allow multiple selections
            size="5" // Display as a list box
          >
            {availableIndicators.map(indicator => (
              <option key={indicator} value={indicator}>
                {indicator}
              </option>
            ))}
          </select>
          <select
            value={valueType}
            onChange={handleValueTypeChange}
            className="visualization-dropdown"
          >
            <option value="value">Valor</option>
            <option value="position">Índice Posicional</option>
          </select>
        </div>
      </div>

      <div className="time-series-chart-container">
        {selectedCity ? (
          <div className="time-series-chart">
            {Object.keys(timeSeriesData).length === 0 ? (
              <p className="no-data-message">Não há dados de série temporal para o indicador e município selecionados.</p>
            ) : null}
          </div>
        ) : (
          <p className="no-data-message">Selecione um município para visualizar a série temporal.</p>
        )}
      </div>
    </div>
  );
};

export default TimeSeriesView;
