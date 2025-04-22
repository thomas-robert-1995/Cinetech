const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
const BASE_URL = "https://api.themoviedb.org/3";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type"); // "movie" ou "tv"

async function loadDetails() {
    if (!id || !type) {
        console.error("Paramètres 'id' ou 'type' manquants dans l'URL.");
        document.getElementById("details").textContent = "Paramètres manquants.";
        return;
    }

    try {
        // Appels fetch parallèles pour les détails et les crédits
        const [detailsRes, creditsRes] = await Promise.all([
            fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=fr-FR`),
            fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=fr-FR`)
        ]);

        if (!detailsRes.ok || !creditsRes.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await detailsRes.json();
        const credits = await creditsRes.json();

        // Image principale
        const banner = document.getElementById("banner");
        if (data.backdrop_path || data.poster_path) {
            banner.src = `https://image.tmdb.org/t/p/original${data.backdrop_path || data.poster_path}`;
            banner.alt = data.title || data.name || "Poster";
        } else {
            banner.alt = "Image non disponible";
        }

        // Durée, langues, pays
        const duration = type === "movie" ? `${data.runtime || "??"} minutes` : `${data.episode_run_time?.[0] || "??"} min (épisode)`;
        const languages = data.spoken_languages?.map(lang => lang.name).join(", ") || "Non spécifiées";
        const countries = data.production_countries?.map(c => c.name).join(", ") || "Non spécifiés";

        // Acteurs principaux (limité à 5)
        const topCast = credits.cast?.slice(0, 5).map(actor => actor.name).join(", ") || "Non spécifiés";

        document.getElementById("details").innerHTML = `
            Durée : ${duration}<br/>
            Langues disponibles : ${languages}<br/>
            Qualité : 1080p<br/>
            Pays de production : ${countries}<br/>
            Acteurs principaux : ${topCast}<br/>
        `;

        // Synopsis
        document.getElementById("synopsis").textContent = data.overview || "Synopsis non disponible.";

        // Charger les suggestions
        loadSuggestions();
    } catch (error) {
        console.error("Erreur :", error);
        document.getElementById("details").textContent = "Impossible de charger les détails.";
        document.getElementById("synopsis").textContent = "Impossible de charger le synopsis.";
    }
}

async function loadSuggestions() {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=fr-FR&page=1`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des suggestions.");
        }

        const data = await response.json();
        const suggestionsGrid = document.getElementById("suggestions-grid");

        if (data.results.length === 0) {
            suggestionsGrid.innerHTML = "<p>Aucune suggestion disponible.</p>";
            return;
        }

        data.results.slice(0, 6).forEach(item => {
            const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "placeholder.jpg";
            const title = item.title || item.name;
            const suggestionDiv = document.createElement("div");
            suggestionDiv.className = "suggestion-item";
            suggestionDiv.innerHTML = `
                <img src="${posterPath}" alt="${title}" style="width: 100%; border-radius: 10px; cursor: pointer;" />
                <p style="text-align: center; margin-top: 10px;">${title}</p>
            `;
            suggestionDiv.addEventListener("click", () => {
                window.location.href = `description.html?id=${item.id}&type=${type}`;
            });
            suggestionsGrid.appendChild(suggestionDiv);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des suggestions :", error);
        document.getElementById("suggestions-grid").innerHTML = "<p>Impossible de charger les suggestions.</p>";
    }
}

loadDetails();

document.getElementById("add-to-favorites").addEventListener("click", async () => {
    try {
        const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=fr-FR`);
        if (!res.ok) throw new Error("Impossible de récupérer les infos pour favoris.");
        const data = await res.json();

        const favoris = JSON.parse(localStorage.getItem("favoris")) || [];

        // Vérifie si déjà en favoris
        const existeDeja = favoris.some(item => item.id === data.id && item.type === type);
        if (existeDeja) {
            alert("Ce contenu est déjà dans vos favoris !");
            return;
        }

        const item = {
            id: data.id,
            type: type,
            title: data.title || data.name,
            poster: data.poster_path || data.backdrop_path || ""
        };

        favoris.push(item);
        localStorage.setItem("favoris", JSON.stringify(favoris));
        alert("Ajouté aux favoris !");
    } catch (err) {
        console.error(err);
        alert("Erreur lors de l'ajout aux favoris.");
    }
});

