"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Comentario = {
  id: number;
  contenido: string;
  created_at: string;
  usuario_id: number;
  username: string | null;
};

export default function Comentarios({ cervezaId }: { cervezaId: string }) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargar = () => {
    api.get(`/api/cervezas/${cervezaId}/comentarios`)
      .then((res) => setComentarios(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    cargar();
  }, [cervezaId]);

  const enviar = async () => {
    if (!contenido.trim() || enviando) return;
    setEnviando(true);
    try {
      const res = await api.post(`/api/cervezas/${cervezaId}/comentarios`, { contenido });
      setComentarios((prev) => [...prev, res.data]);
      setContenido("");
      setMostrarForm(false);
    } catch {} finally {
      setEnviando(false);
    }
  };

  const eliminar = async (comentarioId: number) => {
    try {
      await api.delete(`/api/cervezas/${cervezaId}/comentarios/${comentarioId}`);
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
    } catch {}
  };

  const tiempoRelativo = (fecha: string) => {
    const diff = Date.now() - new Date(fecha).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "ahora";
    if (min < 60) return `hace ${min}m`;
    const h = Math.floor(min / 60);
    if (h < 24) return `hace ${h}h`;
    return `hace ${Math.floor(h / 24)}d`;
  };

  const avatarUrl = (username: string | null) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${username ?? "?"}&backgroundColor=c8861b&textColor=ffffff&fontSize=40`;

  return (
    <section className="border-t border-linea">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
            Comentarios
            {comentarios.length > 0 && (
              <span className="ml-2 text-lg font-normal text-tostado/60">
                ({comentarios.length})
              </span>
            )}
          </h2>
          {usuario && !mostrarForm && (
            <button
              onClick={() => setMostrarForm(true)}
              className="rounded-md bg-ambar px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro"
            >
              Agregar comentario
            </button>
          )}
        </div>

        {usuario && mostrarForm && (
          <div className="mt-6 rounded-lg border border-linea bg-white p-4 sm:p-5">
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe tu comentario…"
              rows={3}
              className="w-full resize-none rounded-md border border-linea bg-espuma/30 px-3 py-2.5 text-sm text-malta outline-none transition-colors focus:border-ambar"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={enviar}
                disabled={!contenido.trim() || enviando}
                className="rounded-md bg-ambar px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? "Enviando…" : "Publicar"}
              </button>
              <button
                onClick={() => { setMostrarForm(false); setContenido(""); }}
                className="rounded-md border border-linea px-4 py-2 text-sm font-medium text-tostado transition-colors hover:border-tostado"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {!usuario && (
          <p className="mt-4 text-sm text-tostado">
            <a href="/login" className="font-medium text-ambar-oscuro hover:underline">Inicia sesión</a> para comentar.
          </p>
        )}

        {comentarios.length === 0 ? (
          <p className="mt-8 text-sm text-tostado/60">
            Sin comentarios todavía. ¡Sé el primero!
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {comentarios.map((c) => (
              <li key={c.id} className="flex gap-3">
                <img
                  src={avatarUrl(c.username)}
                  alt={c.username ?? "Usuario"}
                  className="h-8 w-8 shrink-0 rounded-full"
                />
                <div className="flex-1 rounded-lg border border-linea bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-malta">{c.username}</span>
                      <span className="text-xs text-tostado/50">{tiempoRelativo(c.created_at)}</span>
                    </div>
                    {usuario && (usuario.id === c.usuario_id || usuario.rol === "ADMIN") && (
                      <button
                        onClick={() => eliminar(c.id)}
                        className="text-tostado/40 transition-colors hover:text-red-500"
                        title="Eliminar comentario"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-tostado">{c.contenido}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}