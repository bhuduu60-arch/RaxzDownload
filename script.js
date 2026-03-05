async function loadMovies() {
  try {
    const response = await fetch("posts/movies.json");
    const movies = await response.json();

    const trendingRow = document.querySelectorAll(".card-row")[0];

    movies.forEach(movie => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" loading="lazy">
        <div class="card-info">
          <div class="card-title">${movie.title}</div>
          <div class="card-category">${movie.category}</div>
          <button class="download-btn">Download</button>
        </div>
      `;

      const button = card.querySelector(".download-btn");
      button.addEventListener("click", () => {
        window.location.href = movie.shortlink;
      });

      trendingRow.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

loadMovies();
