const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
const movieGrid = document.querySelector('#movie-grid');
const featuredMovie = document.querySelector('#featured-movie');

document.querySelector('#year').textContent = new Date().getFullYear();

navToggle?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    primaryNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

function movieCard(movie, featured = false) {
  const article = document.createElement('article');
  article.className = featured ? 'movie-card featured-card' : 'movie-card';
  const posterContent = movie.posterUrl
    ? `<img src="${escapeAttribute(movie.posterUrl)}" alt="${escapeHtml(movie.title)} poster" loading="lazy" decoding="async">`
    : '';
  const posterLabel = movie.posterUrl ? `Poster for ${movie.title}` : `Stylized placeholder poster for ${movie.title}`;
  const posterTitle = movie.posterUrl ? '' : `data-title="${escapeHtml(movie.title)}"`;
  article.innerHTML = `
    <div class="poster ${movie.posterStyle}${movie.posterUrl ? ' poster-real' : ''}" ${posterTitle} role="img" aria-label="${escapeHtml(posterLabel)}">${posterContent}</div>
    <div class="movie-body">
      <div class="movie-meta">
        <span class="badge">${escapeHtml(movie.category)}</span>
        <span class="badge">${escapeHtml(movie.rating)}</span>
        <span class="badge">${escapeHtml(movie.runtime)}</span>
      </div>
      <h3>${escapeHtml(movie.title)}</h3>
      <p><strong>${escapeHtml(movie.date)} · ${escapeHtml(movie.time)}</strong></p>
      <p>${escapeHtml(movie.summary)}</p>
      <div class="movie-actions">
        <a class="button button-primary" href="#tickets">Tickets Coming Soon</a>
        <a class="button button-ghost" href="${escapeAttribute(movie.tmdbUrl || movie.trailerUrl)}">Trailer / Details</a>
      </div>
    </div>
  `;
  return article;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function escapeAttribute(value) {
  const text = String(value || '#');
  return text.startsWith('#') || text.startsWith('https://') ? escapeHtml(text) : '#';
}

async function loadMovies() {
  try {
    const response = await fetch('data/movies.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Movie data request failed: ${response.status}`);
    const data = await response.json();
    const movies = Array.isArray(data.movies) ? data.movies : [];
    movieGrid.replaceChildren(...movies.map((movie) => movieCard(movie)));
    const featured = movies.find((movie) => movie.id === data.featured) ?? movies[0];
    if (featured) featuredMovie.replaceChildren(movieCard(featured, true));
  } catch (error) {
    console.error(error);
    movieGrid.innerHTML = '<p class="loading-card">Movie listings are temporarily unavailable.</p>';
    featuredMovie.textContent = 'Feature preview temporarily unavailable.';
  }
}

loadMovies();
