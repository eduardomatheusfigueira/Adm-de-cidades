const fs = require('fs');

function updateMap() {
  let content = fs.readFileSync('map.html', 'utf8');
  content = content.replace(/<title>.*?<\/title>/, '<title>Adm-de-Cidades - SisInfo Mapa Interativo</title>');
  content = content.replace(/<div class="bg-accent p-1.5 rounded-lg text-primary">\s*<span class="material-symbols-outlined block">explore<\/span>\s*<\/div>/, '<img src="public/logo_white.png" class="h-8 w-auto" alt="Logo SisInfo" />');
  content = content.replace(/GeoIntel <span class="text-accent font-medium">Maps<\/span>/, 'Adm-de-Cidades');
  content = content.replace(/Inteligência Espacial/, 'SisInfo GIS');
  content = content.replace(/Analista Sênior/, 'Gestor Municipal');
  content = content.replace(/Plano Enterprise/, 'Acesso Restrito');
  content = content.replace(/São Paulo - SP/g, 'Município SP');
  content = content.replace(/Rio de Janeiro - RJ/g, 'Município RJ');
  content = content.replace(/Belo Horizonte - MG/g, 'Município MG');
  content = content.replace(/Todos os Distritos/g, 'Todos os Setores Censitários');
  content = content.replace(/Renda Per Capita/, 'PIB per capita (R$)');
  content = content.replace(/Potencial de Consumo/, 'IDHM');
  content = content.replace(/Densidade Demográfica/, 'População Estimada');
  content = content.replace(/Itaim Bibi/, 'São Paulo (Capital)');
  content = content.replace(/Setor Censitário: 355030800000 \| São Paulo, SP/, 'Código IBGE: 3550308 | UF: SP');
  content = content.replace(/Tier A\+/, 'Capital');
  content = content.replace(/Score Consumo/, 'IDH Municipal');
  content = content.replace(/<span class="text-2xl font-bold text-accent">9.4<\/span>/, '<span class="text-2xl font-bold text-accent">0.805</span>');
  content = content.replace(/R\$ 12\.5k/, 'R$ 54.3k');
  content = content.replace(/4,821/, 'R$ 748,9 Bi');
  content = content.replace(/Empresas/, 'PIB Total');
  content = content.replace(/Evolução do Valor M²/, 'Evolução do PIB (Série Histórica)');
  content = content.replace(/Segurança/, 'Educação (IDEB)');
  content = content.replace(/Mobilidade/, 'Saúde (Atenção Básica)');
  content = content.replace(/Comércio/, 'Saneamento (SNIS)');
  fs.writeFileSync('map.html', content);
}

function updateReports() {
  let content = fs.readFileSync('reports.html', 'utf8');
  content = content.replace(/<title>.*?<\/title>/, '<title>SisInfo - Gerador de Relatórios Municipais</title>');
  content = content.replace(/<div class="size-8 flex items-center justify-center bg-primary text-white rounded">\s*<span class="material-symbols-outlined text-xl">analytics<\/span>\s*<\/div>/, '<img src="public/logo_blue.png" class="h-8 w-auto" alt="Logo SisInfo" />');
  content = content.replace(/Executive Intelligence/, 'Adm-de-Cidades');
  content = content.replace(/Relatório de Desempenho Operacional/, 'Relatório de Diagnóstico Municipal');
  content = content.replace(/Análise Consolidada Trimestral • Q3 2023 • Ref: #8829-X/, 'Síntese Socioeconômica e Fiscal • Ref: 2022 (IBGE/FINBRA)');
  content = content.replace(/Score Global/, 'IDH Municipal');
  content = content.replace(/<p class="text-primary text-3xl font-black">9\.4<\/p>/, '<p class="text-primary text-3xl font-black">0.805</p>');
  content = content.replace(/Eficiência/, 'Índice Gini');
  content = content.replace(/88\.2%/, '0.450');
  content = content.replace(/ROI Projetado/, 'PIB per Capita');
  content = content.replace(/14\.2x/, 'R$ 54.3k');
  content = content.replace(/Churn Rate/, 'Tx. Analfabetismo');
  content = content.replace(/1\.8%/, '2.5%');
  content = content.replace(/O desempenho deste trimestre superou as expectativas iniciais.*/, 'O município apresentou crescimento no setor de serviços, refletindo no aumento da arrecadação de ISS. A taxa de analfabetismo manteve-se abaixo da média nacional, porém a cobertura de saneamento básico necessita de atenção, especialmente nas regiões periféricas do município.');
  content = content.replace(/Observamos uma maturação significativa na retenção de clientes.*/, 'A dependência do FPM (Fundo de Participação dos Municípios) permanece controlada, demonstrando boa capacidade de arrecadação própria e saúde fiscal para novos investimentos estruturais no plano plurianual.');
  content = content.replace(/Velocidade/g, 'Finanças');
  content = content.replace(/Qualidade/g, 'Educação');
  content = content.replace(/Sustentabilidade/g, 'Saúde');
  content = content.replace(/Inovação/g, 'Infraestrutura');
  content = content.replace(/Detalhamento por Unidade/g, 'Composição das Receitas Orçamentárias');
  content = content.replace(/Departamento/g, 'Categoria (FINBRA)');
  content = content.replace(/Performance/g, 'Realizado (%)');
  content = content.replace(/Orcamento/g, 'Valor Arrecadado');
  content = content.replace(/Valores em USD/, 'Valores em R$ (Milhares)');
  content = content.replace(/Operações Internacionais/, 'Receitas Correntes');
  content = content.replace(/Lead: Marcella Viana/, 'Tributárias, Transferências');
  content = content.replace(/Inovação e P&amp;D/, 'IPTU');
  content = content.replace(/Lead: Ricardo Gomes/, 'Arrecadação Própria');
  content = content.replace(/Marketing Estratégico/, 'ISS');
  content = content.replace(/Lead: Julia Fontes/, 'Imposto sobre Serviços');
  content = content.replace(/Customer Experience/, 'FPM');
  content = content.replace(/Lead: Ana Clara/, 'Fundo de Participação');
  content = content.replace(/\$450,200\.00/, 'R$ 1.450.200,00');
  content = content.replace(/\$820,000\.00/, 'R$ 320.000,00');
  content = content.replace(/\$210,500\.00/, 'R$ 210.500,00');
  content = content.replace(/\$155,000\.00/, 'R$ 555.000,00');
  content = content.replace(/Chief Financial Officer/, 'Secretário da Fazenda');
  content = content.replace(/Setor Financeiro/, 'Assinatura Oficial');
  content = content.replace(/Chief Operations Officer/, 'Prefeito Municipal');
  content = content.replace(/Setor Operacional/, 'Gabinete');
  content = content.replace(/© 2023 Executive Intel Module/, '© SisInfo Municipal');
  fs.writeFileSync('reports.html', content);
}

function updateCatalog() {
  let content = fs.readFileSync('catalog.html', 'utf8');
  content = content.replace(/<title>.*?<\/title>/, '<title>SisInfo - Catálogo de Bases de Dados Municipais</title>');
  content = content.replace(/<div class="flex items-center gap-3 text-primary dark:text-slate-100">\s*<span class="material-symbols-outlined text-3xl font-bold">database<\/span>\s*<h1 class="text-lg font-bold leading-tight tracking-tight">DataStack <span class="font-normal text-slate-500">Metadados<\/span><\/h1>\s*<\/div>/, '<div class="flex items-center gap-3 text-primary dark:text-slate-100"><img src="public/logo_blue.png" class="h-8 w-auto dark:hidden" alt="SisInfo" /><img src="public/logo_white.png" class="h-8 w-auto hidden dark:block" alt="SisInfo" /><h1 class="text-lg font-bold leading-tight tracking-tight">SisInfo <span class="font-normal text-slate-500">Catálogo</span></h1></div>');
  content = content.replace(/DataStack OS © 2023/, 'SisInfo © 2023');
  fs.writeFileSync('catalog.html', content);
}

function updateWiki() {
  let content = fs.readFileSync('wiki.html', 'utf8');
  content = content.replace(/<title>.*?<\/title>/, '<title>Adm-de-Cidades Documentação - Wiki</title>');
  content = content.replace(/<div class="size-8 bg-white\/10 rounded-lg flex items-center justify-center">\s*<span class="material-symbols-outlined text-white">menu_book<\/span>\s*<\/div>/, '<img src="public/logo_white.png" class="h-8 w-auto" alt="Logo SisInfo" />');
  content = content.replace(/Sisinfo/g, 'Adm-de-Cidades');
  content = content.replace(/Dashboard v2\.0/, 'Interface Geográfica Interativa');
  fs.writeFileSync('wiki.html', content);
}

function updateDashboard() {
  let content = fs.readFileSync('dashboard.html', 'utf8');
  content = content.replace(/<title>.*?<\/title>/, '<title>SisInfo - Visão Comparativa de Municípios</title>');
  content = content.replace(/<div class="size-10 bg-white\/10 rounded-lg flex items-center justify-center">\s*<span class="material-symbols-outlined text-white">analytics<\/span>\s*<\/div>/, '<img src="public/logo_white.png" class="h-8 w-auto" alt="Logo SisInfo" />');
  content = content.replace(/Módulo Analítico/, 'Adm-de-Cidades');
  content = content.replace(/Comparativo de performance entre 5\.570 municípios brasileiros./, 'Comparativo de indicadores socioeconômicos e demográficos dos 5.568 municípios brasileiros.');
  content = content.replace(/de 5\.570/, 'de 5.568');
  content = content.replace(/Top Cluster/, 'Microrregião de Destaque');
  fs.writeFileSync('dashboard.html', content);
}

updateMap();
updateReports();
updateCatalog();
updateWiki();
updateDashboard();
console.log('HTML files updated successfully.');
