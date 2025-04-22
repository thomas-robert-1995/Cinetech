document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");
    const resultsList = document.getElementById("autocompleteResults");

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmI4ZWYwMDllZmNkY2I3YzI1N2FiMjczNjAyMDIzZSIsIm5iZiI6MTc0NDc5NDIwNC4xOTYsInN1YiI6IjY3ZmY3MjVjZWY1YWU2ODdjYmQ5OTZkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8d9ewudWxMsREcB4sIVlHEiy9o7xiAzh2M_ilgBldUM'
        }
    };

    searchBar.addEventListener("input", async () => {
        const query = searchBar.value.trim().toLowerCase();
        resultsList.innerHTML = "";

        if (query.length === 0) return;

        try {
            const suggestions = await fetchSuggestions(query);

            if (!suggestions || suggestions.length === 0) {
                resultsList.innerHTML = `<li class="dropdown-item text-muted">Aucun film trouvé</li>`;
                return;
            }

            suggestions.forEach(movie => {
                const li = document.createElement("li");
                li.classList.add("dropdown-item");
                li.textContent = movie.title;
                li.addEventListener("click", () => {
                    // Redirection vers la page de description avec l'ID et le type du film
                    window.location.href = `description.html?id=${movie.id}&type=movie`;
                });
                resultsList.appendChild(li);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des films :", error);
        }
    });

    async function fetchSuggestions(query) {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR&page=1&include_adult=false`;

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Erreur API TMDb: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    }
});
