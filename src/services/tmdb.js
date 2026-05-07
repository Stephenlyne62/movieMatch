
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(path) {
  // Decide whether to use ? or &
  const separator = path.includes("?") ? "&" : "?";

  // Ensure path starts with a slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const url = `${BASE_URL}${cleanPath}${separator}api_key=${API_KEY}`;

  const res = await fetch(url);
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      data?.status_message ||
      data?.message ||
      `TMDB request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// --- Existing endpoints ---

export async function getPopularMovies() {
  const data = await tmdbFetch("/movie/popular?language=en-GB&page=1");
  return data.results || [];
}

export async function getMovieDetails(id) {
  if (!id) throw new Error("getMovieDetails: missing id");

  // Append credits so we get cast + crew in the same request
  return tmdbFetch(`/movie/${id}?language=en-GB&append_to_response=credits`);
}

export async function searchMovies(query) {
  const q = encodeURIComponent(query || "");
  const data = await tmdbFetch(
    `/search/movie?language=en-GB&query=${q}&page=1&include_adult=false`
  );
  return data.results || [];
}

export async function getGenres() {
  const data = await tmdbFetch("/genre/movie/list?language=en-GB");
  return data.genres || [];
}

export async function discoverMovies(params = {}) {
  const qs = new URLSearchParams({
    language: "en-GB",
    sort_by: "popularity.desc",
    include_adult: "false",
    include_video: "false",
    page: "1",
    ...params,
  });

  const data = await tmdbFetch(`/discover/movie?${qs.toString()}`);
  return data.results || [];
}

export async function getMovieVideos(id) {
  const data = await tmdbFetch(`/movie/${id}/videos?language=en-US`);
  return data.results || [];
}

export async function getTrendingMovie() {
  const data = await tmdbFetch("/trending/movie/week");
  return data.results?.[0] || null;
}