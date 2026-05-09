export function SerieCard(serie) {
    return `
        <div class="card">
            <img src="${serie.image_url}" alt="${serie.title}">
            <div class="card-info">
                <span class="badge">${serie.category}</span>
                <h3>${serie.title}</h3>
                <p>${serie.description}</p>
                <div class="card-actions">
                    <button class="btn-main" onclick="window.playMusic('${serie.title}')">🎵 OST</button>
                    <button class="btn-edit" onclick="window.editSerie(${serie.id})">✏️ Editar</button>
                    <button class="btn-delete" onclick="window.deleteSerie(${serie.id})">🗑️ Eliminar</button>
                </div>
            </div>
        </div>
    `;
}