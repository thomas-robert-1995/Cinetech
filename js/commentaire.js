document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("commentForm");
    const commentInput = document.getElementById("commentInput");
    const commentList = document.getElementById("commentList");

    // Fonction pour charger les commentaires depuis le localStorage
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem("comments")) || [];
        commentList.innerHTML = ""; // Réinitialiser la liste des commentaires

        comments.forEach((comment, index) => {
            const commentElement = document.createElement("div");
            commentElement.className = "card mb-3";
            commentElement.innerHTML = `
                <div class="card-body">
                    <p class="card-text">${comment}</p>
                    <button class="btn btn-danger btn-sm" data-index="${index}">Supprimer</button>
                </div>
            `;
            commentList.appendChild(commentElement);
        });
    }

    // Fonction pour ajouter un commentaire
    function addComment(comment) {
        const comments = JSON.parse(localStorage.getItem("comments")) || [];
        comments.push(comment);
        localStorage.setItem("comments", JSON.stringify(comments));
        loadComments();
    }

    // Fonction pour supprimer un commentaire
    function deleteComment(index) {
        const comments = JSON.parse(localStorage.getItem("comments")) || [];
        comments.splice(index, 1); // Supprimer le commentaire à l'index donné
        localStorage.setItem("comments", JSON.stringify(comments));
        loadComments();
    }

    // Gestion de l'envoi du formulaire
    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const comment = commentInput.value.trim();
        if (comment) {
            addComment(comment);
            commentInput.value = ""; // Réinitialiser le champ de saisie
        }
    });

    // Gestion de la suppression des commentaires
    commentList.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-danger")) {
            const index = event.target.getAttribute("data-index");
            deleteComment(index);
        }
    });

    // Charger les commentaires au démarrage
    loadComments();
});