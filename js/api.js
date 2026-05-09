const API_URL = "https://kdrama-tracker-backend.onrender.com";

export const api = {
    // Obtener todas las series
    async getAll() {
        try {
            const res = await fetch(`${API_URL}/series`);
            return await res.json();
        } catch (error) {
            console.error("Error al obtener series 🌸:", error);
            throw error;
        }
    },
    // Obtener serie por ID
    async getById(id) {
        const res = await fetch(`${API_URL}/series/${id}`);
        if (!res.ok) {
            throw new Error('Serie no encontrada');
        }
        return await res.json();
    },
    // Crear serie
    async create(data) {
        const res = await fetch(`${API_URL}/series`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await res.json();
    },
    // Borrar serie
    async delete(id) {
        await fetch(`${API_URL}/series/${id}`, { method: 'DELETE' });
    },
    // Editar
    async update(id, data) {
        await fetch(`${API_URL}/series/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
};
