"use strict";

import * as movieModel from "../models/movieModel.js";
import * as details from "../views/details.js";
import * as themeView from "../views/themeView.js";
import * as toastView from "../views/toastView.js";

const controlMovieDetails = async function () {
  try {
    themeView.initTheme();

    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    movieModel.loadLocalStorage();

    if (!movieId) {
      window.location.href = "404.html";
      return;
    }

    details.renderSkeleton();

    const movie = await movieModel.fetchMovieDetails(movieId);

    details.renderMovieDetails(movie);
    details.renderRating(movie.rating);

    details.addHandlerMovieDetails(controlActions);
    details.addHandlerNotesInput();
    details.addHandlerSaveNote(controlSaveNote);
    details.addHandlerRating(controlRating);
    details.addHandlerClearRating(controlClearRating);
    details.addHandlerTrailer(controlTrailer);
  } catch (err) {
    console.error(err);

    toastView.showToast(
      err.message || "Something went wrong loading this movie.",
      "error",
      "circle-alert",
    );

    setTimeout(() => {
      window.location.href = "404.html";
    }, 1200);
  }
};

controlMovieDetails();

const controlActions = function (movieId, action) {
  switch (action) {
    case "favorite":
      const favorite = movieModel.addToFavorites(movieId);
      details.updateActions("favorite", favorite);
      toastView.showToast(
        favorite ? "Added to favorites" : "Removed from favorites",
        "success",
        favorite ? "heart" : "heart-off",
      );
      break;

    case "watchlist":
      const watchlist = movieModel.addToWatchlist(movieId);
      details.updateActions("watchlist", watchlist);
      toastView.showToast(
        watchlist ? "Added to watchlist" : "Removed from watchlist",
        "success",
        watchlist ? "bookmark-plus" : "bookmark-x",
      );
      break;
    case "watched":
      const watched = movieModel.addToWatched(movieId);
      details.updateActions("watched", watched);
      toastView.showToast(
        watched ? "Marked as watched" : "Removed from watched",
        "success",
        watched ? "badge-check" : "circle",
      );
      break;
  }
};

const controlSaveNote = function (movieId, note) {
  //ADD notes to Map

  movieModel.addNotes(movieId, note);
  toastView.showToast("Note saved", "success", "notebook-pen");
  details.renderSavedNote(note);
};

const controlRating = function (movieId, rating) {
  movieModel.addRating(movieId, rating);
  toastView.showToast(`Rated ${rating}/5`, "success", "star");
  details.renderRating(rating);
};

const controlClearRating = function (movieId) {
  const rating = movieModel.clearRating(movieId);
  toastView.showToast("Rating removed", "warning", "star-off");
  details.renderRating(rating);
};

const controlTrailer = async function (movieId) {
  const trailerUrl = await movieModel.getMovieTrailer(movieId);

  if (!trailerUrl) {
    toastView.showToast("Trailer not available", "warning", "video-off");
    return;
  }

  window.open(trailerUrl, "_blank");
};
