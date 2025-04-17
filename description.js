const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
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
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await response.json();

    // Affiche l'image principale
    const banner = document.getElementById("banner");
    if (data.backdrop_path || data.poster_path) {
      banner.src = `https://image.tmdb.org/t/p/original${data.backdrop_path || data.poster_path}`;
      banner.alt = data.title || data.name || "Poster";
    } else {
      banner.alt = "Image non disponible";
    }

    // Partie explication
    const duration = type === "movie" ? `${data.runtime || "??"} minutes` : `${data.episode_run_time?.[0] || "??"} min (épisode)`;

    // Langues disponibles
    const languages = data.spoken_languages?.map(lang => lang.name).join(", ") || "Non spécifiées";

    // Pays de production
    const countries = data.production_countries?.map(c => c.name).join(", ") || "Non spécifiés";

    document.getElementById("details").innerHTML = `
      Durée : ${duration}<br/>
      Langues disponibles : ${languages}<br/>
      Qualité : 1080p<br/>
      Pays de production : ${countries}<br/>
    `;

    // Synopsis
    document.getElementById("synopsis").textContent = data.overview || "Synopsis non disponible.";
  } catch (error) {
    console.error("Erreur :", error);
    document.getElementById("details").textContent = "Impossible de charger les détails.";
    document.getElementById("synopsis").textContent = "Impossible de charger le synopsis.";
  }
}

loadDetails();
