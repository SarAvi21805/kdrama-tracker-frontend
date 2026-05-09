function renderStars(rating = 0) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    return '&#9733;'.repeat(value) + '&#9734;'.repeat(5 - value);
}

function escapeText(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export function SerieCard(serie) {
    return `
        <article class="card" data-serie-id="${serie.id}" onclick="window.openSerieDetail(${serie.id})" tabindex="0" role="button" aria-label="Ver detalle de ${escapeText(serie.title)}">
            <img src="${escapeText(serie.image_url)}" alt="${escapeText(serie.title)}">
            <div class="card-info">
                <span class="badge">${escapeText(serie.category)}</span>
                <h3>${escapeText(serie.title)}</h3>
                <p>${escapeText(serie.description)}</p>
                <span class="rating-stars" aria-label="Rating ${serie.rating} de 5">${renderStars(serie.rating)}</span>
                <div class="card-actions">
                    <button class="btn-main" onclick="event.stopPropagation(); window.playMusicById(${serie.id})">OST</button>
                    <button class="btn-edit" onclick="event.stopPropagation(); window.editSerie(${serie.id})">Editar</button>
                    <button class="btn-delete" onclick="event.stopPropagation(); window.deleteSerie(${serie.id})">Eliminar</button>
                </div>
            </div>
        </article>
    `;
}

export function SerieDetail(serie) {
    return `
        <article class="detail-card">
            <button type="button" class="btn-secondary detail-back" onclick="window.showSeriesList()">Volver a mi lista</button>
            <div class="detail-layout">
                <img class="detail-poster" src="${escapeText(serie.image_url)}" alt="${escapeText(serie.title)}">
                <div class="detail-content">
                    <span class="badge">${escapeText(serie.category)}</span>
                    <h2>${escapeText(serie.title)}</h2>
                    <div class="detail-meta">
                        <span>${escapeText(serie.genre)}</span>
                        <span class="rating-stars" aria-label="Rating ${serie.rating} de 5">${renderStars(serie.rating)}</span>
                    </div>
                    <p>${escapeText(serie.description || 'Sin descripcion disponible.')}</p>
                    <div class="detail-actions">
                        <button class="btn-main" onclick="window.playMusicById(${serie.id})">Escuchar OST</button>
                        <button class="btn-edit" onclick="window.editSerie(${serie.id})">Editar historia</button>
                        <button class="btn-delete" onclick="window.deleteSerie(${serie.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        </article>
    `;
}
