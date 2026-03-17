const http = require('http');
const { rerankSearchResults } = require('./services/rerankSearchResults');
const { insertInteractionEvent } = require('./services/interactionSignalsStore');

const PORT = Number(process.env.PORT ?? 4000);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/search/rerank') {
    try {
      const body = await parseRequestBody(req);
      const ranked = rerankSearchResults(body.hits ?? [], {
        query: body.query,
        topN: body.topN,
        weights: body.weights,
      });

      return sendJson(res, 200, {
        query: body.query,
        count: ranked.length,
        hits: ranked,
      });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (req.method === 'POST' && req.url === '/api/search/events') {
    try {
      const body = await parseRequestBody(req);
      const [inserted] = await insertInteractionEvent({
        user_id: body.userId,
        event_type: body.eventType,
        commerce_id: body.commerceId,
        query_text: body.query,
        payload: body.payload ?? {},
      });
      return sendJson(res, 201, { event: inserted });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 404, { error: 'Not found' });
});

if (require.main === module) {
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Search API listening on port ${PORT}`);
  });
}

module.exports = {
  server,
};
