const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
const grid = document.getElementById("grid-container");

async function loadMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=1`);
  const data = await res.json();
  displayItems(data.results);
}

async function loadSeries() {
  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=1`);
  const data = await res.json();
  displayItems(data.results);
}

function displayItems(items) {
  grid.innerHTML = ""; // clear grid
  items.forEach(item => {
    const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "placeholder.jpg";
    const div = document.createElement("div");
    div.innerHTML = `<img src="${posterPath}" alt="${item.title || item.name}" style="width: 100%; cursor:pointer" onclick="window.location.href='description.html?id=${item.id}&type=${item.title ? 'movie' : 'tv'}'" />`;
    grid.appendChild(div);
  });
}

// Appel initial
loadMovies();
