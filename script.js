let allMovies = [];
let clickData = JSON.parse(localStorage.getItem("movieClicks")) || {};
let userType = localStorage.getItem("userType") || "free";

const DAILY_LIMIT = 3;

/* ===========================
   Utility Functions
=========================== */

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getDownloadData() {
  return JSON.parse(localStorage.getItem("downloadData")) || {};
}

function saveDownloadData(data) {
  localStorage.setItem("downloadData", JSON.stringify(data));
}

function getRemainingDownloads() {
  if (userType === "vip") return "Unlimited";

  const today = getTodayDate();
  const data = getDownloadData();
  const used = data[today] || 0;

  return Math.max(DAILY_LIMIT - used, 0);
}

function canDownload() {
  if (userType === "vip") return true;

  const today = getTodayDate();
  const data = getDownloadData();
  const used = data[today] || 0;

  return used < DAILY_LIMIT;
}

function increaseDownloadCount() {
  const today = getTodayDate();
  const data = getDownloadData();

  if (!data[today]) data[today] = 0;

  data[today] += 1;
  saveDownloadData(data);
}

/* ===========================
   Load Movies
=========================== */

async function loadMovies() {
  try {
    const response = await fetch("posts/movies.json");
    let movies = await response.json();

    movies.forEach(movie => {
      movie.clicks = clickData[movie.title] || 0;
    });

    movies.sort((a, b) => b.clicks - a.clicks);

    allMovies = movies;

    setupFeaturedHero(movies);
    displayMovies(allMovies);

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

/* ===========================
   Featured Hero
=========================== */

function setupFeaturedHero(movies) {
  const heroSection = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  const featuredMovie = movies.find(movie => movie.featured === true);
  if (!featuredMovie) return;

  heroSection.style.background = `
    linear-gradient(to right, #000000cc, #00000099),
    url('${featuredMovie.image}') center/cover
  `;

  heroContent.innerHTML = `
    <h1>${featuredMovie.title}</h1>
    <p>${featuredMovie.category}</p>
    <button class="hero-btn">Download Now</button>
  `;

  const button = heroContent.querySelector(".hero-btn");

  button.addEventListener("click", () => {
    handleDownload(featuredMovie);
  });
}

/* ===========================
   Download Logic
=========================== */

function handleDownload(movie) {
  if (!canDownload()) {
    alert("Daily download limit reached! Upgrade to VIP for unlimited downloads.");
    return;
  }

  increaseDownloadCount();

  clickData[movie.title] = (clickData[movie.title] || 0) + 1;
  localStorage.setItem("movieClicks", JSON.stringify(clickData));

  updateProfileInfo();

  window.location.href = movie.shortlink;
}

/* ===========================
   Display Movies
=========================== */

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
      handleDownload(movie);
    });

    row.appendChild(card);
  });
}

/* ===========================
   Search
=========================== */

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

/* ===========================
   Category Filter
=========================== */

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

/* ===========================
   Profile System
=========================== */

function setupProfileNavigation() {
  const profileNav = document.getElementById("profileNav");
  const homeNav = document.getElementById("homeNav");
  const profileSection = document.querySelector(".profile-section");
  const contentSection = document.querySelector(".content-section");
  const heroSection = document.querySelector(".hero");

  profileNav.addEventListener("click", (e) => {
    e.preventDefault();
    profileSection.style.display = "block";
    contentSection.style.display = "none";
    heroSection.style.display = "none";
    updateProfileInfo();
  });

  homeNav.addEventListener("click", (e) => {
    e.preventDefault();
    profileSection.style.display = "none";
    contentSection.style.display = "block";
    heroSection.style.display = "block";
  });
}

function updateProfileInfo() {
  document.getElementById("userTypeDisplay").textContent = userType.toUpperCase();
  document.getElementById("downloadsRemaining").textContent = getRemainingDownloads();
}

function setupUpgradeButton() {
  const btn = document.getElementById("upgradeBtn");

  btn.addEventListener("click", () => {
    userType = "vip";
    localStorage.setItem("userType", "vip");
    updateProfileInfo();
    alert("You are now VIP!");
  });
}

/* ===========================
   Init
=========================== */

loadMovies();
setupSearch();
setupCategoryFilter();
setupProfileNavigation();
setupUpgradeButton();
updateProfileInfo();
