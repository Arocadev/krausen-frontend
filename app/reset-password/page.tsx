"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!token) setError("Token inválido o expirado.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (passwordNueva !== passwordConfirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (passwordNueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setCargando(true);
    try {
      await api.post("/api/auth/reset-password", {
        token,
        password_nueva: passwordNueva,
      });
      setExito(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Token inválido o expirado.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-linea bg-white p-8">
        <h1 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
          Nueva contraseña
        </h1>

        {exito ? (
          <div className="mt-4 rounded-md bg-ambar/10 px-4 py-4 text-sm text-tostado">
            Contraseña actualizada correctamente. Redirigiendo al login…
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-tostado">
              Introduce tu nueva contraseña.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-malta">Nueva contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  className="w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-malta">Confirmar contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  className="w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar"
                  placeholder="Repite la contraseña"
                />
              </div>
              {error && (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
              )}
              <button
                type="submit"
                disabled={cargando || !token}
                className="rounded-md bg-ambar px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
              >
                {cargando ? "Guardando…" : "Guardar contraseña"}
              </button>
            </form>
          </>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-tostado">Cargando…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}