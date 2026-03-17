# Search reranking API (`backend/api`)

Implementa un score compuesto configurable para rerankear resultados de Algolia con señales locales del usuario.

## Factores del score

- **textualRelevance**: score de Algolia + overlap de tokens (query vs nombre/categoría).
- **distance**: penalización lineal por distancia en km (`MAX_DISTANCE_KM`).
- **popularity**: mezcla de CTR (`clicks/views`) y volumen de vistas.
- **favorites**: log normalizado de favoritos.

Pesos configurables por variables de entorno:

- `WEIGHT_TEXTUAL_RELEVANCE`
- `WEIGHT_DISTANCE`
- `WEIGHT_POPULARITY`
- `WEIGHT_FAVORITES`

También se pueden pasar por request en `weights`.

## Endpoints

### `POST /api/search/rerank`

Body de ejemplo:

```json
{
  "query": "zapatillas deportivas once",
  "topN": 40,
  "weights": {
    "textualRelevance": 0.5,
    "distance": 0.2,
    "popularity": 0.2,
    "favorites": 0.1
  },
  "hits": [
    {
      "commerceId": "c1",
      "name": "Deportes Once",
      "category": "zapatillas deportivas",
      "distanceKm": 0.4,
      "algoliaRelevanceScore": 0.92,
      "views": 900,
      "clicks": 180,
      "favorites": 70
    }
  ]
}
```

### `POST /api/search/events`

Registra señales de interacción para persistencia en Supabase:

```json
{
  "userId": "uuid",
  "eventType": "click",
  "commerceId": "c1",
  "query": "zapatillas deportivas once",
  "payload": {
    "position": 2
  }
}
```

Requiere:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase

En `supabase/schema.sql` se define:

- `search_interaction_events` (evento granular)
- `search_interaction_daily_agg` (agregado diario)
- función `refresh_search_interaction_daily_agg(target_day)`

## Validación dataset Once

Dataset sintético en `data/once-validation.json` + script:

```bash
npm run api:validate-once
```

Compara baseline vs pesos ajustados y reporta `Precision@3` para reducir irrelevantes entre comercios similares.
