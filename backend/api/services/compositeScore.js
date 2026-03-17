const { normalizeWeights } = require('../config/scoreWeights');

const MAX_DISTANCE_KM = Number(process.env.MAX_DISTANCE_KM ?? 8);

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function tokenize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardOverlap(query, text) {
  const q = new Set(tokenize(query));
  const t = new Set(tokenize(text));
  if (q.size === 0 || t.size === 0) return 0;
  const intersection = [...q].filter((x) => t.has(x)).length;
  const union = new Set([...q, ...t]).size;
  return intersection / union;
}

function scoreTextualRelevance(hit, query) {
  const algoliaScore = hit.algoliaRelevanceScore ?? (hit.rank != null ? 1 / (hit.rank + 1) : 0.5);
  const titleOverlap = jaccardOverlap(query, hit.name);
  const categoryOverlap = jaccardOverlap(query, hit.category);
  return clamp(algoliaScore * 0.45 + titleOverlap * 0.35 + categoryOverlap * 0.2);
}

function scoreDistance(distanceKm) {
  if (distanceKm == null) return 0.5;
  return clamp(1 - distanceKm / MAX_DISTANCE_KM);
}

function scorePopularity(hit) {
  const clicks = Number(hit.clicks ?? 0);
  const views = Number(hit.views ?? 0);
  const ctr = views > 0 ? clicks / views : 0;
  const volume = clamp(Math.log10(views + 1) / 4);
  return clamp(ctr * 0.6 + volume * 0.4);
}

function scoreFavorites(hit) {
  return clamp(Math.log10(Number(hit.favorites ?? 0) + 1) / 3);
}

function computeCompositeScore(hit, context = {}) {
  const weights = normalizeWeights(context.weights);
  const components = {
    textualRelevance: scoreTextualRelevance(hit, context.query),
    distance: scoreDistance(hit.distanceKm),
    popularity: scorePopularity(hit),
    favorites: scoreFavorites(hit),
  };

  const score = Object.entries(weights).reduce(
    (sum, [name, weight]) => sum + components[name] * weight,
    0,
  );

  return {
    ...hit,
    scoreComponents: components,
    compositeScore: Number(score.toFixed(6)),
  };
}

module.exports = {
  computeCompositeScore,
};
