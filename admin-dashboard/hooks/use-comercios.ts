"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Comercio } from "@/types";

const PAGE_SIZE = 8;

export function useComercios() {
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const { data } = await createClient().from("comercios").select("*").order("created_at", { ascending: false });
    setComercios((data as Comercio[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return comercios.filter(
      (item) =>
        item.nombre.toLowerCase().includes(normalized) ||
        item.rubro.toLowerCase().includes(normalized) ||
        item.ciudad.toLowerCase().includes(normalized)
    );
  }, [comercios, query]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return {
    comercios,
    filtered,
    paginated,
    query,
    setQuery,
    page,
    setPage,
    totalPages: Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1),
    loadData,
    loading,
  };
}
