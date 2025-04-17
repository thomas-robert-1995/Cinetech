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
  } catch (error) {
    console.error("Erreur :", error);
    document.getElementById("details").textContent = "Impossible de charger les détails.";
    document.getElementById("synopsis").textContent = "Impossible de charger le synopsis.";
  }
}

loadDetails();
