const movieGrid = document.querySelector(".movie-grid");
const emptyState = document.querySelector(".empty-state");
const statsRatings = document.querySelector(".total-ratings");
const statsMovies = document.querySelector(".total-movies");
const statsAvgRating = document.querySelector(".avg-rating");
const statsAvgIMDB = document.querySelector(".avg-rate");

export const renderMovies = function (movies) {
  movieGrid.innerHTML = "";

  if (!movies.length) {
    emptyState.classList.remove("--hidden");
    return;
  }

  emptyState.classList.add("--hidden");

  movies.forEach((movie) => {
    movieGrid.insertAdjacentHTML("beforeend", generateMarkup(movie));
  });
};

const generateMarkup = function (movie) {
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
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

export const renderStatistics = function (movies, rating) {
  if (!movies.length) return;

  //Movies count
  statsMovies.textContent = movies.length;

  //IMDB RATING AVG
  const totalIMDb = movies.reduce((sum, movie) => sum + movie.vote_average, 0);

  statsAvgIMDB.textContent = (totalIMDb / movies.length).toFixed(1);

  //Rating o favorites
  const favoriteRatings = movies
    .map((movie) => rating.get(movie.id))
    .filter((value) => value !== undefined);

  statsRatings.textContent = favoriteRatings.length;

  if (!favoriteRatings.length) {
    statsAvgRating.textContent = "0.0";
    return;
  }

  const totalPersonalRating = favoriteRatings.reduce(
    (sum, value) => sum + value,
    0,
  );

  statsAvgRating.textContent = (
    totalPersonalRating / favoriteRatings.length
  ).toFixed(1);
};

export const renderError = function (message) {
  movieGrid.innerHTML = `
    <section class="empty-state">
      <div class="empty-state__icon">
        <i data-lucide="triangle-alert"></i>
      </div>

      <h2>Something went wrong</h2>

      <p>${message}</p>

      <a class="primary-link" href="index.html">
        Back to Discover
      </a>
    </section>
  `;

  lucide.createIcons();
};

export const renderSkeleton = function () {
  emptyState.classList.add("--hidden");
  movieGrid.innerHTML = "";

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

  movieGrid.insertAdjacentHTML("beforeend", skeleton.repeat(8));
};
