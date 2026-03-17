"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Comercio } from "@/types";

const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  rubro: z.string().min(2, "Rubro requerido"),
  ciudad: z.string().min(2, "Ciudad requerida"),
  estado: z.enum(["activo", "inactivo"]),
});

type FormValues = z.infer<typeof schema>;

export function ComercioForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: Comercio;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      nombre: "",
      rubro: "",
      ciudad: "",
      estado: "activo",
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="Nombre" {...register("nombre")} />
      {errors.nombre ? <p className="text-xs text-red-600">{errors.nombre.message}</p> : null}
      <Input placeholder="Rubro" {...register("rubro")} />
      {errors.rubro ? <p className="text-xs text-red-600">{errors.rubro.message}</p> : null}
      <Input placeholder="Ciudad" {...register("ciudad")} />
      {errors.ciudad ? <p className="text-xs text-red-600">{errors.ciudad.message}</p> : null}
      <select className="h-10 w-full rounded-md border border-slate-300 px-3" {...register("estado")}>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  );
}
