export const calculateBenefits = {
  coeficientes: {
    "Aumento na Escolaridade Média": {
      "Acesso à rede de esgoto": { coefficient: 0.181, inputUnit: "%", outputUnit: "%" },
      "Acesso à água tratada": { coefficient: 0.029, inputUnit: "%", outputUnit: "%" },
      "Disponibilidade de banheiro": { coefficient: 0.0742, inputUnit: "%", outputUnit: "%" }
    },
    "Redução no Atraso Escolar": {
      "Acesso à rede de esgoto": { coefficient: 0.032, inputUnit: "%", outputUnit: "%" },
      "Acesso à água tratada": { coefficient: 0.031, inputUnit: "%", outputUnit: "%" },
      "Disponibilidade de banheiro": { coefficient: 0.152, inputUnit: "%", outputUnit: "%" }
    },
    "Melhora na Nota do ENEM": {
      "Disponibilidade de banheiro": { coefficient: 0.064, inputUnit: "%", outputUnit: "%" }
    },
    "Melhora na Nota de Redação do ENEM": {
      "Disponibilidade de banheiro": { coefficient: 0.098, inputUnit: "%", outputUnit: "%" }
    },
    "Aumento Salarial Médio": {
      "Acesso à rede de esgoto": { coefficient: 0.049, inputUnit: "%", outputUnit: "%" },
      "Acesso à água tratada": { coefficient: 0.050, inputUnit: "%", outputUnit: "%" },
      "Disponibilidade de banheiro": { coefficient: 0.222, inputUnit: "%", outputUnit: "%" }
    },
    "Aumento no Valor dos Imóveis": {
      "Acesso à rede de esgoto": { coefficient: 0.032, inputUnit: "%", outputUnit: "%" },
      "Acesso à água tratada": { coefficient: 0.039, inputUnit: "%", outputUnit: "%" },
      "Disponibilidade de banheiro": { coefficient: 0.296, inputUnit: "%", outputUnit: "%" }
    },
    "Economia nos Custos com Saúde": {
      "Acesso à rede de esgoto": { coefficient: 7109827.90, inputUnit: "%", outputUnit: "R$" }
    },
    "Redução na Taxa de Internações": {
      "Acesso à rede de esgoto": { coefficient: 0.0922, inputUnit: "%", outputUnit: "casos/1.000 habitantes" }
    }
  },
  coeficientes_empregos: {
    "Empregos Diretos na Construção Civil": { coefficient: 7.588, inputUnit: "R$1M", outputUnit: "empregos" },
    "Empregos Indiretos na Cadeia Produtiva da Construção": { coefficient: 3.683, inputUnit: "R$1M", outputUnit: "empregos" },
    "Empregos Induzidos pelo Aumento da Renda": { coefficient: 6.763, inputUnit: "R$1M", outputUnit: "empregos" },
    "Total de Empregos Gerados por Investimentos": { coefficient: 18.034, inputUnit: "R$1M", outputUnit: "empregos" }
  },
  multiplicador_renda: 1.08,

  calculate: (interventionType, coverageIncrease, investment, selectedIndicators) => {
    const results = [];

    for (const selectedIndicator of selectedIndicators) {
      if (interventionType.startsWith('percentage_')) {
        // Extract the specific intervention type (esgoto, agua, banheiro)
        const interventionDetail = interventionType.split('_')[1];
        let subIndicatorKey = '';
        if (interventionDetail === 'esgoto') subIndicatorKey = 'Acesso à rede de esgoto';
        else if (interventionDetail === 'agua') subIndicatorKey = 'Acesso à água tratada';
        else if (interventionDetail === 'banheiro') subIndicatorKey = 'Disponibilidade de banheiro';

        if (calculateBenefits.coeficientes[selectedIndicator] && calculateBenefits.coeficientes[selectedIndicator][subIndicatorKey]) {
          const { coefficient, outputUnit } = calculateBenefits.coeficientes[selectedIndicator][subIndicatorKey];
          let returnVal;
          let formattedReturnVal;

          // Handle specific formatting for currency
          if (outputUnit === "R$") {
            returnVal = coefficient * coverageIncrease;
            formattedReturnVal = `R$${returnVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          } else if (outputUnit === "%") {
             returnVal = coefficient * coverageIncrease;
             formattedReturnVal = `${returnVal.toFixed(2)}%`;
          }
          else {
            returnVal = coefficient * coverageIncrease;
            formattedReturnVal = `${returnVal.toFixed(2)} ${outputUnit}`;
          }

          results.push({
            indicador: selectedIndicator,
            retorno: returnVal,
            formattedValue: formattedReturnVal, // Use formattedValue consistently
            unidade: outputUnit
          });
        }
      } else if (interventionType === 'money') {
        if (selectedIndicator === "Renda Total Gerada na Economia") {
          const totalIncome = investment * calculateBenefits.multiplicador_renda;
          results.push({
            indicador: selectedIndicator,
            retorno: totalIncome,
            formattedValue: `R$${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            unidade: "R$"
          });
        } else if (calculateBenefits.coeficientes_empregos[selectedIndicator]) {
          const { coefficient, outputUnit } = calculateBenefits.coeficientes_empregos[selectedIndicator];
          const investmentMillions = investment / 1000000;
          const jobs = investmentMillions * coefficient;
          results.push({
            indicador: selectedIndicator,
            retorno: jobs,
            formattedValue: `${jobs.toFixed(2)} ${outputUnit}`,
            unidade: outputUnit
          });
        } else if (selectedIndicator === "Geração de Empregos Diretos") {
          // Assuming the formula is correct as per original code
          const jobs = investment / 131846.9;
          results.push({
            indicador: selectedIndicator,
            retorno: jobs,
            formattedValue: `${jobs.toFixed(2)} empregos`,
            unidade: "empregos"
          });
        } else if (selectedIndicator === "Total de Salários Gerados") {
           // Assuming the formula is correct as per original code
          const jobs = investment / 131846.9;
          const totalSalaries = jobs * 37630;
          results.push({
            indicador: selectedIndicator,
            retorno: totalSalaries,
            formattedValue: `R$${totalSalaries.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            unidade: "R$"
          });
        } else if (selectedIndicator === "Renda Gerada no Setor de Insumos") {
           // Assuming the formula is correct as per original code
          const inputIncome = investment * 0.60;
          results.push({
            indicador: selectedIndicator,
            retorno: inputIncome,
            formattedValue: `R$${inputIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            unidade: "R$"
          });
        }
      }
    }

    return results;
  }
};
