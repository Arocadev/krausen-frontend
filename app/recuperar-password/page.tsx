"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post("/api/auth/solicitar-recuperacion", { email });
      setEnviado(true);
    } catch {
      setEnviado(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-linea bg-white p-8">
        <h1 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
          Recuperar contraseña
        </h1>

        {!enviado ? (
          <>
            <p className="mt-2 text-sm text-tostado">
              Introduce tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-malta">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar"
                  placeholder="tu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="rounded-md bg-ambar px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
              >
                {cargando ? "Enviando…" : "Enviar instrucciones"}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-4 rounded-md bg-ambar/10 px-4 py-4 text-sm text-tostado">
            Si el email está registrado, recibirás un correo con instrucciones en breve.
          </div>
        )}

        <p className="mt-6 text-center text-sm text-tostado">
          <Link href="/login" className="font-medium text-ambar-oscuro hover:underline">
            Volver al login
          </Link>
        </p>
      </div>
    </main>
  );
}