"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";
import { Analitica } from "@/types";

export default function AnaliticasPage() {
  const [rows, setRows] = useState<Analitica[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await createClient().from("analiticas").select("*");
      setRows((data as Analitica[]) || []);
    };
    load();
  }, []);

  const resumen = useMemo(() => {
    const total = rows.reduce(
      (acc, item) => {
        acc.busquedas += item.busquedas;
        acc.vistas += item.vistas;
        acc.favoritos += item.favoritos;
        return acc;
      },
      { busquedas: 0, vistas: 0, favoritos: 0 }
    );

    const filtered = rows.filter((item) => item.comercio_id.toLowerCase().includes(query.toLowerCase()));
    return { ...total, filtered };
  }, [rows, query]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analíticas básicas</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4"><p className="text-sm text-slate-500">Búsquedas</p><p className="text-2xl font-semibold">{resumen.busquedas}</p></Card>
        <Card className="p-4"><p className="text-sm text-slate-500">Vistas</p><p className="text-2xl font-semibold">{resumen.vistas}</p></Card>
        <Card className="p-4"><p className="text-sm text-slate-500">Favoritos</p><p className="text-2xl font-semibold">{resumen.favoritos}</p></Card>
      </div>

      <Card className="space-y-3 p-4">
        <Input
          placeholder="Filtrar por ID de comercio"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-2">Comercio</th>
              <th className="p-2">Búsquedas</th>
              <th className="p-2">Vistas</th>
              <th className="p-2">Favoritos</th>
            </tr>
          </thead>
          <tbody>
            {resumen.filtered.map((item) => (
              <tr className="border-t" key={item.id}>
                <td className="p-2">{item.comercio_id}</td>
                <td className="p-2">{item.busquedas}</td>
                <td className="p-2">{item.vistas}</td>
                <td className="p-2">{item.favoritos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
