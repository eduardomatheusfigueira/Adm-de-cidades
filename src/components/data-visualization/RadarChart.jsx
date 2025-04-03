import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Expects datasets prop: array of objects, e.g.,
// [{ label: 'City A', color: '#ff0000', data: [0.8, 0.5, ...] }, { label: 'City B', color: '#0000ff', data: [0.6, 0.9, ...] }]
// Expects indicators prop: array of strings, e.g., ['Indicator 1', 'Indicator 2', ...]
const RadarChart = ({ datasets, indicators }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // --- Data Validation ---
    const isValid = datasets &&
                    Array.isArray(datasets) &&
                    datasets.length > 0 &&
                    indicators &&
                    Array.isArray(indicators) &&
                    indicators.length >= 3 &&
                    datasets.every(ds => ds && Array.isArray(ds.data) && ds.data.length === indicators.length);

    // Clear previous chart elements if data is invalid or ref is missing
    if (!isValid || !chartRef.current) {
      d3.select(chartRef.current).select("svg").remove();
      d3.select(chartRef.current).select(".radar-chart-legend").remove();
      return;
    }
    // Clear previous chart elements before drawing new one
    d3.select(chartRef.current).select("svg").remove();
    d3.select(chartRef.current).select(".radar-chart-legend").remove();

    // --- Chart Setup ---
    const margin = { top: 80, right: 100, bottom: 80, left: 100 }; // Keep increased margins
    const width = 500 - margin.left - margin.right; // Keep increased width
    const height = 500 - margin.top - margin.bottom; // Keep increased height
    const chartRadius = Math.min(width, height) / 2;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left + chartRadius},${margin.top + chartRadius})`);

    // IMPORTANT: Consistent angle calculation offset
    const angleOffset = -Math.PI / 2; // Start at the top
    const angleSlice = Math.PI * 2 / indicators.length;

    // Radial scale (Indice Posicional: 0 to 1)
    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, chartRadius]);

    const gridLevels = 4;
    const gridData = Array.from({ length: gridLevels }, (_, i) => (i + 1) / gridLevels);

    // --- Draw Grid ---
    const gridWrapper = svg.append("g").attr("class", "grid-wrapper");
    gridWrapper.selectAll(".grid-level")
      .data(gridData)
      .enter().append("circle")
      .attr("class", "grid-level")
      .attr("r", d => rScale(d))
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);

    // Add text labels for grid levels along the top axis
    gridWrapper.selectAll(".grid-label")
      .data(gridData)
      .enter().append("text")
      .attr("class", "grid-label")
      .attr("x", 4)
      .attr("y", d => -rScale(d))
      .attr("dy", "-0.4em")
      .style("font-size", "10px")
      .attr("fill", "#666") // Darker grey for scale labels
      .text(d => d3.format(".2f")(d));

    // --- Draw Axes ---
    const axis = svg.selectAll(".axis")
      .data(indicators)
      .enter().append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0).attr("y1", 0)
      // Use consistent angle calculation
      .attr("x2", (d, i) => rScale(1.05) * Math.cos(angleSlice * i + angleOffset)) 
      .attr("y2", (d, i) => rScale(1.05) * Math.sin(angleSlice * i + angleOffset))
      .attr("stroke", "#ddd") // Lighter grey for axes lines
      .attr("stroke-width", "1px");

    // Append numbered labels to axes
    axis.append("text")
      .attr("class", "axis-label-number")
      .style("font-size", "12px").style("font-weight", "bold")
      .attr("text-anchor", "middle").attr("dy", "0.35em")
      // Use consistent angle calculation and position further out
      .attr("x", (d, i) => rScale(1.18) * Math.cos(angleSlice * i + angleOffset)) 
      .attr("y", (d, i) => rScale(1.18) * Math.sin(angleSlice * i + angleOffset))
      .text((d, i) => i + 1)
      .attr("fill", "#666"); // Dark grey for axis numbers

    // --- Draw Data Polygons and Value Labels ---
    const radarLineGenerator = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d))
      // Use consistent angle calculation
      .angle((d, i) => angleSlice * i + angleOffset); 

    const defaultColors = d3.scaleOrdinal(d3.schemeCategory10); // Fallback colors

    datasets.forEach((dataset, datasetIndex) => {
      // Ensure this dataset is valid before drawing
      if (!dataset || !dataset.data || dataset.data.length !== indicators.length) return; 

      const color = dataset.color || defaultColors(datasetIndex);

      // Draw the polygon
      svg.append("path")
        .datum(dataset.data)
        .attr("d", radarLineGenerator)
        .style("fill", color)
        .style("fill-opacity", datasets.length > 1 ? 0.3 : 0.6) 
        .style("stroke-width", 2)
        .style("stroke", color);

      // Add data point value labels for this dataset
      svg.selectAll(`.data-point-label-${datasetIndex}`)
        .data(dataset.data)
        .enter().append("text")
        .attr("class", `data-point-label data-point-label-${datasetIndex}`)
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", color) // Use dataset color for values
        // Use consistent angle calculation and position slightly OUTSIDE the vertex,
        // adding a small perpendicular offset based on dataset index to reduce overlap.
        .attr("x", (d, i) => {
          const angle = angleSlice * i + angleOffset;
          const baseRadius = rScale(d * 1.02); // Slightly outside vertex
          const offsetAmount = 5; // Pixels offset per dataset index
          return baseRadius * Math.cos(angle) + offsetAmount * datasetIndex * Math.sin(angle);
        })
        .attr("y", (d, i) => {
          const angle = angleSlice * i + angleOffset;
          const baseRadius = rScale(d * 1.02); // Slightly outside vertex
          const offsetAmount = 5; // Pixels offset per dataset index
          return baseRadius * Math.sin(angle) - offsetAmount * datasetIndex * Math.cos(angle);
        })
        .attr("dy", "0.35em")
        .text(d => d3.format(".3f")(d));
    });

  }, [datasets, indicators]); // Rerun effect if datasets or indicators change

  // --- JSX Return ---
  const hasValidData = datasets && Array.isArray(datasets) && datasets.length > 0 && indicators && Array.isArray(indicators) && indicators.length >= 3 && datasets.every(ds => ds && Array.isArray(ds.data) && ds.data.length === indicators.length);

  return (
    <div className="radar-chart-wrapper">
      {/* SVG Container */}
      <div className="radar-chart-svg-container" ref={chartRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
        {/* SVG is appended here by D3 */}
        {!hasValidData && <p style={{color: '#aaa', fontSize: '12px', textAlign: 'center', padding: '20px'}}>Selecione um município e pelo menos 3 indicadores comuns para as cidades comparadas.</p>}
      </div>
      {/* Legend */}
      {hasValidData && (
        <div className="radar-chart-legend">
          {/* Indicator Number Legend */}
          <div className="legend-section indicators-legend">
            <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '13px', color: '#444' }}>Indicadores (Eixos):</h4>
            <ol style={{ listStyle: 'none', paddingLeft: '0', margin: 0, fontSize: '11px', color: '#555', columnCount: indicators.length > 7 ? 2 : 1 }}>
              {indicators.map((indicator, index) => (
                <li key={index} style={{ marginBottom: '5px', lineHeight: '1.3' }}>
                  <strong style={{ marginRight: '5px' }}>{index + 1}:</strong> {indicator}
                </li>
              ))}
            </ol>
          </div>
          {/* City Color Legend */}
          {datasets.length > 0 && ( // Always show city legend if there's data
            <div className="legend-section cities-legend">
               <h4 style={{ marginTop: '10px', marginBottom: '8px', fontSize: '13px', color: '#444' }}>Cidades:</h4>
               <ul style={{ listStyle: 'none', paddingLeft: '0', margin: 0, fontSize: '11px', color: '#555' }}>
                 {datasets.map((dataset, index) => (
                   <li key={dataset.label || index} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: dataset.color || d3.schemeCategory10[index % 10], marginRight: '8px', borderRadius: '50%' }}></span>
                      {dataset.label || `Dataset ${index + 1}`}
                   </li>
                 ))}
               </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RadarChart;
