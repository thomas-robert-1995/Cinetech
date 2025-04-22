document.addEventListener("DOMContentLoaded", async () => {
    const moviesContainer = document.querySelector(".movie-list");
    const seriesContainer = document.querySelector(".series-list");

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmI4ZWYwMDllZmNkY2I3YzI1N2FiMjczNjAyMDIzZSIsIm5iZiI6MTc0NDc5NDIwNC4xOTYsInN1YiI6IjY3ZmY3MjVjZWY1YWU2ODdjYmQ5OTZkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8d9ewudWxMsREcB4sIVlHEiy9o7xiAzh2M_ilgBldUM'
        }
    };

    // Récupérer les films du moment
    try {
        const moviesResponse = await fetch("https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1", options);
        const moviesData = await moviesResponse.json();
        displayItems(moviesData.results, moviesContainer, "movie");

        const seriesResponse = await fetch("https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=1", options);
        const seriesData = await seriesResponse.json();
        displayItems(seriesData.results, seriesContainer, "tv");
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }

    function displayItems(items, container, type) {
        container.innerHTML = ""; // Vider le conteneur avant d'ajouter les éléments
        items.slice(0, items.length - 4).forEach(item => { // Exclure les 4 derniers films
            const div = document.createElement("div");
            div.classList.add("item");
            div.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" class="img-fluid">
            `;
            div.addEventListener("click", () => {
                // Redirection vers la page de description avec l'ID et le type
                window.location.href = `description.html?id=${item.id}&type=${type}`;
            });
            container.appendChild(div);
        });
    }
});
