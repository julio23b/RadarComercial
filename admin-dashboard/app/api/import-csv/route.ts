import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const csvContent = body.csvContent as string;

  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    return NextResponse.json({ error: parsed.errors[0].message }, { status: 400 });
  }

  const rows = parsed.data.map((item: any) => ({
    nombre: item.nombre,
    rubro: item.rubro,
    ciudad: item.ciudad,
    estado: item.estado || "activo",
  }));

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("comercios").insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ inserted: rows.length });
}
