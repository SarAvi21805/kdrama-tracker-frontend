import { api } from './api.js';
import { SerieCard } from './components.js';

const grid = document.getElementById('series-grid');

async function loadSeries() {
    try {
        const series = await api.getAll();
        console.log("Datos recibidos de Go ✨:", series);
        
        // Verifica si es array o un objeto solo
        const seriesArray = Array.isArray(series) ? series : [series];
        
        // Dibujar las tarjetas en el HTML
        grid.innerHTML = seriesArray.map(s => SerieCard(s)).join('');
    } catch (err) {
        grid.innerHTML = `
            <div class="glass-card" style="text-align:center;">
                <p>¡Oh no! El servidor de Go está durmiendo 😴</p>
                <p><small>Asegúrate de que el backend esté corriendo en el puerto 8080</small></p>
            </div>
        `;
    }
}

// Función global para que el botón de la tarjeta
window.playMusic = (title) => {
    const player = document.getElementById('music-player');
    const text = document.getElementById('now-playing');
    player.classList.remove('player-hidden');
    text.innerText = `Reproduciendo OST: ${title} ✨`;
};

let allSeries = []; // Copia local para filtrar

async function loadSeries() {
    allSeries = await api.getAll();
    renderGrid(allSeries);
}

function renderGrid(data) {
    const grid = document.getElementById('series-grid');
    grid.innerHTML = data.map(s => SerieCard(s)).join('');
}

// Lógica de Búsqueda
window.searchSeries = () => {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = allSeries.filter(s => s.title.toLowerCase().includes(term));
    renderGrid(filtered);
};

// Lógica de Filtro por Categoría
window.filterByCategory = (cat) => {
    const filtered = cat === 'all' ? allSeries : allSeries.filter(s => s.category === cat);
    renderGrid(filtered);
    
    // Estilo de botón activo
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

// Cargar al inicio
document.addEventListener('DOMContentLoaded', loadSeries);