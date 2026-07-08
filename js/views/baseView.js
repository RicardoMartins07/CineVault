"use strict";

const movieGrid = document.querySelector(".movie-grid");
const heroCard = document.querySelector(".hero-card");
const searchInput = document.querySelector(".search-panel__input");
const searchForm = document.querySelector(".search-panel");
const searchBtn = document.querySelector(".search-panel__button");
const clearSearchBtn = document.querySelector(".clear-results-btn");
const searchResultsText = document.querySelector(".search-results");
const emptyResults = document.querySelector(".empty-results");
const emptybtn = document.querySelector(".empty-results__button");
const npages = document.querySelector(".n--pages");
const pagination = document.querySelector(".pagination");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const suggestions = document.querySelector(".suggestions");
const sortSelect = document.querySelector(".select");

export const renderMovie = function (movie) {
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "assets/no-poster.png";

  const html = `<article class="movie-card" data-movie-id="${movie.id}">
            <a class="movie-card__media"">
              <img
  src="${posterURL}"
  alt="${movie.title} poster"
  loading="lazy"
  class="lazy-image"
  width="500"
  height="750"
/>
              <span class="movie-card__badge">Movie</span>
            </a>
            <div class="movie-card__body">
              <div>
                <h3>${movie.title}</h3>
                <p>${movie.release_date?.slice(0, 4) || "N/A"} • ${movie.genre}</p>
              </div>
              <span class="rating">★${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="movie-card__actions">
              <button type="button" aria-label="Add to favorites" class="btn-action btn-favorite ${movie.favorite ? "--active" : ""}"><i data-lucide="heart"></i></button>
              <button type="button" aria-label="Add to watchlist" class="btn-action  btn-watchlist ${movie.watchlist ? "--active" : ""}"> <i data-lucide="bookmark"></i></button>
              <button type="button" aria-label="Mark as watched" class="btn-action  btn-watched ${movie.watched ? "--active" : ""}"> <i data-lucide="badge-check"></i></button>
            </div>
          </article>`;

  movieGrid.insertAdjacentHTML("beforeend", html);
  revealCards();
  lucide.createIcons();
};

export const renderLatest = function (movie) {
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "assets/no-poster.png";
  const html = `<div class="hero-card__poster">
             <img
  src="${posterURL}"
  alt="${movie.title} poster"
  loading="lazy"
  class="lazy-image"
  width="500"
  height="750"
/>
              <span class="hero-card__score">IMDb ${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="hero-card__body">
              <span class="pill">Featured</span>
              <h2>${movie.title}</h2>
              <p>
                ${movie.overview}
              </p>
            </div>`;
  heroCard.insertAdjacentHTML("beforeend", html);
};

export const addHandlerMovieClick = function (handler) {
  movieGrid.addEventListener("click", function (e) {
    if (e.target.closest(".btn-favorite")) {
      // favorito
      handler(e.target.closest(".movie-card").dataset.movieId, "favorite");
      return;
    }

    if (e.target.closest(".btn-watchlist")) {
      // watchlist
      handler(e.target.closest(".movie-card").dataset.movieId, "watchlist");
      return;
    }

    if (e.target.closest(".btn-watched")) {
      // watched
      handler(e.target.closest(".movie-card").dataset.movieId, "watched");
      return;
    }
    const movieCard = e.target.closest(".movie-card");
    if (!movieCard) return;
    const movieId = movieCard.dataset.movieId;
    handler(movieId);
  });
};

const revealCards = function () {
  const movieCards = document.querySelectorAll(".movie-card");

  const movieObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove("movie-card--hidden");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.15,
    },
  );

  movieCards.forEach((card) => {
    card.classList.add("movie-card--hidden");
    movieObserver.observe(card);
  });
};

export const addToFavorites = function (movieId) {
  const favoriteButton = document.querySelector(
    `.movie-card[data-movie-id="${movieId}"] .btn-favorite`,
  );

  if (favoriteButton.classList.contains("--active")) {
    favoriteButton.classList.remove("--active");
    return;
  } else {
    favoriteButton.classList.add("--active");
    favoriteButton.blur();
    return;
  }
};

export const addToWatchlist = function (movieId) {
  const watchlistButton = document.querySelector(
    `.movie-card[data-movie-id="${movieId}"] .btn-watchlist`,
  );

  if (watchlistButton.classList.contains("--active")) {
    watchlistButton.classList.remove("--active");
    return;
  } else {
    watchlistButton.classList.add("--active");
    watchlistButton.blur();
    return;
  }
};

export const addToWatched = function (movieId) {
  const watchedButton = document.querySelector(
    `.movie-card[data-movie-id="${movieId}"] .btn-watched`,
  );

  if (watchedButton.classList.contains("--active")) {
    watchedButton.classList.remove("--active");
    return;
  } else {
    watchedButton.classList.add("--active");
    watchedButton.blur();
    return;
  }
};

// Handle search form submission

const updateSearchUI = function (length) {
  if (length === 0) {
    emptyResults.classList.remove("--hidden");
    pagination.classList.add("--hidden");
  } else {
    emptyResults.classList.add("--hidden");
  }

  clearSearchBtn.classList.remove("--hidden");
  searchResultsText.textContent = `Search results (${length})`;
};

export const addHandlerSearch = function (handler) {
  searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    const length = await handler(query);

    updateSearchUI(length);
  });
};

export const clearResults = function () {
  movieGrid.innerHTML = "";
  searchInput.value = "";
  searchBtn.disabled = true;
};

// Handle clear search button click / Back to Popular
const resetUI = function () {
  clearResults();

  clearSearchBtn.classList.add("--hidden");
  emptyResults.classList.add("--hidden");
  searchResultsText.textContent = "Search results";
};

export const addHandlerResetResults = function (handler) {
  const reset = function () {
    resetUI();
    handler();
  };

  clearSearchBtn.addEventListener("click", reset);
  emptybtn.addEventListener("click", reset);
};

//Handler Pagination

export const handlerPagination = function (handler) {
  pagination.addEventListener("click", function (e) {
    if (e.target.closest(".btn-prev")) {
      handler("prev");
      return;
    }

    if (e.target.closest(".btn-next")) {
      handler("next");
      return;
    }
  });
};

export const scrollToResults = function () {
  const y = movieGrid.getBoundingClientRect().top + window.pageYOffset - 200;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};

export const updateUI = function (page, totalPages) {
  const pagination = document.querySelector(".pagination");
  if (totalPages > 1) {
    pagination.classList.remove("--hidden");
    npages.textContent = `Page ${page} of ${totalPages}`;
    btnPrev.disabled = page === 1;
    btnNext.disabled = page === totalPages;
  } else {
    pagination.classList.add("--hidden");
  }
};

export const changeForm = function () {
  searchInput.addEventListener("input", function () {
    const hasValue = searchInput.value.trim().length > 0;

    searchBtn.disabled = !hasValue;
  });
};

export const addHandlerSuggestions = function (handler) {
  suggestions.addEventListener("click", async function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const query = btn.textContent.trim();
    searchInput.value = query;

    const length = await handler(query);

    updateSearchUI(length);
  });
};

export const addHandlerSort = function (handler) {
  sortSelect.addEventListener("change", function () {
    handler(sortSelect.value);
  });
};

export const renderSkeleton = function () {
  movieGrid.innerHTML = "";

  const markup = `
    <article class="movie-card skeleton">
      <div class="movie-card__media"></div>
      <div class="movie-card__body">
        <div>
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
        </div>
        <div class="skeleton-rating"></div>
      </div>
      <div class="movie-card__actions">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </article>
  `;

  movieGrid.insertAdjacentHTML("beforeend", markup.repeat(8));
};

export const handleLazyImages = function () {
  document.querySelectorAll(".lazy-image").forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
      return;
    }

    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });
  });
};
