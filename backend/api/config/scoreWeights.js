const DEFAULT_SCORE_WEIGHTS = {
  textualRelevance: Number(process.env.WEIGHT_TEXTUAL_RELEVANCE ?? 0.45),
  distance: Number(process.env.WEIGHT_DISTANCE ?? 0.25),
  popularity: Number(process.env.WEIGHT_POPULARITY ?? 0.2),
  favorites: Number(process.env.WEIGHT_FAVORITES ?? 0.1),
};

function normalizeWeights(weights = DEFAULT_SCORE_WEIGHTS) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return { ...DEFAULT_SCORE_WEIGHTS };
  }

  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value / total]),
  );
}

module.exports = {
  DEFAULT_SCORE_WEIGHTS,
  normalizeWeights,
};
