import * as d3 from 'd3';

// Function to generate a simplified color scale
export const getColorScale = (attribute, values) => {
  if (!values || values.length === 0) {
    return ['case', ['==', ['get', attribute], null], '#ccc', '#ccc'];
  }

  const isNumeric = values.every(value => !isNaN(parseFloat(value)));

  if (isNumeric && attribute !== 'Nome_Municipio') {
    const numericValues = values.map(v => parseFloat(v)).sort(d3.ascending);
    const numCategories = 5; // Define number of color categories
    const colorRange = d3.schemeReds[numCategories]; // Use a simpler color scheme like Reds
    const thresholds = [];

    for (let i = 1; i < numCategories; i++) {
      thresholds.push(numericValues[Math.floor(numericValues.length / numCategories * i)]);
    }

    const colorScale = d3.scaleThreshold()
      .domain(thresholds)
      .range(colorRange);

    return [
      'step',
      ['to-number', ['get', attribute]],
      colorRange[0], // default color
      ...thresholds.flatMap((threshold, index) => [threshold, colorRange[index + 1]])
    ];
  } else {
    const uniqueValues = [...new Set(values)];
    const colorScale = d3.scaleOrdinal()
      .domain(uniqueValues)
      .range(d3.schemeCategory10);

    const matchExpression = ['match', ['get', attribute]];
    uniqueValues.forEach(value => {
      matchExpression.push(value, colorScale(value));
    });
    matchExpression.push('#ccc'); // Default color
    return matchExpression;
  }
};
