import { api } from './api.js';
import { SerieCard } from './components.js';

const grid = document.getElementById('series-grid');
const form = document.getElementById('series-form');

let allSeries = []; // Copia local para filtrar

async function loadSeries() {
    try {
        allSeries = await api.getAll();
        console.log("Datos recibidos ✨:", allSeries);
        renderGrid(allSeries);
    } catch (err) {
        document.getElementById('series-grid').innerHTML = "<p>Error de conexión 😴</p>";
    }
}

// Función global para que el botón de la tarjeta
window.playMusic = (title) => {
    const player = document.getElementById('music-player');
    const text = document.getElementById('now-playing');
    player.classList.remove('player-hidden');
    text.innerText = `Reproduciendo OST: ${title} ✨`;
};

function renderGrid(data) {
    const grid = document.getElementById('series-grid');
    if (!data || data.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.5rem;">Aún no tienes historias guardadas...</p>
                <p>¡Añade tu primer K-Drama o Anime arriba! ✨</p>
            </div>
        `;
        return;
    }
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

// Cambio de Tema
window.changeTheme = (theme) => {
    console.log("Cambiando a tema:", theme);
    if(theme === 'sakura' || theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('selected-theme', theme);
};

// Cargar tema al iniciar
const savedTheme = localStorage.getItem('selected-theme');
if(savedTheme) window.changeTheme(savedTheme);

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Recoge datos del formulario
    const newSerie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        image_url: document.getElementById('image_url').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        rating: parseInt(document.getElementById('rating').value),
        is_favorite: false
    };

    try {
        // Envia a Go a través de api.js
        await api.create(newSerie);
        
        // Limpia formulario y recarga la lista
        form.reset();
        alert("¡Historia guardada con éxito! ✨🌸");
        loadSeries();
    } catch (error) {
        alert("¡Oh no! No se pudo guardar. Revisa el servidor.");
    }
});

// ELIMINAR
window.deleteSerie = async (id) => {
    if (confirm("¿Seguro que quieres eliminar esta historia? 💔")) {
        await api.delete(id);
        loadSeries(); // Recargar la lista
    }
};

// EDITAR
let editingId = null;

window.editSerie = async (id) => {
    const series = allSeries.find(s => s.id === id);
    if (!series) return;

    // Llenar el formulario con datos actuales
    document.getElementById('title').value = series.title;
    document.getElementById('genre').value = series.genre;
    document.getElementById('category').value = series.category;
    document.getElementById('image_url').value = series.image_url;
    document.getElementById('description').value = series.description;
    document.getElementById('rating').value = series.rating;

    editingId = id;
    document.querySelector('#series-form button[type="submit"]').innerText = "ACTUALIZAR HISTORIA ✨";
    document.getElementById('btn-cancel').style.display = 'inline-block'; // Mostramos cancelar
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Cancelar el editar
window.cancelEdit = () => {
    editingId = null;
    form.reset();
    document.querySelector('#series-form button[type="submit"]').innerText = "GUARDAR EN MI LISTA ✨";
    document.getElementById('btn-cancel').style.display = 'none'; // Escondemos el botón
};

// Modificar el event listener del FORM para que sepa si se crea/edita
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        category: document.getElementById('category').value,
        image_url: document.getElementById('image_url').value,
        description: document.getElementById('description').value,
        rating: parseInt(document.getElementById('rating').value),
        is_favorite: false
    };

    if (editingId) {
        await api.update(editingId, data);
        editingId = null;
        document.querySelector('#series-form button').innerText = "GUARDAR EN MI LISTA ✨";
    } else {
        await api.create(data);
    }

    form.reset();
    loadSeries();
});

// Cargar al inicio
document.addEventListener('DOMContentLoaded', loadSeries);