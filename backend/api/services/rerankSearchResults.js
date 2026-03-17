const { computeCompositeScore } = require('./compositeScore');

function rerankSearchResults(hits = [], options = {}) {
  const topN = Number(options.topN ?? 50);
  const head = hits.slice(0, topN).map((hit, index) => ({ ...hit, rank: hit.rank ?? index }));
  const tail = hits.slice(topN);

  const reranked = head
    .map((hit) => computeCompositeScore(hit, options))
    .sort((a, b) => b.compositeScore - a.compositeScore);

  return [...reranked, ...tail];
}

module.exports = {
  rerankSearchResults,
};
