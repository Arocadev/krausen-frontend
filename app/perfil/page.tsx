"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/components/PasswordInput";

export default function PerfilPage() {
  const router = useRouter();
  const { usuario, cargando } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!cargando && !usuario) router.push("/login");
  }, [cargando, usuario, router]);

  useEffect(() => {
    if (usuario) {
      api.get("/api/perfil/").then((res) => setPerfil(res.data)).catch(() => {});
    }
  }, [usuario]);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setEnviando(true);
    try {
      const res = await api.put("/api/perfil/password", {
        password_actual: passActual,
        password_nueva: passNueva,
        password_confirmar: passConfirmar,
      });
      setMensaje(res.data.mensaje);
      setPassActual("");
      setPassNueva("");
      setPassConfirmar("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "No se pudo cambiar la contraseña");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando || !usuario || !perfil) return null;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-espuma px-6 py-14">
      <div className="mx-auto max-w-lg">
        <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">
          Mi perfil
        </h1>

        <div className="mt-8 rounded-lg border border-linea bg-white p-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-tostado">Usuario</span>
              <span className="font-medium text-malta">{perfil.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-tostado">Email</span>
              <span className="font-medium text-malta">{perfil.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-tostado">Rol</span>
              <span className="font-medium text-malta">{perfil.rol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-tostado">Miembro desde</span>
              <span className="font-medium text-malta">
                {new Date(perfil.created_at).toLocaleDateString("es-ES")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-linea bg-white p-8">
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">
            Cambiar contraseña
          </h2>

          <form onSubmit={handlePassword} className="mt-6 flex flex-col gap-5">
            <PasswordInput id="pass-actual" label="Contraseña actual" value={passActual} onChange={setPassActual} />
            <PasswordInput id="pass-nueva" label="Nueva contraseña" value={passNueva} onChange={setPassNueva} />
            <PasswordInput id="pass-confirmar" label="Repite la nueva contraseña" value={passConfirmar} onChange={setPassConfirmar} />

            {error && (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            )}
            {mensaje && (
              <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{mensaje}</p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="rounded-md bg-ambar px-6 py-3 font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
            >
              {enviando ? "Guardando…" : "Cambiar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}