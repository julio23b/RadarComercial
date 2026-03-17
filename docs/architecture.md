# Arquitectura de sincronización de comercios

## Flujo CSV -> Supabase -> Algolia

1. `scripts/import_csv.js` lee un CSV local.
2. Cada fila se transforma a la estructura de `commerces` en Supabase.
3. Se calcula `search_index` con texto normalizado a partir de `name`, `category`, `address`, `city`, `state` y `products`.
4. El script hace `upsert` por `id` en la tabla `commerces` usando la API REST de Supabase.
5. `scripts/sync_algolia.js` lee los comercios desde Supabase y construye objetos aptos para Algolia.
6. Se envía un batch a Algolia con `{ objectID, name, category, address, search_index, _geoloc }`.

## Validaciones y normalización

Ambos scripts incluyen:

- Validación de coordenadas (`lat` entre `-90` y `90`, `lng` entre `-180` y `180`).
- Normalización de texto (minúsculas, sin acentos, sin caracteres especiales extra).
- Logs de errores por fila/registro inválido sin interrumpir toda la ejecución.

## Variables de entorno

Definir antes de ejecutar:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recomendado) o `SUPABASE_ANON_KEY`
- `ALGOLIA_APP_ID` (solo para sync Algolia)
- `ALGOLIA_ADMIN_API_KEY` (solo para sync Algolia)
- `ALGOLIA_INDEX_NAME` (opcional, por defecto `commerces`)

## Scripts npm

```bash
npm run import:csv -- ./ruta/comercios.csv
npm run sync:algolia
```

### Notas de formato CSV

Columnas recomendadas:

- `id` (opcional)
- `name`
- `category`
- `address`
- `city`
- `state`
- `products` (separado por `,`, `;` o `|`)
- `lat` o `latitude`
- `lng` o `longitude`

Si `id` no existe, el importador genera uno hash a partir de `name|address|city` para permitir upsert idempotente.
