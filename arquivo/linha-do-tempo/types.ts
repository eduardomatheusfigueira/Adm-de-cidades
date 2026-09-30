export interface TimelineEvent {
  id: number;
  year?: number; // Tornar year opcional
  endYear?: number;
  month?: number; // Tornar month opcional
  day?: number; // Tornar day opcional
  title: string;
  description: string;
  category: EventCategory;
  characters?: string[];
  source: string;
  century?: string; // Adicionado para eventos sem data precisa
}

export interface TimelinePeriod {
  id: number;
  startYear: number;
  endYear: number;
  title: string;
  description?: string;
  source: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  relatedEvents: number[];
  source?: string; // Adicionado para identificar a fonte do personagem
}

export enum EventCategory {
  POLITICAL = "political",
  LABOR_MOVEMENT = "labor_movement",
  LEGISLATION = "legislation",
  INTERNATIONAL = "international",
  SOCIAL = "social",
  REPRESSION = "repression",
  // Novas categorias para Raízes do Brasil
  COLONIZATION = "colonization",
  ECONOMIC = "economic",
  CULTURAL = "cultural",
  INTELLECTUAL = "intellectual",
  URBANIZATION = "urbanization",
  EXPLORATION = "exploration" // Adicionar EXPLORATION
}

export interface CategoryInfo {
  name: string;
  color: string;
}

export interface SourceInfo {
  id: string;
  name: string;
  author: string;
  color: string;
  description?: string;
}
