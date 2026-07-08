import * as movieModel from "../models/movieModel.js";
import * as resultsView from "../views/baseView.js";
import * as themeView from "../views/themeView.js";
import * as toastView from "../views/toastView.js";

export const init = async function () {
  themeView.initTheme();
  await movieModel.getGenres();
  //movieModel.resetState();
  movieModel.loadLocalStorage();

  renderPopularMovies();

  renderLatest();

  resultsView.addHandlerSearch(controlSearch);

  resultsView.addHandlerResetResults(controlClearSearch);

  resultsView.handlerPagination(controlPagination);

  resultsView.changeForm(controlFormChange);
  resultsView.addHandlerSuggestions(controlSearch);
  resultsView.addHandlerSort(controlSort);
};

const controlMovie = function (movieId, action = null) {
  if (!action) {
    window.location.href = `details.html?id=${movieId}`;
    return;
  }

  let added;
  switch (action) {
    case "favorite":
      added = movieModel.addToFavorites(movieId);

      resultsView.addToFavorites(movieId);

      toastView.showToast(
        added ? "Added to favorites" : "Removed from favorites",
        "success",
        added ? "heart" : "heart-off",
      );

      break;

    case "watchlist":
      added = movieModel.addToWatchlist(movieId);

      resultsView.addToWatchlist(movieId);

      toastView.showToast(
        added ? "Added to watchlist" : "Removed from watchlist",
        "success",
        added ? "bookmark-plus" : "bookmark-x",
      );
      break;

    case "watched":
      added = movieModel.addToWatched(movieId);

      resultsView.addToWatched(movieId);

      toastView.showToast(
        added ? "Marked as watched" : "Removed from watched",
        "success",
        added ? "badge-check" : "circle",
      );

      break;
  }
};

const controlSearch = async function (query) {
  try {
    if (!query) return;
    resultsView.renderSkeleton();

    const data = await movieModel.searchMovies(query);

    // Clear the previous search results
    resultsView.clearResults();

    if (data.length === 0) {
      //Load card with empty results
      return data.length;
    }

    // Render the new search results
    data.forEach((movie) => {
      resultsView.renderMovie(movie);
    });
    resultsView.handleLazyImages();

    // Add event listeners to the new movie cards
    resultsView.addHandlerMovieClick(controlMovie);

    movieModel.state.currentPage = 1;
    movieModel.state.totalPages = 0;
    // Update the UI with the current page and total pages
    resultsView.updateUI(
      movieModel.state.currentPage,
      movieModel.state.totalPages,
    );

    toastView.showToast(`${data.length} results found`, "success", "search");

    return data.length;
  } catch (err) {
    resultsView.clearResults();

    toastView.showToast(err.message, "error", "circle-alert");
  }
};

const controlClearSearch = async function () {
  renderPopularMovies();
};

const controlPagination = async function (direction) {
  if (direction === "next") {
    if (movieModel.state.currentPage < movieModel.state.totalPages) {
      movieModel.state.currentPage++;
    } else {
      return;
    }
  } else if (direction === "prev") {
    if (movieModel.state.currentPage > 1) {
      movieModel.state.currentPage--;
    } else {
      return;
    }
  }
  renderPopularMovies();
  //Smooth scroll to the top movie grid when the user clicks on the next or previous button
  resultsView.scrollToResults();
};

const renderPopularMovies = async function () {
  try {
    resultsView.renderSkeleton();
    const movies = await movieModel.getPopularMovies();

    // Clear the previous search results
    resultsView.clearResults();

    movies.forEach((movie) => {
      resultsView.renderMovie(movie);
    });

    resultsView.handleLazyImages();
    // Add event listeners to the new movie cards
    resultsView.addHandlerMovieClick(controlMovie);

    // Update the UI with the current page and total pages
    resultsView.updateUI(
      movieModel.state.currentPage,
      movieModel.state.totalPages,
    );
  } catch (err) {
    resultsView.clearResults();

    toastView.showToast(err.message, "error", "circle-alert");
  }
};

const renderLatest = async function () {
  const latestMovie = await movieModel.getLatest();
  resultsView.renderLatest(latestMovie);
  resultsView.handleLazyImages();
};

const controlFormChange = function () {
  // Add event listener to the search input field to change the form layout when focused or blurred
  resultsView.changeForm();
};

const controlSort = function (sortBy) {
  const movies = movieModel.sortMovies(sortBy);

  resultsView.clearResults();

  movies.forEach((movie) => {
    resultsView.renderMovie(movie);
  });

  resultsView.handleLazyImages();
  resultsView.addHandlerMovieClick(controlMovie);
};
