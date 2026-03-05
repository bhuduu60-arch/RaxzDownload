async function loadMovies() {
  try {
    const response = await fetch("posts/movies.json");
    let movies = await response.json();

    // Get click data from localStorage
    let clickData = JSON.parse(localStorage.getItem("movieClicks")) || {};

    // Add click count to each movie
    movies.forEach(movie => {
      movie.clicks = clickData[movie.title] || 0;
    });

    // Sort by clicks (highest first)
    movies.sort((a, b) => b.clicks - a.clicks);

    const trendingRow = document.querySelectorAll(".card-row")[0];
    trendingRow.innerHTML = "";

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
        // Increase click count
        clickData[movie.title] = (clickData[movie.title] || 0) + 1;

        // Save back to localStorage
        localStorage.setItem("movieClicks", JSON.stringify(clickData));

        // Redirect to shortlink
        window.location.href = movie.shortlink;
      });

      trendingRow.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

loadMovies();
