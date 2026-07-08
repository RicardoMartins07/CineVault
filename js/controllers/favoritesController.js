import * as movieModel from "../models/movieModel.js";
import * as favoritesView from "../views/favorites.js";
import * as themeView from "../views/themeView.js";
import * as toastView from "../views/toastView.js";

const controlMovieFavorites = async function () {
  try {
    themeView.initTheme();
    movieModel.loadLocalStorage();

    favoritesView.renderSkeleton();

    const movies = await movieModel.getFavoriteMovies();

    favoritesView.renderMovies(movies);
    favoritesView.renderStatistics(movies, movieModel.state.rating);
  } catch (err) {
    console.error(err);

    toastView.showToast(
      err.message || "Failed to load favorites.",
      "error",
      "circle-alert",
    );

    favoritesView.renderError(
      "Unable to load your favorites. Please try again later.",
    );
  }
};

controlMovieFavorites();
