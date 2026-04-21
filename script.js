console.log("JS is connected");

const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const moviesContainer = document.getElementById("movies");
const message = document.getElementById("message");

// Theme
const toggleBtn = document.getElementById("toggleTheme");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Modal
const modal = document.getElementById("modal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

// API
const API_KEY = "c4a4ee590d60076dd1a41e1ac2175100";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

// SEARCH
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();

  if (!query) {
    showMessage("Please enter a movie name.");
    return;
  }

  showMessage("Loading...");
  moviesContainer.innerHTML = "";

  try {
    const res = await fetch(
      `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      showMessage("No movies found.");
      return;
    }

    showMessage("");
    displayMovies(data.results);

  } catch (error) {
    console.error(error);
    showMessage("Error fetching movies.");
  }
});

// DISPLAY MOVIES
function displayMovies(movies) {
  moviesContainer.innerHTML = movies.map(movie => {

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : "https://via.placeholder.com/300x450";

    return `
      <div class="movie" onclick="openModal('${movie.title}', '${movie.overview}', '${poster}')">
        <img src="${poster}" />
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        <button onclick="saveFavorite('${movie.title}')">❤️ Save</button>
      </div>
    `;
  }).join("");
}

// MESSAGE
function showMessage(text) {
  message.innerHTML = text;
}

// MODAL
function openModal(title, overview, poster) {
  modal.style.display = "block";
  modalDetails.innerHTML = `
    <h2>${title}</h2>
    <img src="${poster}" width="200">
    <p>${overview}</p>
  `;
}

closeModal.onclick = () => {
  modal.style.display = "none";
};

// FAVORITES
function saveFavorite(title) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(title);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Saved to favorites!");
}