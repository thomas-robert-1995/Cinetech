document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favoris-container");

    function renderFavoris() {
        container.innerHTML = "";
        const favoris = JSON.parse(localStorage.getItem("favoris")) || [];

        if (favoris.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Aucun favori pour l'instant.</p>
                </div>
            `;
            return;
        }

        favoris.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-sm-6 col-md-4 col-lg-3";

            col.innerHTML = `
                <div class="card shadow-sm h-100">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster}" class="card-img-top" alt="${item.title}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title text-center">${item.title}</h5>
                        <div class="d-grid gap-2 mt-3">
                            <a href="description.html?id=${item.id}&type=${item.type}" class="btn btn-primary">Voir</a>
                            <button class="btn btn-danger btn-remove" data-id="${item.id}" data-type="${item.type}">Supprimer</button>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(col);
        });

        addRemoveListeners();
    }

    function addRemoveListeners() {
        document.querySelectorAll(".btn-remove").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                const type = button.getAttribute("data-type");

                let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
                favoris = favoris.filter(item => !(item.id == id && item.type === type));

                localStorage.setItem("favoris", JSON.stringify(favoris));
                renderFavoris(); // Mise à jour sans rechargement
            });
        });
    }

    renderFavoris();
});
