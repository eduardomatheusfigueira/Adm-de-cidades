import './style.css';
import { Timeline } from './timeline';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="timeline-container">
    <h1 class="timeline-title">Linha do Tempo da História do Brasil</h1>
    <h2 class="timeline-subtitle">8000 a.C. - 1945: Integrando perspectivas históricas brasileiras</h2>
    <div id="timeline"></div>
  </div>
`;

// Initialize timeline
const timeline = new Timeline('timeline');

// Handle window resize
window.addEventListener('resize', () => {
  timeline.resize();
});
