const detailsContainer = document.querySelector(".details-layout");

export const renderMovieDetails = function (movie) {
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "assets/no-poster.png";
  const htmlPoster = `
  <aside class="details-poster">
    <img
      src="${posterURL}"
      alt="${movie.title} poster"
      width="342"
      height="513"
      loading="eager"
      fetchpriority="high"
    />
  </aside>
`;
  const htmlDetails = `
   <article class="details-panel" data-movie-id="${movie.id}">
            <span class="pill">Movie</span>
            <h1>${movie.title}</h1>

            <div class="details-meta">
              <span>${movie.release_date?.slice(0, 4) || "N/A"}</span>
              <span>${movie.runtime || "N/A"} min</span>
              <span>${movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>★ ${movie.vote_average.toFixed(1)} IMDb</span>
            </div>

            <p class="overview">
              ${movie.overview || "No overview available."}
            </p>

            <div class="action-row">
              <button class="primary-action btn-detail-favorite" type="button">
                ${movie.favorite ? "Remove from favorites" : "Add to favorites"}
              </button>
              <button class="secondary-action btn-detail-watchlist" type="button">
              
                ${movie.watchlist ? "Remove from watchlist" : "Add to watchlist"}
              </button>
              <button class="secondary-action btn-detail-watched" type="button">
                ${movie.watched ? "Remove from watched" : "Mark as watched"}
              </button>
              <button class="trailer-chip btn-trailer" type="button">
                <i data-lucide="play"></i>
                <span>Trailer</span>
              </button>
            </div>

            <section class="info-grid" aria-label="Title information">
              <div>
                <span>Director</span>
                <strong>${movie.director || "N/A"}</strong>
              </div>
              <div>
                <span>Cast</span>
                <strong>${movie.cast?.join(", ") || "N/A"}</strong>
              </div>
              <div>
                <span>Country</span>
                <strong>${movie.origin_country || "N/A"}</strong>
              </div>
              <div>
                <span>Language</span>
                <strong>${movie.spoken_languages?.map((lang) => lang.english_name).join(", ") || "N/A"}</strong>
              </div>
            </section>

            <section class="notes-card">
              <div class="notes-card__header">
                <div>
                  <span class="section-label">Personal rating</span>
                  <h2>Your notes</h2>
                </div>
                <div class="star-rating" aria-label="Rate this title">
                  <button type="button" data-rating="1">★</button>
                  <button type="button" data-rating="2">★</button>
                  <button type="button" data-rating="3">★</button>
                  <button type="button" data-rating="4">★</button>
                  <button type="button" data-rating="5">★</button>
                </div>
                <button class="clear-rating-btn --hidden" type="button">
  Remove rating
</button>
              </div>
<div class="saved-note ${movie.notes ? "" : "--hidden"}">
  <span>Saved note</span>
  <p class="saved-note__text">${movie.notes}</p>
</div>

              <textarea
                placeholder="Write a private note about this title..."
                class ="notes"
              ></textarea>
              <button class="primary-action btn-save-note" type="button" disabled>Save note</button>
            </section>
          </article>`;
  detailsContainer.innerHTML = htmlPoster + htmlDetails;
  lucide.createIcons();
};

export const addHandlerMovieDetails = function (handler) {
  detailsContainer.addEventListener("click", function (e) {
    const btnFavorite = e.target.closest(".btn-detail-favorite");
    const btnWatchlist = e.target.closest(".btn-detail-watchlist");
    const btnWatched = e.target.closest(".btn-detail-watched");

    if (!btnFavorite && !btnWatchlist && !btnWatched) return;

    const movieId = e.target.closest(".details-panel")?.dataset.movieId;
    if (!movieId) return;

    if (btnFavorite) handler(movieId, "favorite");
    if (btnWatchlist) handler(movieId, "watchlist");
    if (btnWatched) handler(movieId, "watched");
  });
};

export const updateActions = function (action, value) {
  let btn;
  switch (action) {
    case "favorite":
      btn = document.querySelector(".btn-detail-favorite");
      btn.textContent = value ? "Remove from favorites" : "Add to favorites";
      break;

    case "watchlist":
      btn = document.querySelector(".btn-detail-watchlist");
      btn.textContent = value ? "Remove from watchlist" : "Add to watchlist";
      break;
    case "watched":
      btn = document.querySelector(".btn-detail-watched");
      btn.textContent = value ? "Remove from watched" : "Mark as watched";
      break;
  }
};

export const addHandlerNotesInput = function () {
  detailsContainer.addEventListener("input", function (e) {
    const textarea = e.target.closest(".notes");
    if (!textarea) return;

    const saveBtn = document.querySelector(".btn-save-note");

    saveBtn.disabled = textarea.value.trim().length === 0;
  });
};

export const addHandlerSaveNote = function (handler) {
  detailsContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-save-note");
    if (!btn) return;

    const movieId = e.target.closest(".details-panel").dataset.movieId;
    const note = document.querySelector(".notes").value.trim();

    if (!note) return;

    handler(movieId, note);
  });
};

export const addHandlerRating = function (handler) {
  detailsContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".star-rating button");
    if (!btn) return;

    const rating = Number(btn.dataset.rating);
    const movieId = e.target.closest(".details-panel").dataset.movieId;

    handler(movieId, rating);
  });
};

export const addHandlerClearRating = function (handler) {
  detailsContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".clear-rating-btn");
    if (!btn) return;

    const movieId = e.target.closest(".details-panel").dataset.movieId;
    handler(movieId);
  });
};

export const renderSavedNote = function (note) {
  const noteBox = document.querySelector(".saved-note");
  const noteText = document.querySelector(".saved-note__text");

  if (!note) {
    noteBox.classList.add("--hidden");
    return;
  }

  noteText.textContent = note;
  noteBox.classList.remove("--hidden");

  const saveBtn = document.querySelector(".btn-save-note");
  const textarea = document.querySelector(".notes");
  textarea.value = "";
  saveBtn.disabled = true;
};

export const renderRating = function (rating) {
  const buttons = document.querySelectorAll(".star-rating button");
  const clearBtn = document.querySelector(".clear-rating-btn");

  buttons.forEach((btn) => {
    const value = Number(btn.dataset.rating);
    btn.classList.toggle("--active", value <= rating);
  });

  clearBtn.classList.toggle("--hidden", !rating);
};

export const renderSkeleton = function () {
  detailsContainer.innerHTML = `
    <aside class="details-poster skeleton-details-poster"></aside>

    <article class="details-panel skeleton-details-panel">
      <div class="skeleton-pill"></div>
      <div class="skeleton-heading"></div>

      <div class="details-meta">
        <span class="skeleton-chip"></span>
        <span class="skeleton-chip"></span>
        <span class="skeleton-chip"></span>
        <span class="skeleton-chip"></span>
      </div>

      <div class="skeleton-overview"></div>
      <div class="skeleton-overview short"></div>

      <div class="action-row">
        <span class="skeleton-action"></span>
        <span class="skeleton-action"></span>
        <span class="skeleton-action"></span>
      </div>

      <section class="info-grid">
        <div class="skeleton-info"></div>
        <div class="skeleton-info"></div>
        <div class="skeleton-info"></div>
        <div class="skeleton-info"></div>
      </section>
    </article>
  `;
};

export const addHandlerTrailer = function (handler) {
  detailsContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-trailer");
    if (!btn) return;

    const movieId = e.target.closest(".details-panel").dataset.movieId;
    handler(movieId);
  });
};
