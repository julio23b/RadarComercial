export type Rol = "admin" | "editor";

export type Comercio = {
  id: string;
  nombre: string;
  rubro: string;
  ciudad: string;
  estado: "activo" | "inactivo";
  created_at?: string;
};

export type Analitica = {
  id: string;
  comercio_id: string;
  busquedas: number;
  vistas: number;
  favoritos: number;
  fecha: string;
};
