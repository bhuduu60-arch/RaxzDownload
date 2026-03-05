async function loadMovies() {
  try {
    const response = await fetch("posts/movies.json");
    const movies = await response.json();

    const cardRows = document.querySelectorAll(".card-row");

    // Use first row for trending
    const trendingRow = cardRows[0];

    movies.forEach(movie => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" loading="lazy">
        <div class="card-title">${movie.title}</div>
      `;

      card.addEventListener("click", () => {
        window.location.href = movie.shortlink;
      });

      trendingRow.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

loadMovies();
