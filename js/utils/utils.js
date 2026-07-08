import { ACCESS_TOKEN, BASE_URL } from "../config.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const fetchJson = async function (endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, options);

    if (!res.ok) {
      if (res.status === 401) throw new Error("Invalid API key.");
      if (res.status === 404) throw new Error("Movie not found.");
      if (res.status === 429)
        throw new Error("Too many requests. Try again later.");

      throw new Error("Something went wrong while fetching data.");
    }

    return await res.json();
  } catch (err) {
    if (!navigator.onLine) {
      throw new Error("You appear to be offline.");
    }

    throw err;
  }
};
