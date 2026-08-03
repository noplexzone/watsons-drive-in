import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const item of ['index.html', 'styles.css', 'script.js', 'data', '_headers', '_redirects']) {
  cpSync(resolve(root, item), resolve(dist, item), { recursive: true });
}

const tmdbKey = readEnvValue('TMDB_API_KEY', resolve(root, '.env'));
if (tmdbKey) {
  const moviesPath = resolve(dist, 'data/movies.json');
  const data = JSON.parse(readFileSync(moviesPath, 'utf8'));
  data.movies = await Promise.all((data.movies || []).map((movie) => hydrateMoviePoster(movie, tmdbKey)));
  writeFileSync(moviesPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log('Hydrated movie poster URLs from TMDB into dist/data/movies.json');
} else {
  console.log('TMDB_API_KEY not found; built with local placeholder poster art.');
}

console.log('Built static site into dist/');

function readEnvValue(name, filePath) {
  try {
    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const equals = line.indexOf('=');
      if (equals === -1) return line;
      const key = line.slice(0, equals).trim();
      const value = line.slice(equals + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key === name) return value;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return '';
}

async function hydrateMoviePoster(movie, tmdbKey) {
  if (!movie.tmdbId && !movie.tmdbQuery) return movie;
  try {
    const result = movie.tmdbId
      ? await tmdbFetch(`/movie/${encodeURIComponent(movie.tmdbId)}`, tmdbKey)
      : await searchMovie(movie, tmdbKey);
    if (!result) return movie;
    return {
      ...movie,
      tmdbId: result.id ?? movie.tmdbId,
      posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : movie.posterUrl,
      tmdbUrl: result.id ? `https://www.themoviedb.org/movie/${result.id}` : movie.tmdbUrl,
    };
  } catch (error) {
    console.warn(`TMDB poster lookup failed for ${movie.title}: ${error.message}`);
    return movie;
  }
}

async function searchMovie(movie, tmdbKey) {
  const params = new URLSearchParams({ query: movie.tmdbQuery || movie.title, include_adult: 'false' });
  if (movie.releaseYear) params.set('year', String(movie.releaseYear));
  const data = await tmdbFetch(`/search/movie?${params}`, tmdbKey);
  return Array.isArray(data.results) ? data.results.find((item) => item.poster_path) || data.results[0] : null;
}

async function tmdbFetch(path, tmdbKey) {
  const isBearerToken = tmdbKey.includes('.') || tmdbKey.length > 80;
  const separator = path.includes('?') ? '&' : '?';
  const url = isBearerToken
    ? `https://api.themoviedb.org/3${path}`
    : `https://api.themoviedb.org/3${path}${separator}api_key=${encodeURIComponent(tmdbKey)}`;
  const headers = isBearerToken ? { Authorization: `Bearer ${tmdbKey}`, accept: 'application/json' } : { accept: 'application/json' };
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
