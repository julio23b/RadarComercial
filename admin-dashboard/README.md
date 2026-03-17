# Admin Dashboard

Panel administrativo creado con **Next.js + TypeScript + Tailwind (UI kit base)** y autenticación/roles con **Supabase Auth**.

## Funcionalidades

- Login con Supabase Auth.
- Autorización por rol `admin` usando `middleware` + tabla `profiles`.
- CRUD de comercios (crear, editar en modal, eliminar, actualización inline de estado).
- Tabla con filtros y paginación.
- Upload CSV para invocar lógica de importación (`/api/import-csv`).
- Vista básica de analíticas (`busquedas`, `vistas`, `favoritos`).
- Validaciones de formulario con `react-hook-form + zod`.

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Tablas mínimas en Supabase

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'editor'
);

create table if not exists comercios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  rubro text not null,
  ciudad text not null,
  estado text not null default 'activo',
  created_at timestamptz default now()
);

create table if not exists analiticas (
  id uuid primary key default gen_random_uuid(),
  comercio_id uuid not null references comercios(id),
  busquedas int not null default 0,
  vistas int not null default 0,
  favoritos int not null default 0,
  fecha date not null default current_date
);
```

## Ejecutar

```bash
npm install
npm run dev
```
