# Arquitectura del proyecto Radar Comercial

## 1) Límites entre aplicaciones

### `mobile-app/`
Aplicación React Native (cliente final). Contiene UI, navegación y experiencia de compra:
- `src/screens/`: pantallas principales.
- `src/components/`: componentes visuales reutilizables.
- `src/search/`: componentes y lógica de búsqueda.
- `src/maps/`: componentes/servicios de mapas para funcionalidades geográficas.
- `src/hooks/`: hooks de dominio y wrappers para estado compartido.
- `src/services/`: capa de acceso a datos y servicios de dominio del cliente.

### `admin-dashboard/`
Aplicación web de administración en Next.js + TypeScript.
Responsabilidades:
- gestión de productos y categorías;
- moderación de contenido;
- disparo/monitoreo de indexación.

### `backend/`
Integraciones y utilidades server-side:
- `backend/supabase/`: persistencia y consultas de datos.
- `backend/algolia/`: indexación y sincronización de búsqueda.
- `backend/api/`: API interna/externa y composición de servicios.

### `scripts/`
Automatizaciones operativas (deploy, seed, backfill, jobs de mantenimiento).

## 2) Contratos de datos (alto nivel)

## Producto
```ts
interface Product {
  id: number | string;
  name: string;
  description: string;
  category: string;
  price: number | string;
  image: string;
  sizes?: string[];
  colors?: { name: string; value: string; image?: string }[];
  material?: string;
}
```

### Contratos por frontera
- **Mobile ↔ API**: consume productos normalizados (campos estables y tipados).
- **Admin ↔ API**: crea/edita entidades con validación de esquema.
- **API ↔ Supabase**: modelo persistido + metadatos de auditoría.
- **API/Jobs ↔ Algolia**: registros denormalizados optimizados para búsqueda.

## 3) Flujo de indexación (Supabase → Algolia)

1. **Cambio en datos**: alta/edición/baja de producto desde Admin o procesos batch.
2. **Persistencia**: API valida y escribe en Supabase.
3. **Evento de sincronización**: trigger o job encola IDs afectados.
4. **Transformación**: capa `backend/algolia/` mapea el producto al formato de índice.
5. **Upsert/Delete en Algolia**: actualización incremental del índice.
6. **Observabilidad**: logs + métricas para errores, latencia y volumen.
7. **Consumo**: Mobile/Admin consultan búsqueda vía API o directamente (según política).

## 4) Reglas de evolución

- Evitar acoplar UI con drivers de infraestructura.
- Centralizar validaciones y mapeos en `backend/api/`.
- Versionar contratos críticos para compatibilidad hacia atrás.
- Mantener indexación idempotente y reejecutable.
