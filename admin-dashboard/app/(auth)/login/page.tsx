"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/comercios");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form className="w-full max-w-md space-y-3 rounded-lg border bg-white p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <Input type="email" placeholder="admin@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button className="w-full" type="submit">Entrar</Button>
      </form>
    </div>
  );
}
