import * as movieModel from "../models/movieModel.js";
import * as watchlist from "../views/watchlist.js";
import * as themeView from "../views/themeView.js";
import * as toastView from "../views/toastView.js";

const controlMovieWatchs = async function () {
  themeView.initTheme();
  movieModel.loadLocalStorage();

  //watchlist.renderSkeleton();

  const [watchedResult, watchlistResult] = await Promise.allSettled([
    movieModel.getWatched(),
    movieModel.getWatchList(),
  ]);

  if (watchedResult.status === "fulfilled") {
    watchlist.renderMoviesWatched(watchedResult.value);
  } else {
    console.error(watchedResult.reason);

    watchlist.renderWatchedError();
  }

  if (watchlistResult.status === "fulfilled") {
    watchlist.renderTotalsWatchList(watchlistResult.value);
  } else {
    console.error(watchlistResult.reason);

    watchlist.renderWatchlistError();
  }

  if (
    watchedResult.status === "rejected" ||
    watchlistResult.status === "rejected"
  ) {
    toastView.showToast(
      "Some data couldn't be loaded.",
      "warning",
      "triangle-alert",
    );
  }
};

controlMovieWatchs();
