"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ComercioForm } from "@/components/comercio-form";
import { useComercios } from "@/hooks/use-comercios";
import { Comercio } from "@/types";

export default function ComerciosPage() {
  const { paginated, query, setQuery, page, setPage, totalPages, loadData, loading } = useComercios();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Comercio | null>(null);

  const handleSave = async (values: Omit<Comercio, "id">) => {
    const supabase = createClient();
    if (editing) {
      await supabase.from("comercios").update(values).eq("id", editing.id);
    } else {
      await supabase.from("comercios").insert(values);
    }
    setOpen(false);
    setEditing(null);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await createClient().from("comercios").delete().eq("id", id);
    await loadData();
  };

  const updateStatusInline = async (id: string, estado: string) => {
    await createClient().from("comercios").update({ estado }).eq("id", id);
    await loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">CRUD de comercios</h2>
        <Button onClick={() => setOpen(true)}>Nuevo comercio</Button>
      </div>

      <Card className="p-4">
        <Input placeholder="Filtrar por nombre, rubro o ciudad..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Rubro</th>
              <th className="p-3">Ciudad</th>
              <th className="p-3">Estado (inline)</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={5}>Cargando...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>Sin resultados</td></tr>
            ) : (
              paginated.map((comercio) => (
                <tr key={comercio.id} className="border-t">
                  <td className="p-3">{comercio.nombre}</td>
                  <td className="p-3">{comercio.rubro}</td>
                  <td className="p-3">{comercio.ciudad}</td>
                  <td className="p-3">
                    <select
                      className="rounded-md border p-2"
                      value={comercio.estado}
                      onChange={(e) => updateStatusInline(comercio.id, e.target.value)}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td className="space-x-2 p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(comercio);
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(comercio.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setPage(Math.max(page - 1, 1))}>Anterior</Button>
        <span className="text-sm">Página {page} de {totalPages}</span>
        <Button variant="outline" onClick={() => setPage(Math.min(page + 1, totalPages))}>Siguiente</Button>
      </div>

      <Dialog open={open} onOpenChange={(next) => {
        setOpen(next);
        if (!next) setEditing(null);
      }}>
        <DialogContent>
          <h3 className="mb-4 text-lg font-semibold">{editing ? "Editar comercio" : "Nuevo comercio"}</h3>
          <ComercioForm initialValues={editing || undefined} onSubmit={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
