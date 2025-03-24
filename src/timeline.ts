import * as d3 from 'd3';
import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';
import { categoryColors, categoryNames, sources as allSources } from './data';
import { invencaoEvents, invencaoPeriods, invencaoCharacters } from './invencao_trabalhismo';
import { raizesEvents, raizesPeriods, raizesCharacters } from './raizes_brasil';
import { capitaesBrasilEvents, capitaesBrasilPeriods, capitaesBrasilCharacters } from './capitaes_brasil';
import { casaGrandeEvents, casaGrandePeriods, casaGrandeCharacters } from './casa_grande_senzala';
import { naufragosEvents, naufragosPeriods, naufragosCharacters } from './naufragos_traficantes';
import { urbanizacaoEvents, urbanizacaoPeriods, urbanizacaoCharacters } from './urbanizacao_brasil';
import { brasilTimelineEvents, brasilTimelinePeriods, brasilTimelineCharacters, brasilTimelineSources } from './brasil_timeline';
import { povoBrasileiroEvents, povoBrasileiroPeriods, povoBrasileiroCharacters, povoBrasileiroSource } from './povo_brasileiro';
import { evolucaoPoliticaBrasilEvents, evolucaoPoliticaBrasilPeriods, evolucaoPoliticaBrasilCharacters, evolucaoPoliticaBrasilSource } from './evolucao_politica_brasil';
import { historiaConstitucionalEvents, historiaConstitucionalPeriods, historiaConstitucionalCharacters, historiaConstitucionalSource } from './historia_constitucional';
import { americaPreColombianaEvents, americaPreColombianaPeriods, americaPreColombianaSource, americaPreColombianaCharacters } from './america_pre_colombiana'; // Import americaPreColombiana data and characters
import { colonizacaoBrasilEvents, colonizacaoBrasilPeriods, colonizacaoBrasilCharacters, colonizacaoBrasilSource } from './colonizacao_brasil';
import { viagemDescobrimentoEvents, viagemDescobrimentoPeriods, viagemDescobrimentoCharacters, viagemDescobrimentoSource } from './viagem_descobrimento'; // Import viagem descobrimento data
import { formacaoEconomicaBrasilEvents, formacaoEconomicaBrasilPeriods, formacaoEconomicaBrasilCharacters, formacaoEconomicaBrasilSource } from './formacao_economica_brasil'; // Import Formacao Economica data


// Combine events, periods, and characters from all sources
const events = [
  ...invencaoEvents,
  ...raizesEvents,
  ...capitaesBrasilEvents,
  ...casaGrandeEvents,
  ...naufragosEvents,
  ...urbanizacaoEvents,
  ...brasilTimelineEvents, // Add new timeline events
  ...povoBrasileiroEvents,
  ...evolucaoPoliticaBrasilEvents,
  ...historiaConstitucionalEvents, // Add historia constitucional events
  ...americaPreColombianaEvents, // Add america pre-colombiana events
  ...colonizacaoBrasilEvents,
  ...viagemDescobrimentoEvents, // Add viagem descobrimento events
  ...formacaoEconomicaBrasilEvents // Add formacao economica events
];
const periods = [
  ...invencaoPeriods,
  ...raizesPeriods,
  ...capitaesBrasilPeriods,
  ...casaGrandePeriods,
  ...naufragosPeriods,
  ...urbanizacaoPeriods,
  ...brasilTimelinePeriods, // Add new timeline periods
  ...povoBrasileiroPeriods,
  ...evolucaoPoliticaBrasilPeriods,
  ...historiaConstitucionalPeriods, // Add historia constitucional periods
  ...americaPreColombianaPeriods, // Add america pre-colombiana periods
  ...colonizacaoBrasilPeriods,
  ...viagemDescobrimentoPeriods, // Add viagem descobrimento periods
  ...formacaoEconomicaBrasilPeriods // Add formacao economica periods
];
const characters = [
  ...invencaoCharacters,
  ...raizesCharacters,
  ...capitaesBrasilCharacters,
  ...casaGrandeCharacters,
  ...naufragosCharacters,
  ...urbanizacaoCharacters,
  ...brasilTimelineCharacters, // Add new timeline characters
  ...povoBrasileiroCharacters,
  ...evolucaoPoliticaBrasilCharacters,
  ...historiaConstitucionalCharacters, // Add historia constitucional characters
  ...americaPreColombianaCharacters, // Add america pre-colombiana characters
  ...colonizacaoBrasilCharacters,
  ...viagemDescobrimentoCharacters, // Add viagem descobrimento characters
  ...formacaoEconomicaBrasilCharacters // Add formacao economica characters
];

// Combine and deduplicate sources
const allSourcesArray = [
  ...allSources,
  ...brasilTimelineSources,
  povoBrasileiroSource,
  evolucaoPoliticaBrasilSource,
  historiaConstitucionalSource,
  americaPreColombianaSource,
  colonizacaoBrasilSource,
  viagemDescobrimentoSource,
  formacaoEconomicaBrasilSource
];

// Deduplicate sources by id
const sourcesMap = new Map<string, SourceInfo>();
allSourcesArray.forEach(source => {
  sourcesMap.set(source.id, source);
});
export const sources = Array.from(sourcesMap.values());


// Calculate min and max years from events and periods
const allYearsFromEvents = events.reduce((years, event) => {
  const startYear = event.century ? parseInt(event.century.split(' ')[0].replace(/[^0-9]/g, '')) * (event.century.includes('a.C.') ? -100 : 100) : event.year;
  const endYear = event.endYear;
  if (startYear) years.push(startYear);
  if (endYear) years.push(endYear);
  return years;
}, [] as number[]);

const allYearsFromPeriods = periods.reduce((years, period) => {
  years.push(period.startYear);
  years.push(period.endYear);
  return years;
}, [] as number[]);

const allYears = [...allYearsFromEvents, ...allYearsFromPeriods];
const minYear = Math.min(...allYears);
const maxYear = Math.max(...allYears);

// Calculate initial domain based on actual min and max event years
const initialDomainStart = new Date(minYear, 0, 1);
const initialDomainEnd = new Date(maxYear, 11, 31);


export class Timeline {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private width: number;
  private height: number;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private innerWidth: number;
  private innerHeight: number;
  private xScale: d3.ScaleTime<number, number>;
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  private selectedCharacters: Set<string> = new Set();
  private selectedSources: Set<string> = new Set();
  private zoomLevel: number = 1;
  private minYear: number = minYear; // Use calculated minYear
  private maxYear: number = maxYear; // Use calculated maxYear
  private initialDomain: [Date, Date]; // Store initial domain for reset
  private navigationHint: HTMLElement | null = null;
  private categoryLaneHeight: number = 60; // Height for each category lane - REDUCED from 100 to 60

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container with id ${containerId} not found`);

    this.width = container.clientWidth;
    // Calculate height dynamically based on the number of categories
    this.height = Object.keys(EventCategory).length * this.categoryLaneHeight + this.margin.top + this.margin.bottom + 50; // 50 for axis and labels
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    this.innerWidth = this.width - this.margin.left - this.margin.right;


    // Create SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'timeline-svg')
      .call(d3.drag()
        .on("start", () => this.svg.style("cursor", "grabbing"))
        .on("drag", this.dragged.bind(this))
        .on("end", () => this.svg.style("cursor", "grab")));

    // Create tooltip
    this.tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Create time scale
    this.xScale = d3.scaleTime()
      .domain([
        initialDomainStart, // Use calculated initial domain start
        initialDomainEnd   // Use calculated initial domain end
      ])
      .range([0, this.innerWidth]);

    this.initialDomain = this.xScale.domain() as [Date, Date]; // Store initial domain

    this.initialize();
    this.addNavigationHint();
  }

  private addNavigationHint(): void {
    const container = this.svg.node()?.parentNode as HTMLElement;
    this.navigationHint = document.createElement('div');
    this.navigationHint.className = 'navigation-hint';
    this.navigationHint.textContent = 'Clique e arraste para navegar horizontalmente na linha do tempo';
    container.parentNode?.insertBefore(this.navigationHint, container);

    // Auto-hide hint after 5 seconds
    setTimeout(() => {
      if (this.navigationHint) {
        this.navigationHint.style.opacity = '0';
        setTimeout(() => {
          if (this.navigationHint) {
            this.navigationHint.remove();
            this.navigationHint = null;
          }
        }, 1000);
      }
    }, 5000);
  }

  private dragged(event: any): void {
    const [startDate, endDate] = this.xScale.domain();
    const domainRange = endDate.getTime() - startDate.getTime();

    const delta = this.xScale.invert(-event.dx).getTime() - this.xScale.invert(0).getTime();

    const newDomainStart = new Date(startDate.getTime() - delta);
    const newDomainEnd = new Date(endDate.getTime() - delta);

    if (newDomainStart.getFullYear() > this.minYear - 100 && newDomainEnd.getFullYear() < this.maxYear + 100) {
      this.xScale.domain([newDomainStart, newDomainEnd]);
      this.updateTimeline();
    }
  }

  private initialize(): void {
    this.createControls();
    this.drawTimeline();
    this.drawPeriods();
    this.drawEvents();
    this.createLegend();
    this.createCharacterList();
    this.createSourceList();
    this.createNavigationControls();
  }

  private createNavigationControls(): void {
    const container = this.svg.node()?.parentNode as HTMLElement;
    const navigationContainer = document.createElement('div');
    navigationContainer.className = 'navigation-controls';

    // Move left button
    const moveLeftBtn = document.createElement('button');
    moveLeftBtn.innerHTML = '&larr; Mover para Esquerda';
    moveLeftBtn.addEventListener('click', () => this.moveTimeline(-500)); // Move 500 years left

    // Move right button
    const moveRightBtn = document.createElement('button');
    moveRightBtn.innerHTML = 'Mover para Direita &rarr;';
    moveRightBtn.addEventListener('click', () => this.moveTimeline(500)); // Move 500 years right

    // Period selector dropdown
    const periodSelectDropdown = document.createElement('select');
    periodSelectDropdown.innerHTML = `
      <option value="all">Todos os períodos</option>
      <option value="pre-colonial">Período Pré-Colonial</option>
      <option value="modern">Período Moderno</option>
      <option value="colonial">Período Colonial</option>
      <option value="imperial">Período Imperial</option>
      <option value="republic">Período Republicano</option>
    `;
    periodSelectDropdown.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.jumpToPeriod(target.value);
    });

    navigationContainer.appendChild(moveLeftBtn);
    navigationContainer.appendChild(periodSelectDropdown);
    navigationContainer.appendChild(moveRightBtn);

    // Add to DOM
    const controlsContainer = container.parentNode?.querySelector('.timeline-controls') as HTMLElement;
    if (controlsContainer) {
      controlsContainer.appendChild(navigationContainer);
    } else {
      container.parentNode?.insertBefore(navigationContainer, container);
    }
  }

  private moveTimeline(years: number): void {
    const [startDate, endDate] = this.xScale.domain();
    const newStartDate = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
    const newEndDate = new Date(endDate.getFullYear() + years, endDate.getFullYear(), endDate.getDate());

    this.xScale.domain([newStartDate, newEndDate]);
    this.updateTimeline();
  }

  private jumpToPeriod(period: string): void {
    switch (period) {
      case 'pre-colonial':
        this.xScale.domain([new Date(-5000, 0, 1), new Date(1500, 0, 1)]);
        break;
      case 'modern':
        this.xScale.domain([new Date(1889, 0, 1), new Date(1945, 0, 1)]);
        break;
      case 'colonial':
        this.xScale.domain([new Date(1500, 0, 1), new Date(1822, 11, 31)]);
        break;
      case 'imperial':
        this.xScale.domain([new Date(1822, 0, 1), new Date(1889, 11, 31)]);
        break;
      case 'republic':
        this.xScale.domain([new Date(1889, 0, 1), new Date(1945, 11, 31)]);
        break;
      case 'seculo-xv':
        this.xScale.domain([new Date(1400, 0, 1), new Date(1500, 0, 1)]);
        break;
      case 'inicio-seculo-xvi':
        this.xScale.domain([new Date(1500, 0, 1), new Date(1530, 0, 1)]);
        break;
      case 'meados-seculo-xvi':
        this.xScale.domain([new Date(1540, 0, 1), new Date(1570, 0, 1)]);
        break;
      case 'seculo-xvii':
        this.xScale.domain([new Date(1600, 0, 1), new Date(1700, 0, 1)]);
        break;
      case 'seculo-xviii':
        this.xScale.domain([new Date(1700, 0, 1), new Date(1800, 0, 1)]);
        break;
      case 'seculo-xix':
        this.xScale.domain([new Date(1800, 0, 1), new Date(1900, 0, 1)]);
        break;
      case 'seculo-xx':
        this.xScale.domain([new Date(1900, 0, 1), new Date(2000, 0, 1)]);
        break;
      default:
        this.xScale.domain(this.initialDomain); // Default to initial domain
        break;
    }
    this.updateTimeline();
  }

  private createControls(): void {
    const container = this.svg.node()?.parentNode as HTMLElement;
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'timeline-controls';

    // Zoom controls
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-controls';

    const zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.title = 'Aumentar zoom';
    zoomInBtn.addEventListener('click', () => this.zoom(1.5));

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '-';
    zoomOutBtn.title = 'Diminuir zoom';
    zoomOutBtn.addEventListener('click', () => this.zoom(0.67));

    const resetZoomBtn = document.createElement('button');
    resetZoomBtn.textContent = 'Resetar Zoom';
    resetZoomBtn.addEventListener('click', () => this.resetZoom());

    zoomContainer.appendChild(zoomOutBtn);
    zoomContainer.appendChild(resetZoomBtn);
    zoomContainer.appendChild(zoomInBtn);

    // Time period selector
    const periodContainer = document.createElement('div');
    periodContainer.className = 'period-selector';

    const periodLabel = document.createElement('label');
    periodLabel.textContent = 'Filtrar Período: ';

    const periodSelect = document.createElement('select');

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Todos os períodos';
    periodSelect.appendChild(allOption);

    const preColonialOption = document.createElement('option');
    preColonialOption.value = 'pre-colonial';
    preColonialOption.textContent = 'Período Pré-Colonial (até 1500)';
    periodSelect.appendChild(preColonialOption);

    const colonialOption = document.createElement('option');
    colonialOption.value = 'colonial';
    colonialOption.textContent = 'Período Colonial (1500-1822)';
    periodSelect.appendChild(colonialOption);

    const imperialOption = document.createElement('option');
    imperialOption.value = 'imperial';
    imperialOption.textContent = 'Período Imperial (1822-1889)';
    periodSelect.appendChild(imperialOption);

    const republicOption = document.createElement('option');
    republicOption.value = 'republic';
    republicOption.textContent = 'Período Republicano (1889-1945)';
    periodSelect.appendChild(republicOption);

    const seculoXVOption = document.createElement('option');
    seculoXVOption.value = 'seculo-xv';
    seculoXVOption.textContent = 'Século XV';
    periodSelect.appendChild(seculoXVOption);

    const inicioSeculoXVIoption = document.createElement('option');
    inicioSeculoXVIoption.value = 'inicio-seculo-xvi';
    inicioSeculoXVIoption.textContent = 'Início Século XVI';
    periodSelect.appendChild(inicioSeculoXVIoption);

    const meadosSeculoXVIoption = document.createElement('option');
    meadosSeculoXVIoption.value = 'meados-seculo-xvi';
    meadosSeculoXVIoption.textContent = 'Meados Século XVI';
    periodSelect.appendChild(meadosSeculoXVIoption);

    const seculoXVIIoption = document.createElement('option');
    seculoXVIIoption.value = 'seculo-xvii';
    seculoXVIIoption.textContent = 'Século XVII';
    periodSelect.appendChild(seculoXVIIoption);

    const seculoXVIIIoption = document.createElement('option');
    seculoXVIIIoption.value = 'seculo-xviii';
    seculoXVIIIoption.textContent = 'Século XVIII';
    periodSelect.appendChild(seculoXVIIIoption);

    const seculoXIXoption = document.createElement('option');
    seculoXIXoption.value = 'seculo-xix';
    seculoXIXoption.textContent = 'Século XIX';
    periodSelect.appendChild(seculoXIXoption);

    const seculoXXoption = document.createElement('option');
    seculoXXoption.value = 'seculo-xx';
    seculoXXoption.textContent = 'Século XX';
    periodSelect.appendChild(seculoXXoption);


    periodSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.filterByPeriod(target.value);
    });

    periodContainer.appendChild(periodLabel);
    periodContainer.appendChild(periodSelect);

    controlsContainer.appendChild(zoomContainer);
    controlsContainer.appendChild(periodContainer);

    container.parentNode?.insertBefore(controlsContainer, container);
  }

  private zoom(factor: number): void {
    this.zoomLevel *= factor;

    // Update the scale
    const currentDomain = this.xScale.domain() as [Date, Date];
    const currentCenter = new Date(
      (currentDomain[0].getTime() + currentDomain[1].getTime()) / 2
    );

    const newDomainHalfWidth = (currentDomain[1].getTime() - currentDomain[0].getTime()) / (2 * factor);

    const newDomainStart = new Date(currentCenter.getTime() - newDomainHalfWidth);
    const newDomainEnd = new Date(currentCenter.getTime() + newDomainHalfWidth);

    this.xScale.domain([newDomainStart, newDomainEnd]);

    // Redraw
    this.updateTimeline();
  }

  private resetZoom(): void {
    this.zoomLevel = 1;
    this.adjustZoomToFitVisibleData(); // Adjust zoom to fit visible data
  }

  private adjustZoomToFitVisibleData(): void {
    const visibleEvents = events.filter(event => {
      const sourceId = sources.find(s => s.name === event.source)?.id;
      return sourceId && this.selectedSources.has(sourceId);
    });

    const visiblePeriods = periods.filter(period => {
      const sourceId = sources.find(s => s.name === period.source)?.id;
      return sourceId && this.selectedSources.has(sourceId);
    });

    const visibleYearsFromEvents = visibleEvents.reduce((years, event) => {
      const startYear = event.century ? parseInt(event.century.split(' ')[0].replace(/[^0-9]/g, '')) * (event.century.includes('a.C.') ? -100 : 100) : event.year;
      const endYear = event.endYear;
      if (startYear) years.push(startYear);
      if (endYear) years.push(endYear);
      return years;
    }, [] as number[]);

    const visibleYearsFromPeriods = visiblePeriods.reduce((years, period) => {
      years.push(period.startYear);
      years.push(period.endYear);
      return years;
    }, [] as number[]);

    const visibleYears = [...visibleYearsFromEvents, ...visibleYearsFromPeriods];
    let newMinYear = Math.min(...visibleYears, maxYear);
    let newMaxYear = Math.max(...visibleYears, minYear);

    if (visibleYears.length === 0) {
      newMinYear = minYear;
      newMaxYear = maxYear;
    }


    const newDomainStart = new Date(newMinYear, 0, 1);
    const newDomainEnd = new Date(newMaxYear, 11, 31);

    this.xScale.domain([newDomainStart, newDomainEnd]);
    this.updateTimeline();
  }


  private filterByPeriod(period: string): void {
    switch (period) {
      case 'pre-colonial':
        this.xScale.domain([new Date(-5000, 0, 1), new Date(1500, 0, 1)]);
        break;
      case 'colonial':
        this.xScale.domain([new Date(1500, 0, 1), new Date(1822, 11, 31)]);
        break;
      case 'imperial':
        this.xScale.domain([new Date(1822, 0, 1), new Date(1889, 11, 31)]);
        break;
      case 'republic':
        this.xScale.domain([new Date(1889, 0, 1), new Date(1945, 11, 31)]);
        break;
      case 'seculo-xv':
        this.xScale.domain([new Date(1400, 0, 1), new Date(1500, 0, 1)]);
        break;
      case 'inicio-seculo-xvi':
        this.xScale.domain([new Date(1500, 0, 1), new Date(1530, 0, 1)]);
        break;
      case 'meados-seculo-xvi':
        this.xScale.domain([new Date(1540, 0, 1), new Date(1570, 0, 1)]);
        break;
      case 'seculo-xvii':
        this.xScale.domain([new Date(1600, 0, 1), new Date(1700, 0, 1)]);
        break;
      case 'seculo-xviii':
        this.xScale.domain([new Date(1700, 0, 1), new Date(1800, 0, 1)]);
        break;
      case 'seculo-xix':
        this.xScale.domain([new Date(1800, 0, 1), new Date(1900, 0, 1)]);
        break;
      case 'seculo-xx':
        this.xScale.domain([new Date(1900, 0, 1), new Date(2000, 0, 1)]);
        break;
      default:
        this.xScale.domain(this.initialDomain); // Default to initial domain
        break;
    }
    this.updateTimeline();
  }

  private updateTimeline(): void {
    // Update axis
    this.svg.select('.axis')
      .attr('transform', `translate(0, ${this.innerHeight})`) // Position axis at the bottom
      .call(d3.axisBottom(this.xScale)
        .tickFormat((d: Date) => {
          const year = d.getFullYear();
          return year < 0 ? `${Math.abs(year)} a.C.` : `${year}`;
        })
        .ticks(d3.timeYear.every(Math.max(1, Math.floor(50 / this.zoomLevel)))));

    // Update periods
    this.svg.selectAll('.period-bg')
      .attr('x', (d: any) => this.xScale(new Date(d.startYear, 0, 1)))
      .attr('width', (d: any) => {
        const start = this.xScale(new Date(d.startYear, 0, 1));
        const end = this.xScale(new Date(d.endYear, 11, 31));
        return Math.max(0, end - start);
      })
      .classed('prehistoric-period', (d: any) => d.startYear < 0);

    this.svg.selectAll('.period-label')
      .attr('x', (d: any) => {
        const start = this.xScale(new Date(d.startYear, 0, 1));
        const end = this.xScale(new Date(d.endYear, 11, 31));
        return start + (end - start) / 2;
      })
      .style('opacity', (d: any) => {
        const start = this.xScale(new Date(d.startYear, 0, 1));
        const end = this.xScale(new Date(d.endYear, 11, 31));
        return (end - start) > 50 ? 1 : 0; // Hide labels if period is too small
      });

    // Redraw events
    this.svg.selectAll('.event').remove();
    this.drawEvents();

    // Update period visibility after redrawing events
    this.updatePeriodVisibility();

    // Update year lines
    this.svg.selectAll('.year-line').remove();
    this.drawYearLines();
  }

  private drawTimeline(): void {
    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Draw year lines first, behind everything else
    this.drawYearLines();

    // Draw x-axis
    const xAxis = d3.axisBottom(this.xScale)
      .tickFormat((d: Date) => {
        const year = d.getFullYear();
          return year < 0 ? `${Math.abs(year)} a.C.` : `${year}`;
      })
      .ticks(d3.timeYear.every(50));

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${this.innerHeight})`) // Position axis at the bottom
      .call(xAxis);

    // Add axis label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', this.innerWidth / 2)
      .attr('y', this.innerHeight + 40) // Position label below the axis
      .attr('text-anchor', 'middle')
      .text('Ano');
  }

  private drawYearLines(): void {
    const g = this.svg.select('g'); // Select the existing main group
    const ticks = this.xScale.ticks(d3.timeYear.every(Math.max(1, Math.floor(50 / this.zoomLevel))));

    const yearLines = g.selectAll('.year-line')
      .data(ticks)
      .enter()
      .append('g') // Group to hold line and text
      .attr('class', 'year-line');

    yearLines.append('line')
      .attr('x1', d => this.xScale(d) )
      .attr('x2', d => this.xScale(d) )
      .attr('y1', 0)
      .attr('y2', this.innerHeight)
      .style('stroke', '#ccc')
      .style('stroke-width', 0.7)
      .style('stroke-dasharray', '4 4')
      .style('opacity', 0.8); // Increased opacity

    yearLines.each((d: Date, index: number, nodes: any) => {
      const year = d.getFullYear().toString();
      // Use nodes[index] to correctly reference the current element in the iteration
      const lineElement = nodes[index];
      if (!lineElement) return; // Ensure the element exists

      const lineLength = this.innerHeight; // Length of the year line
      const textLength = year.length * 8; // Approximate width of the text, adjust as needed
      const spacing = textLength + 15; // Space between labels, including text width and some padding
      let numLabels = Math.floor(lineLength / spacing); // Number of labels that can fit
      numLabels = Math.max(1, Math.floor(numLabels / 3)); // Reduce to about one-third, ensure at least one label

      if (numLabels > 0) { // Check if there are labels to add
        for (let i = 0; i < numLabels; i++) {
          d3.select(lineElement).append('text')
            .attr('x', this.xScale(d) + 5)
            .attr('y', (lineLength / (numLabels + 1)) * (i + 1)) // Distribute labels evenly along the line
            .text(year)
            .style('text-anchor', 'start')
            .style('font-size', '10px')
            .style('fill', '#777')
            .attr('transform', `rotate(-90, ${this.xScale(d) + 5}, ${(lineLength / (numLabels + 1)) * (i + 1)})`);
        }
      }
    });
  }

  private drawPeriods(): void {
    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Organize periods by layers to handle overlaps
    const layeredPeriods = this.organizePeriodLayers(periods);

    // Draw period backgrounds with different heights based on layer
    layeredPeriods.forEach((layer, layerIndex) => {
      const layerHeight = this.innerHeight / layeredPeriods.length;
      const yOffset = layerIndex * layerHeight;

      g.selectAll(`.period-bg-layer-${layerIndex}`)
        .data(layer)
        .enter()
        .append('rect')
        .attr('class', d => `period-bg period-bg-layer-${layerIndex} ${d.startYear < 0 ? 'prehistoric-period' : ''}`)
        .attr('x', d => this.xScale(new Date(d.startYear, 0, 1)))
        .attr('y', yOffset)
        .attr('width', d => {
          const start = this.xScale(new Date(d.startYear, 0, 1));
          const end = this.xScale(new Date(d.endYear, 11, 31));
          return Math.max(0, end - start);
        })
        .attr('height', layerHeight)
        .attr('fill', (d, i) => {
          const sourceColor = sources.find(s => s.name === d.source)?.color || '#ccc';
          return `rgba(${this.hexToRgb(sourceColor)}, ${0.2 + (layerIndex * 0.1)})`;
        })
        .attr('stroke', d => {
          const sourceColor = sources.find(s => s.name === d.source)?.color || '#ccc';
          return sourceColor;
        })
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.7)
        .on('mouseover', (event, d) => {
          if (d.description) {
            this.showPeriodTooltip(event, d);
          }
        })
        .on('mouseout', () => this.hideTooltip());

      // Draw period labels for each layer
      g.selectAll(`.period-label-layer-${layerIndex}`)
        .data(layer)
        .enter()
        .append('text')
        .attr('class', `period-label period-label-layer-${layerIndex}`)
        .attr('x', d => {
          const start = this.xScale(new Date(d.startYear, 0, 1));
          const end = this.xScale(new Date(d.endYear, 11, 31));
          return start + (end - start) / 2;
        })
        .attr('y', yOffset + layerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(d => d.title)
        .style('font-size', '10px')
        .style('fill', d => {
          const sourceColor = sources.find(s => s.name === d.source)?.color || '#333';
          return sourceColor;
        })
        .style('font-weight', 'bold')
        .style('pointer-events', 'none')
        .style('opacity', d => {
          const start = this.xScale(new Date(d.startYear, 0, 1));
          const end = this.xScale(new Date(d.endYear, 11, 31));
          return (end - start) > 50 ? 1 : 0; // Hide labels if period is too small
        });
    });
  }

  // Helper method to organize periods into non-overlapping layers
  private organizePeriodLayers(periods: TimelinePeriod[]): TimelinePeriod[][] {
    // Sort periods by start year
    const sortedPeriods = [...periods].sort((a, b) => a.startYear - b.startYear);

    const layers: TimelinePeriod[][] = [];

    sortedPeriods.forEach(period => {
      // Try to find a layer where this period doesn't overlap with any existing period
      let layerIndex = 0;
      let placed = false;

      while (!placed && layerIndex < layers.length) {
        const layer = layers[layerIndex];
        const overlaps = layer.some(existingPeriod =>
          this.periodsOverlap(period, existingPeriod)
        );

        if (!overlaps) {
          layer.push(period);
          placed = true;
        } else {
          layerIndex++;
        }
      }

      // If we couldn't place it in any existing layer, create a new one
      if (!placed) {
        layers.push([period]);
      }
    });

    return layers;
  }

  private periodsOverlap(a: TimelinePeriod, b: TimelinePeriod): boolean {
    return (a.startYear <= b.endYear && a.endYear >= b.startYear);
  }

  private showPeriodTooltip(event: MouseEvent, d: TimelinePeriod): void {
    this.tooltip
      .style('opacity', 1)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 10}px`)
      .html(`
        <div class="tooltip-header" style="border-color: ${sources.find(s => s.name === d.source)?.color || '#ccc'}">
          <h4>${d.startYear < 0 ? Math.abs(d.startYear) + ' a.C.' : d.startYear} - ${d.endYear < 0 ? Math.abs(d.endYear) + ' a.C.' : d.endYear}: ${d.title}</h4>
          <div class="tooltip-source">Fonte: ${d.source}</div>
        </div>
        <p>${d.description || 'Sem descrição disponível'}</p>
      `);
  }

  private hexToRgb(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }

  private drawEvents(): void {
    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Filter events based on current view
    const currentDomain = this.xScale.domain() as [Date, Date];
    const visibleEvents = events.filter(event => {
      const eventDate = event.century ? new Date(1, 0, 1) : new Date(event.year, event.month || 0, 1);
      const eventEndDate = event.endYear ? new Date(event.endYear, 11, 31) : event.endYear ? new Date(event.endYear, 11, 31) : eventDate;

      if (event.century) {
        const centuryStart = new Date(this.getYearFromCentury(event.century.split(' ')[0]), 0, 1);
        const centuryEnd = new Date(centuryStart.getFullYear() + 100, 0, 1);
        return centuryStart <= currentDomain[1] && centuryEnd >= currentDomain[0];
      }

      return eventDate <= currentDomain[1] && eventEndDate >= currentDomain[0];
    });

    // Calculate vertical positions for events based on category
    const categoryYPositions: { [key in EventCategory]: number } = {
      [EventCategory.POLITICAL]: 50,
      [EventCategory.LEGISLATION]: 50 + this.categoryLaneHeight,
      [EventCategory.INTERNATIONAL]: 50 + 2 * this.categoryLaneHeight,
      [EventCategory.SOCIAL]: 50 + 3 * this.categoryLaneHeight,
      [EventCategory.REPRESSION]: 50 + 4 * this.categoryLaneHeight,
      [EventCategory.COLONIZATION]: 50 + 5 * this.categoryLaneHeight,
      [EventCategory.ECONOMIC]: 50 + 6 * this.categoryLaneHeight,
      [EventCategory.CULTURAL]: 50 + 7 * this.categoryLaneHeight,
      [EventCategory.INTELLECTUAL]: 50 + 8 * this.categoryLaneHeight,
      [EventCategory.URBANIZATION]: 50 + 9 * this.categoryLaneHeight,
      [EventCategory.EXPLORATION]: 50 + 10 * this.categoryLaneHeight,
      [EventCategory.LABOR_MOVEMENT]: 50 + 11 * this.categoryLaneHeight,
    };


    // Draw events
    const eventGroups = g.selectAll('.event')
      .data(visibleEvents)
      .enter()
      .append('g')
      .attr('class', 'event')
      .attr('transform', d => {
        const eventYear = d.century ? this.getYearFromCentury(d.century.split(' ')[0]) : d.year;
        const x = this.xScale(new Date(eventYear, d.month || 0, 1));
        const y = categoryYPositions[d.category]; // Use category-based Y position
        return `translate(${x}, ${y})`;
      });

    // Draw event circles
    eventGroups.append('circle')
      .attr('class', 'event-circle')
      .attr('r', d => d.endYear ? 8 : 6)
      .attr('fill', d => categoryColors[d.category])
      .attr('stroke', d => {
        const sourceColor = sources.find(s => s.name === d.source)?.color || '#fff';
        return sourceColor;
      })
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => this.showTooltip(event, d))
      .on('mouseout', () => this.hideTooltip());

    // Draw connecting lines for events with duration
    eventGroups.each((d: TimelineEvent, index: number, nodes: any) => { // Use eventGroups.each and correct type
      if (d.endYear) {
        const eventGroup = d3.select(nodes[index]); // Select the current event group
        const startX = 0; // X position is relative to the event group
        // Calculate the horizontal distance based on the difference in years
        const endX = this.xScale(new Date(d.endYear!, 11, 31)) - this.xScale(new Date(d.year, d.month || 0, 1));

        eventGroup.append('line')
          .attr('x1', startX)
          .attr('y1', 0)
          .attr('x2', endX)
          .attr('y2', 0)
          .attr('stroke', categoryColors[d.category])
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,3')
          .attr('opacity', 0.7);
      }
    });


    // Add small year labels for events if there's enough space
    if (this.zoomLevel > 1.5) {
      eventGroups.append('text')
        .attr('class', 'event-year-label')
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('fill', '#666')
        .text(d => d.century ? d.century : d.year);
    }

    this.updateEventVisibility();
  }

  private getYearFromCentury(century: string): number {
    const centuryNumber = parseInt(century.replace(/[^0-9]/g, ''));
    const isBC = century.includes('a.C.');
    let year = (centuryNumber - 1) * 100;
    if (isBC) {
      year = -year;
    }
    return year;
  }

  private showTooltip(event: MouseEvent, d: TimelineEvent): void {
    const relatedCharacters = characters.filter(char =>
      char.relatedEvents.includes(d.id) || (d.characters && d.characters.includes(char.name))
    );

    this.tooltip
      .style('opacity', 1)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 10}px`)
      .html(`
        <div class="tooltip-header" style="border-color: ${categoryColors[d.category]}">
          <h4>${d.century ? d.century : `${d.year < 0 ? Math.abs(d.year) + ' a.C.' : d.year}${d.endYear ? ` - ${d.endYear < 0 ? Math.abs(d.endYear) + ' a.C.' : d.endYear}` : ''}`}: ${d.title}</h4>
          <div class="tooltip-source">Fonte: ${d.source}</div>
        </div>
        <p>${d.description}</p>
        ${relatedCharacters.length > 0 ?
          `<div class="characters">Personagens: ${relatedCharacters.map(c => c.name).join(', ')}</div>` :
          ''}
        <div class="tooltip-category">Categoria: ${categoryNames[d.category]}</div>
      `);
  }

  private hideTooltip(): void {
    this.tooltip
      .style('opacity', 0);
  }

  private createLegend(): void {
    const legendContainer = document.createElement('div');
    legendContainer.className = 'legend';

    // Category legend
    const categoryLegend = document.createElement('div');
    categoryLegend.className = 'legend-section';

    const categoryTitle = document.createElement('h4');
    categoryTitle.textContent = 'Categorias';
    categoryLegend.appendChild(categoryTitle);

    Object.entries(categoryNames).forEach(([category, name]) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';

      const colorBox = document.createElement('div');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = categoryColors[category as EventCategory];

      const text = document.createElement('div');
      text.className = 'legend-text';
      text.textContent = name;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(text);
      categoryLegend.appendChild(legendItem);
    });

    legendContainer.appendChild(categoryLegend);

    // Source legend
    const sourceLegend = document.createElement('div');
    sourceLegend.className = 'legend-section';

    const sourceTitle = document.createElement('h4');
    sourceTitle.textContent = 'Fontes';
    sourceLegend.appendChild(sourceTitle);

    sources.forEach(source => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';

      const colorBox = document.createElement('div');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = source.color;

      const text = document.createElement('div');
      text.className = 'legend-text';
      text.textContent = source.name;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(text);
      sourceLegend.appendChild(legendItem);
    });

    legendContainer.appendChild(sourceLegend);

    const container = this.svg.node()?.parentNode as HTMLElement;
    container.parentNode?.insertBefore(legendContainer, container.nextSibling);
  }

  private createCharacterList(): void {
    const characterContainer = document.createElement('div');
    characterContainer.className = 'character-network';

    const title = document.createElement('h3');
    title.className = 'character-title';
    title.textContent = 'Personagens Históricos';
    characterContainer.appendChild(title);

    // Add search input
    const searchContainer = document.createElement('div');
    searchContainer.style.marginBottom = '10px';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar personagem...';
    searchInput.style.width = '100%';
    searchInput.style.padding = '5px';
    searchInput.style.borderRadius = '4px';
    searchInput.style.border = '1px solid #ddd';

    searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const searchTerm = target.value.toLowerCase();

      const characterItems = characterList.querySelectorAll('.character-item');
      characterItems.forEach(item => {
        const name = (item as HTMLElement).textContent?.toLowerCase() || '';
        if (name.includes(searchTerm)) {
          (item as HTMLElement).style.display = 'block';
        } else {
          (item as HTMLElement).style.display = 'none';
        }
      });
    });

    searchContainer.appendChild(searchInput);
    characterContainer.appendChild(searchContainer);

    const characterList = document.createElement('div');
    characterList.className = 'character-list';

    // Group characters by source
    const charactersBySource: { [key: string]: Character[] } = {};
    characters.forEach(character => {
      if (!character.source) return;

      if (!charactersBySource[character.source]) {
        charactersBySource[character.source] = [];
      }
      charactersBySource[character.source].push(character);
    });

    // Create source headers and character items
    Object.entries(charactersBySource).forEach(([source, chars]) => {
      const sourceHeader = document.createElement('div');
      sourceHeader.style.width = '100%';
      sourceHeader.style.fontSize = '12px';
      sourceHeader.style.fontWeight = 'bold';
      sourceHeader.style.marginTop = '5px';
      sourceHeader.style.marginBottom = '3px';
      sourceHeader.style.color = sources.find(s => s.name === source)?.color || '#333';
      sourceHeader.textContent = source;
      characterList.appendChild(sourceHeader);

      chars.forEach(character => {
        if (character.relatedEvents.length > 0) {
          const characterItem = document.createElement('div');
          characterItem.className = 'character-item';
          characterItem.textContent = character.name;
          characterItem.dataset.id = character.id;
          characterItem.title = character.description;

          // Add source indicator
          if (character.source) {
            const sourceColor = sources.find(s => s.name === character.source)?.color || '#ccc';
            characterItem.style.borderLeft = `4px solid ${sourceColor}`;
          }

          characterItem.addEventListener('click', () => {
            if (this.selectedCharacters.has(character.id)) {
              this.selectedCharacters.delete(character.id);
              characterItem.classList.remove('active');
            } else {
              this.selectedCharacters.add(character.id);
              characterItem.classList.add('active');
            }
            this.updateEventVisibility();
          });

          characterList.appendChild(characterItem);
        }
      });
    });

    characterContainer.appendChild(characterList);

    const container = this.svg.node()?.parentNode as HTMLElement;
    container.parentNode?.insertBefore(characterContainer, container.nextSibling);
  }

  private createSourceList(): void {
    const sourceContainer = document.createElement('div');
    sourceContainer.className = 'source-filter';

    const title = document.createElement('h3');
    title.className = 'source-title';
    title.textContent = 'Filtrar por Fonte';
    sourceContainer.appendChild(title);

    const sourceList = document.createElement('div');
    sourceList.className = 'source-list';

    // Add "Select All" option
    const selectAllItem = document.createElement('div');
    selectAllItem.className = 'source-item';
    selectAllItem.style.marginBottom = '8px';
    selectAllItem.style.borderLeft = '4px solid #333';

    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.checked = true;
    selectAllCheckbox.id = 'source-all';

    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = 'source-all';
    selectAllLabel.textContent = 'Selecionar Todas';
    selectAllLabel.style.fontWeight = 'bold';

    selectAllItem.appendChild(selectAllCheckbox);
    selectAllItem.appendChild(selectAllLabel);
    sourceList.appendChild(selectAllItem);

    // Add individual sources
    const sourceCheckboxes: HTMLInputElement[] = [];
    sources.forEach(source => {
      const sourceItem = document.createElement('div');
      sourceItem.className = 'source-item active';
      sourceItem.dataset.id = source.id;
      sourceItem.style.borderLeft = `4px solid ${source.color}`;

      // Add source to selected sources by default
      this.selectedSources.add(source.id);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.id = `source-${source.id}`;
      sourceCheckboxes.push(checkbox);

      const label = document.createElement('label');
      label.htmlFor = `source-${source.id}`;
      label.textContent = source.name;

      sourceItem.appendChild(checkbox);
      sourceItem.appendChild(label);

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedSources.add(source.id);
          sourceItem.classList.add('active');
        } else {
          this.selectedSources.delete(source.id);
          sourceItem.classList.remove('active');
        }

        // Update "Select All" checkbox
        selectAllCheckbox.checked = sourceCheckboxes.every(cb => cb.checked);

        this.updateEventVisibility();
        this.updatePeriodVisibility(); // Update period visibility as well
        this.adjustZoomToFitVisibleData(); // Adjust zoom when source filter changes
      });

      sourceList.appendChild(sourceItem);
    });

    // Handle "Select All" checkbox
    selectAllCheckbox.addEventListener('change', () => {
      const isChecked = selectAllCheckbox.checked;

      sourceCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;

        const sourceItem = checkbox.closest('.source-item') as HTMLElement;
        const sourceId = sourceItem.dataset.id;

        if (isChecked) {
          this.selectedSources.add(sourceId!);
          sourceItem.classList.add('active');
        } else {
          this.selectedSources.delete(sourceId!);
          sourceItem.classList.remove('active');
        }
      });

      this.updateEventVisibility();
      this.updatePeriodVisibility(); // Update period visibility when "Select All" changes
      this.adjustZoomToFitVisibleData(); // Adjust zoom when source filter changes
    });

    sourceContainer.appendChild(sourceList);

    const container = this.svg.node()?.parentNode as HTMLElement;
    container.parentNode?.insertBefore(sourceContainer, container.nextSibling);
  }

  private updateEventVisibility(): void {
    // Filter by source first
    this.svg.selectAll('.event')
      .style('display', (d: TimelineEvent) => { // Change opacity to display
        const sourceId = sources.find(s => s.name === d.source)?.id;
        return (!sourceId || !this.selectedSources.has(sourceId)) ? 'none' : 'block'; // Use 'none' to hide and 'block' to show
      });

    // Then filter by character if any are selected
    if (this.selectedCharacters.size > 0) {
      this.svg.selectAll('.event')
        .style('display', (d: TimelineEvent) => {
          // If already hidden by source filter, keep it hidden
          const sourceId = sources.find(s => s.name === d.source)?.id;
          if (!sourceId || !this.selectedSources.has(sourceId)) {
            return 'none';
          }

          const eventCharacters = d.characters || [];
          const relatedCharacters = characters
            .filter(char => char.relatedEvents.includes(d.id))
            .map(char => char.id);

          const hasSelectedCharacter = [...this.selectedCharacters].some(charId => {
            const character = characters.find(c => c.id === charId);
            return character && (
              relatedCharacters.includes(charId) ||
              (character.name && eventCharacters.includes(character.name))
            );
          });

          return hasSelectedCharacter ? 'block' : 'none'; // Show only if character is selected as well
        });
    }
    // this.adjustZoomToFitVisibleData(); // Adjust zoom after updating event visibility - REMOVED to prevent stack overflow
  }

  private updatePeriodVisibility(): void {
    this.svg.selectAll('.period-bg, .period-label')
      .style('display', (d: TimelinePeriod) => {
        const sourceId = sources.find(s => s.name === d.source)?.id;
        return (!sourceId || !this.selectedSources.has(sourceId)) ? 'none' : 'block';
      });
    // this.adjustZoomToFitVisibleData(); // Adjust zoom after updating period visibility - REMOVED to prevent stack overflow
  }


  public resize(): void {
    const container = this.svg.node()?.parentNode as HTMLElement;
    this.width = container.clientWidth;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.svg.attr('width', this.width);
    this.xScale.range([0, this.innerWidth]);

    this.updateTimeline();
  }
}
