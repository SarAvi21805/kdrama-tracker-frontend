import { api } from './api.js';
import { SerieCard, SerieDetail } from './components.js';

const grid = document.getElementById('series-grid');
const form = document.getElementById('series-form');
const formContainer = document.getElementById('form-container');
const listContainer = document.getElementById('list-container');
const detailContainer = document.getElementById('serie-detail-container');

let allSeries = [];
let editingId = null;

async function loadSeries() {
    try {
        allSeries = await api.getAll();
        renderGrid(allSeries);
    } catch (err) {
        grid.innerHTML = "<p>Error de conexion. Intenta de nuevo mas tarde.</p>";
    }
}

function renderGrid(data) {
    if (!data || data.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Aun no tienes historias guardadas...</p>
                <span>Anade tu primer K-Drama o Anime arriba.</span>
            </div>
        `;
        return;
    }
    grid.innerHTML = data.map((serie) => SerieCard(serie)).join('');
}

function showDetailView() {
    formContainer.hidden = true;
    listContainer.hidden = true;
    detailContainer.hidden = false;
}

function showListView() {
    formContainer.hidden = false;
    listContainer.hidden = false;
    detailContainer.hidden = true;
    detailContainer.innerHTML = '';
}

async function renderSerieDetail(id) {
    showDetailView();
    detailContainer.innerHTML = '<div class="detail-loading">Cargando detalle...</div>';

    try {
        const serie = await api.getById(id);
        detailContainer.innerHTML = SerieDetail(serie);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        detailContainer.innerHTML = `
            <div class="detail-error">
                <h2>No encontramos esta historia</h2>
                <p>Puede que haya sido eliminada o que el enlace no sea valido.</p>
                <button type="button" class="btn-main" onclick="window.showSeriesList()">Volver a mi lista</button>
            </div>
        `;
    }
}

function handleRoute() {
    const match = window.location.hash.match(/^#serie\/(\d+)$/);
    if (match) {
        renderSerieDetail(match[1]);
        return;
    }
    showListView();
}

window.openSerieDetail = (id) => {
    window.location.hash = `serie/${id}`;
};

window.showSeriesList = () => {
    history.pushState('', document.title, window.location.pathname + window.location.search);
    showListView();
};

window.playMusic = (title) => {
    const player = document.getElementById('music-player');
    const text = document.getElementById('now-playing');
    player.classList.remove('player-hidden');
    text.innerText = `Reproduciendo OST: ${title}`;
};

window.playMusicById = async (id) => {
    const serieId = Number(id);
    const serie = allSeries.find((item) => item.id === serieId) || await api.getById(serieId);
    window.playMusic(serie.title);
};

window.searchSeries = () => {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = allSeries.filter((serie) => serie.title.toLowerCase().includes(term));
    renderGrid(filtered);
};

window.filterByCategory = (cat, event) => {
    const filtered = cat === 'all' ? allSeries : allSeries.filter((serie) => serie.category === cat);
    renderGrid(filtered);

    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
    event?.target?.classList.add('active');
};

window.changeTheme = (theme) => {
    if (theme === 'sakura' || theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('selected-theme', theme);
};

window.deleteSerie = async (id) => {
    if (confirm("Seguro que quieres eliminar esta historia?")) {
        await api.delete(id);
        await loadSeries();
        window.showSeriesList();
    }
};

window.editSerie = async (id) => {
    const serieId = Number(id);
    const series = allSeries.find((serie) => serie.id === serieId) || await api.getById(serieId);
    if (!series) return;

    document.getElementById('title').value = series.title;
    document.getElementById('genre').value = series.genre;
    document.getElementById('category').value = series.category;
    document.getElementById('image_url').value = series.image_url;
    document.getElementById('description').value = series.description;
    document.getElementById('rating').value = series.rating;

    editingId = serieId;
    document.querySelector('#series-form button[type="submit"]').innerText = 'Actualizar historia';
    document.getElementById('btn-cancel').style.display = 'inline-block';
    window.showSeriesList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.cancelEdit = () => {
    editingId = null;
    form.reset();
    document.querySelector('#series-form button[type="submit"]').innerText = 'Guardar en mi lista';
    document.getElementById('btn-cancel').style.display = 'none';
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        category: document.getElementById('category').value,
        image_url: document.getElementById('image_url').value,
        description: document.getElementById('description').value,
        rating: parseInt(document.getElementById('rating').value, 10),
        is_favorite: false
    };

    if (editingId) {
        await api.update(editingId, data);
        editingId = null;
    } else {
        await api.create(data);
    }

    window.cancelEdit();
    await loadSeries();
});

document.addEventListener('DOMContentLoaded', async () => {
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme) window.changeTheme(savedTheme);

    await loadSeries();
    handleRoute();
});

window.addEventListener('hashchange', handleRoute);

document.addEventListener('keydown', (event) => {
    if (event.target.closest?.('button')) return;

    const card = event.target.closest?.('.card');
    if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;

    event.preventDefault();
    window.openSerieDetail(card.dataset.serieId);
});
