let allMovies = [];
let clickData = JSON.parse(localStorage.getItem("movieClicks")) || {};

async function loadMovies() {
  try {
    const response = await fetch("posts/movies.json");
    let movies = await response.json();

    movies.forEach(movie => {
      movie.clicks = clickData[movie.title] || 0;
    });

    movies.sort((a, b) => b.clicks - a.clicks);

    allMovies = movies;

    displayMovies(allMovies);

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

function displayMovies(movies) {
  const row = document.querySelector(".card-row");
  row.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" loading="lazy">
      <div class="card-info">
        <div class="card-title">${movie.title}</div>
        <div class="card-category">${movie.category}</div>
        <div class="card-category">🔥 ${movie.clicks} downloads</div>
        <button class="download-btn">Download</button>
      </div>
    `;

    const button = card.querySelector(".download-btn");

    button.addEventListener("click", () => {
      clickData[movie.title] = (clickData[movie.title] || 0) + 1;
      localStorage.setItem("movieClicks", JSON.stringify(clickData));
      window.location.href = movie.shortlink;
    });

    row.appendChild(card);
  });
}

function setupSearch() {
  const searchInput = document.querySelector(".search-bar");

  searchInput.addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();

    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchText) ||
      movie.category.toLowerCase().includes(searchText)
    );

    displayMovies(filtered);
  });
}

function setupCategoryFilter() {
  const menuLinks = document.querySelectorAll(".main-menu a");

  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const category = link.getAttribute("data-category");

      if (category === "all") {
        displayMovies(allMovies);
      } else {
        const filtered = allMovies.filter(movie => movie.category === category);
        displayMovies(filtered);
      }
    });
  });
}

loadMovies();
setupSearch();
setupCategoryFilter();
