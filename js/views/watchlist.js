const watchlistGrid = document.querySelector(".movie-grid--watchlist");
const watchedGrid = document.querySelector(".movie-grid--watched");
const emptyWatchlist = document.querySelector(".empty-watchlist");
const emptyWatched = document.querySelector(".empty-watched");
const watchedCount = document.querySelector(".watched-count");
const watchlistCount = document.querySelector(".watchlist-count");

export const renderMoviesWatched = function (movies) {
  watchedGrid.innerHTML = "";

  if (!movies.length) {
    emptyWatched.classList.remove("--hidden");
    watchedCount.textContent = 0;
    return;
  }

  emptyWatched.classList.add("--hidden");

  movies.forEach((movie) => {
    watchedGrid.insertAdjacentHTML("beforeend", generateMarkup(movie));
  });
  watchedCount.textContent = movies.length;
};

export const renderTotalsWatchList = function (movies) {
  watchlistGrid.innerHTML = "";

  if (!movies.length) {
    emptyWatchlist.classList.remove("--hidden");
    watchlistCount.textContent = 0;
    return;
  }

  emptyWatchlist.classList.add("--hidden");

  movies.forEach((movie) => {
    watchlistGrid.insertAdjacentHTML("beforeend", generateMarkup(movie));
  });

  watchlistCount.textContent = movies.length;
};

const generateMarkup = function (movie) {
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "assets/no-poster.png";

  return `
    <article class="movie-card" data-movie-id="${movie.id}">
      <a class="movie-card__media" href="details.html?id=${movie.id}">
        <img src="${posterURL}" alt="${movie.title} poster" />
        <span class="movie-card__badge">Movie</span>
      </a>

      <div class="movie-card__body">
        <div>
          <h3>${movie.title}</h3>
          <p>${movie.release_date?.slice(0, 4) || "N/A"}</p>
        </div>
        <span class="rating">★ ${movie.vote_average?.toFixed(1) || "N/A"}</span>
      </div>
    </article>
  `;
};

export const renderWatchedError = function () {
  watchedGrid.innerHTML = `
    <div class="empty-mini">
      <p>Couldn’t load watched titles.</p>
    </div>
  `;
};

export const renderWatchlistError = function () {
  watchlistGrid.innerHTML = `
    <div class="empty-mini">
      <p>Couldn’t load watchlist titles.</p>
    </div>
  `;
};

export const renderSkeleton = function () {
  emptyWatched.classList.add("--hidden");
  emptyWatchlist.classList.add("--hidden");

  watchedGrid.innerHTML = "";
  watchlistGrid.innerHTML = "";

  const skeleton = `
    <article class="movie-card skeleton">
      <div class="movie-card__media"></div>

      <div class="movie-card__body">
        <div>
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
        </div>

        <div class="skeleton-rating"></div>
      </div>
    </article>
  `;

  watchedGrid.insertAdjacentHTML("beforeend", skeleton.repeat(3));
  watchlistGrid.insertAdjacentHTML("beforeend", skeleton.repeat(3));
};
