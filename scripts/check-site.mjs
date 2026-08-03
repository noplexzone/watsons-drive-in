import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const requiredFiles = ['index.html', 'styles.css', 'script.js', 'data/movies.json', 'README.md', 'CHANGELOG.md'];
const requiredSections = ['hero', 'featured', 'showtimes', 'tickets', 'concessions', 'visit', 'events', 'sponsorship', 'employment', 'faq', 'location', 'contact'];
const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing required file: ${file}`);
}

const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'styles.css'), 'utf8');
const js = readFileSync(resolve(root, 'script.js'), 'utf8');
const movies = JSON.parse(readFileSync(resolve(root, 'data/movies.json'), 'utf8'));

for (const id of requiredSections) {
  if (!html.includes(`id="${id}"`)) failures.push(`Missing required section id: ${id}`);
}

for (const text of ['Watson’s Drive-In', 'Coming soon near Magnolia', 'Tickets Coming Soon', 'Mobile Ordering Coming Soon', 'uses TMDB and the TMDB APIs']) {
  if (!html.includes(text)) failures.push(`Missing required copy: ${text}`);
}

if (!Array.isArray(movies.movies) || movies.movies.length < 4) failures.push('Movie data must include at least four placeholder listings.');
if (!movies.movies.some((movie) => movie.title === 'Spider-Man: Brand New Day')) failures.push('Missing Spider-Man placeholder listing.');
if (!movies.movies.some((movie) => movie.title === 'The Odyssey')) failures.push('Missing The Odyssey placeholder listing.');
if (!movies.movies.some((movie) => movie.title === 'Back to the Future')) failures.push('Missing Back to the Future potential listing.');
if (!movies.movies.some((movie) => movie.title === 'Jaws')) failures.push('Missing Jaws potential listing.');
if (!movies.featured || !movies.movies.some((movie) => movie.id === movies.featured)) failures.push('Featured movie id must match a movie.');
if (!movies.movies.some((movie) => movie.tmdbQuery || movie.tmdbId)) failures.push('At least one movie should be configured for TMDB poster enrichment.');

if (/\bdusk\b/i.test(html) || movies.movies.some((movie) => /\bdusk\b/i.test(movie.time || ''))) {
  failures.push('Dusk references should be replaced with 7 PM for now.');
}
for (const movie of movies.movies) {
  if (/sample|placeholder|potential crowd-pleasing|premium preview card/i.test(movie.summary || '')) {
    failures.push(`Movie summary still looks placeholder-like: ${movie.title}`);
  }
}
if (!css.includes('border: 0') || !css.includes('object-fit: contain')) failures.push('Poster cards should remove borders and avoid cropped poster artwork.');

if (html.includes('SAU')) failures.push('SAU references should not appear while the venue copy is intentionally generic.');
for (const text of ['Pets are not allowed', 'Alcohol is not allowed', '$7', '$4', '$5', '$12']) {
  if (!html.includes(text)) failures.push(`Missing required updated operations copy: ${text}`);
}

const forbidden = [/sk-[A-Za-z0-9]/, /api[_-]?key\s*[:=]/i, /password\s*[:=]/i, /BEGIN (RSA|OPENSSH|PRIVATE) KEY/];
for (const [name, content] of [['index.html', html], ['styles.css', css], ['script.js', js]]) {
  for (const pattern of forbidden) {
    if (pattern.test(content)) failures.push(`Possible secret pattern in ${name}: ${pattern}`);
  }
}

if (!html.includes('aria-label="Primary navigation"')) failures.push('Primary navigation needs an accessible label.');
if (!css.includes('@media')) failures.push('Responsive media queries are required.');
if (!js.includes('fetch(')) failures.push('Movie listings should be loaded from static JSON.');
if (!js.includes('posterUrl')) failures.push('Movie cards should support TMDB poster URLs.');

if (failures.length) {
  console.error('Site check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site check passed: ${requiredFiles.length} files, ${requiredSections.length} sections, ${movies.movies.length} movie listings.`);
