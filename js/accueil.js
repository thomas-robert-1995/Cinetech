const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmI4ZWYwMDllZmNkY2I3YzI1N2FiMjczNjAyMDIzZSIsIm5iZiI6MTc0NDc5NDIwNC4xOTYsInN1YiI6IjY3ZmY3MjVjZWY1YWU2ODdjYmQ5OTZkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8d9ewudWxMsREcB4sIVlHEiy9o7xiAzh2M_ilgBldUM'
  }
};

const movieList = document.querySelector('.movie-list');
const seriesList = document.querySelector('.series-list');
const suggestionsSection = document.getElementById('suggestions');

// 👉 Affiche les films
fetch('https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1', options)
  .then(res => res.json())
  .then(data => {
    data.results.slice(0, 8).forEach(movie => {
      const card = createCard(movie.title, movie.poster_path);
      movieList.appendChild(card);
    });

    // Suggestions : ajouter quelques films
    data.results.slice(0, 4).forEach(movie => {
      const card = createCard(movie.title, movie.poster_path);
      suggestionsSection.appendChild(card);
    });
  })
  .catch(err => console.error(err));

// 👉 Affiche les séries
fetch('https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=1', options)
  .then(res => res.json())
  .then(data => {
    data.results.slice(0, 8).forEach(serie => {
      const card = createCard(serie.name, serie.poster_path);
      seriesList.appendChild(card);
    });

    // Suggestions : ajouter quelques séries
    data.results.slice(0, 4).forEach(serie => {
      const card = createCard(serie.name, serie.poster_path);
      suggestionsSection.appendChild(card);
    });
  })
  .catch(err => console.error(err));

// 🔧 Fonction utilitaire pour créer une carte de film/série
function createCard(title, posterPath) {
  const div = document.createElement('div');
  div.className = 'media-card';
  div.style.margin = '10px';
  div.style.textAlign = 'center';
  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${posterPath}" alt="${title}" style="width:150px; border-radius:10px;" />
    <p>${title}</p>
  `;
  return div;
}
