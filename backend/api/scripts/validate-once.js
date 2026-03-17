const fs = require('fs');
const path = require('path');
const { rerankSearchResults } = require('../services/rerankSearchResults');

function precisionAtK(items, k = 3) {
  const top = items.slice(0, k);
  const relevant = top.filter((x) => x.relevant === 1).length;
  return top.length ? relevant / top.length : 0;
}

function evaluate(dataset, weights) {
  const perQuery = dataset.queries.map((sample) => {
    const reranked = rerankSearchResults(sample.hits, {
      query: sample.query,
      topN: sample.hits.length,
      weights,
    });

    return {
      query: sample.query,
      pAt1: precisionAtK(reranked, 1),
      pAt3: precisionAtK(reranked, 3),
      topCommerceIds: reranked.slice(0, 3).map((x) => x.commerceId),
    };
  });

  const averagePAt1 = perQuery.reduce((sum, item) => sum + item.pAt1, 0) / perQuery.length;
  const averagePAt3 = perQuery.reduce((sum, item) => sum + item.pAt3, 0) / perQuery.length;
  return { averagePAt1, averagePAt3, perQuery };
}

function main() {
  const datasetPath = path.join(__dirname, '..', 'data', 'once-validation.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  const baseline = evaluate(dataset, {
    textualRelevance: 0.1,
    distance: 0.65,
    popularity: 0.2,
    favorites: 0.05,
  });

  const tuned = evaluate(dataset, {
    textualRelevance: 0.65,
    distance: 0.15,
    popularity: 0.1,
    favorites: 0.1,
  });

  console.log('Baseline avg P@1:', baseline.averagePAt1.toFixed(3));
  console.log('Baseline avg P@3:', baseline.averagePAt3.toFixed(3));
  console.log('Tuned avg P@1:', tuned.averagePAt1.toFixed(3));
  console.log('Tuned avg P@3:', tuned.averagePAt3.toFixed(3));
  console.log('Per-query tuned ranking:', JSON.stringify(tuned.perQuery, null, 2));
}

main();
