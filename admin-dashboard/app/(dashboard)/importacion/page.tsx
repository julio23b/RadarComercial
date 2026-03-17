"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ImportacionPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const csvContent = await file.text();
    const response = await fetch("/api/import-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvContent }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(`Error: ${data.error}`);
      return;
    }
    setMessage(`Importación completada. Registros creados: ${data.inserted}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Upload CSV</h2>
      <Card className="space-y-4 p-4">
        <p className="text-sm text-slate-600">Formato esperado: nombre, rubro, ciudad, estado.</p>
        <input type="file" accept=".csv" onChange={handleFile} />
        <Button variant="outline" onClick={() => setMessage("Sube un archivo para importar")}>Validar flujo</Button>
        {message ? <p className="text-sm">{message}</p> : null}
      </Card>
    </div>
  );
}
