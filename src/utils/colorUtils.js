import * as d3 from 'd3';

// Function to generate a simplified color scale
// Default schemes
const defaultNumericScheme = d3.schemeReds[5]; // Default to 5 categories for Reds
const defaultCategoricalScheme = d3.schemeCategory10;

export const getColorScale = (
  attribute,
  values,
  numericCategories = 5, // Default number of numeric categories
  numericScheme = defaultNumericScheme, // Default numeric color scheme
  categoricalScheme = defaultCategoricalScheme // Default categorical color scheme
) => {
  if (!values || values.length === 0) {
    return ['case', ['==', ['get', attribute], null], '#ccc', '#ccc'];
  }

  const isNumeric = values.every(value => !isNaN(parseFloat(value)));

  if (isNumeric && attribute !== 'Nome_Municipio') {
    const numericValues = values.map(v => parseFloat(v)).sort(d3.ascending);
    // Ensure the provided scheme has enough colors, fallback if not
    const effectiveNumericScheme = (Array.isArray(numericScheme) && numericScheme.length >= numericCategories)
      ? numericScheme.slice(0, numericCategories) // Use the provided scheme subset
      : d3.schemeReds[numericCategories] || d3.schemeReds[d3.schemeReds.length -1]; // Fallback to Reds or its max

    const colorRange = effectiveNumericScheme;
    const thresholds = [];

    // Calculate thresholds based on the actual number of categories requested
    for (let i = 1; i < numericCategories; i++) {
      thresholds.push(numericValues[Math.floor(numericValues.length / numericCategories * i)]);
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
    // Categorical Data Handling
    const uniqueValues = [...new Set(values)].sort(); // Sort for consistent color assignment
    let colorRange;

    // Use a more diverse scheme if the number of categories exceeds the default scheme's length
    if (uniqueValues.length > categoricalScheme.length) {
      console.log(`Generating ${uniqueValues.length} distinct colors using interpolateTurbo.`);
      // Generate distinct colors using interpolateTurbo, avoiding the very ends (0 and 1)
      colorRange = d3.quantize(t => d3.interpolateTurbo(t * 0.8 + 0.1), uniqueValues.length);
    } else {
      // Use the provided categorical scheme if it has enough colors
      colorRange = categoricalScheme;
    }

    const colorScale = d3.scaleOrdinal()
      .domain(uniqueValues) // Use sorted domain
      .range(colorRange); // Use the determined color range

    // Build the Mapbox match expression
    const matchExpression = ['match', ['get', attribute]];
    uniqueValues.forEach(value => {
      matchExpression.push(value, colorScale(value));
    });
    matchExpression.push('#ccc'); // Default color for unmatched values
    return matchExpression;
  }
};
