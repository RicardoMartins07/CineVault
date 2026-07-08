"use strict";

import { fetchJson } from "../utils/utils.js";
export const state = {
  popularMovies: [],
  searchResults: [],
  genres: [],
  details: {},
  favoritesID: [],
  notes: new Map(),
  rating: new Map(),
  currentMovies: [],

  watchlistID: [],

  watchedID: [],
  currentPage: 1,
  totalPages: 1,
  theme: "dark",
  mode: "popular", // "popular" or "search"
};

const getGenreName = function (id) {
  return state.genres.find((genre) => genre.id === id)?.name || "Unknown";
};

export const getGenres = async function () {
  const data = await fetchJson("genre/movie/list?language=en-US");

  state.genres = data.genres;
};

export const getPopularMovies = async function () {
  const data = await fetchJson(
    `movie/popular?language=en-US&page=${state.currentPage}`,
  );

  state.popularMovies = data.results.map((movie) => ({
    ...movie,
    genre: getGenreName(movie.genre_ids[0]),
    favorite: state.favoritesID.includes(movie.id),
    watchlist: state.watchlistID.includes(movie.id),
    watched: state.watchedID.includes(movie.id),
    notes: state.notes.get(movie.id),
    rating: state.rating.get(movie.id),
  }));

  state.page = data.page;
  state.totalPages = data.total_pages;

  state.currentMovies = state.popularMovies;
  state.mode = "popular";

  return state.popularMovies;
};

export const getMovie = async function (id) {
  const data = await fetchJson(`movie/${id}?language=en-US`);
  return data;
};

export const getLatest = async function () {
  const data = await fetchJson(`movie/upcoming`);

  return data.results[1];
};

//Handle favorites, watchlist, and watched movies
export const addToFavorites = function (movieId) {
  movieId = Number(movieId);
  if (state.favoritesID.includes(movieId)) {
    state.favoritesID = state.favoritesID.filter((id) => id !== movieId);
    saveLocalStorage();
    return false;
  } else {
    state.favoritesID.push(movieId);
    saveLocalStorage();
    return true;
  }
};

export const addToWatchlist = function (movieId) {
  movieId = Number(movieId);
  if (state.watchlistID.includes(movieId)) {
    state.watchlistID = state.watchlistID.filter((id) => id !== movieId);
    saveLocalStorage();
    return false;
  } else {
    state.watchlistID.push(movieId);
    saveLocalStorage();
    return true;
  }
};

export const addToWatched = function (movieId) {
  movieId = Number(movieId);
  if (state.watchedID.includes(movieId)) {
    state.watchedID = state.watchedID.filter((id) => id !== movieId);
    saveLocalStorage();
    return false;
  } else {
    state.watchedID.push(movieId);
    saveLocalStorage();
    return true;
  }
};

export const searchMovies = async function (query) {
  const data = await fetchJson(
    `search/movie?query=${query}&language=en-US&page=1&include_adult=false`,
  );

  state.searchResults = data.results.map((movie) => ({
    ...movie,
    genre: getGenreName(movie.genre_ids[0]),
    favorite: state.favoritesID.includes(movie.id),
    watchlist: state.watchlistID.includes(movie.id),
    watched: state.watchedID.includes(movie.id),
    notes: state.notes.get(movie.id),
    rating: state.rating.get(movie.id),
  }));

  state.currentMovies = state.searchResults;
  state.mode = "search";
  return state.searchResults;
};

const saveLocalStorage = function () {
  localStorage.setItem("favorites", JSON.stringify(state.favoritesID));
  localStorage.setItem("watchlist", JSON.stringify(state.watchlistID));
  localStorage.setItem("watched", JSON.stringify(state.watchedID));
  localStorage.setItem("notes", JSON.stringify([...state.notes]));
  localStorage.setItem("rating", JSON.stringify([...state.rating]));
  localStorage.setItem("theme", state.theme);
};

export const loadLocalStorage = function () {
  state.favoritesID =
    JSON.parse(localStorage.getItem("favorites"))?.map(Number) || [];
  state.watchlistID =
    JSON.parse(localStorage.getItem("watchlist"))?.map(Number) || [];
  state.watchedID =
    JSON.parse(localStorage.getItem("watched"))?.map(Number) || [];
  state.notes = new Map(JSON.parse(localStorage.getItem("notes")) || []);
  state.rating = new Map(JSON.parse(localStorage.getItem("rating")) || []);
  state.theme = localStorage.getItem("theme") || "dark";
};

export const resetState = function () {
  state.favoritesID = [];
  state.watchlistID = [];
  state.watchedID = [];
  saveLocalStorage();
};

//Movie Details

export const fetchMovieDetails = async function (id) {
  const [details, credits] = await Promise.all([
    fetchJson(`movie/${id}?language=en-US`),
    fetchJson(`movie/${id}/credits?language=en-US`),
  ]);

  const director =
    credits.crew.find((person) => person.job === "Director")?.name || "N/A";

  const cast = credits.cast.slice(0, 5).map((actor) => actor.name);

  details.director = director;
  details.cast = cast;
  details.favorite = state.favoritesID.includes(details.id);
  details.watchlist = state.watchlistID.includes(details.id);
  details.watched = state.watchedID.includes(details.id);
  details.notes = state.notes.get(details.id) || "";
  details.rating = state.rating.get(details.id) || 0;

  return details;
};

//Notes

export const addNotes = function (movieId, note) {
  movieId = Number(movieId);

  state.notes.set(movieId, note);

  saveLocalStorage();
};

//Rating
export const addRating = function (movieID, rating) {
  movieID = Number(movieID);
  state.rating.set(movieID, rating);
  saveLocalStorage();
};

export const clearRating = function (movieId) {
  movieId = Number(movieId);

  state.rating.delete(movieId);
  saveLocalStorage();

  return 0;
};

//FAVORITES
export const getFavoriteMovies = async function () {
  const movies = await Promise.all(
    state.favoritesID.map((id) => fetchMovieDetails(id)),
  );

  return movies;
};

//Watched and WatchList
export const getWatchList = async function () {
  const movies = await Promise.all(
    state.watchlistID.map((id) => fetchMovieDetails(id)),
  );

  return movies;
};

export const getWatched = async function () {
  const movies = await Promise.all(
    state.watchedID.map((id) => fetchMovieDetails(id)),
  );

  return movies;
};

export const sortMovies = function (sortBy) {
  switch (sortBy) {
    case "newest":
      state.currentMovies.sort(
        (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0),
      );
      break;

    case "oldest":
      state.currentMovies.sort(
        (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0),
      );
      break;

    case "title-asc":
      state.currentMovies.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "title-desc":
      state.currentMovies.sort((a, b) => b.title.localeCompare(a.title));
      break;

    case "rating":
      state.currentMovies.sort((a, b) => b.vote_average - a.vote_average);
      break;
      break;
    case "relevance":
    default:
      if (state.mode === "popular")
        state.currentMovies = [...state.popularMovies];
      if (state.mode === "search")
        state.currentMovies = [...state.searchResults];
      break;
  }

  return state.currentMovies;
};

//Trailer
export const getMovieTrailer = async function (id) {
  const data = await fetchJson(`movie/${id}/videos?language=en-US`);

  const trailer = data.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};
