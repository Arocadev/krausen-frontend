"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Notificacion = {
  id: number;
  tipo: "like" | "fork";
  leida: boolean;
  created_at: string;
  cerveza_id: number;
  cerveza_nombre: string | null;
  actor_username: string | null;
};

export default function NotificacionesPage() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) { router.push("/login"); return; }
    api.get("/api/notificaciones/")
      .then((res) => {
        setNotificaciones(res.data.notificaciones);
        setNoLeidas(res.data.no_leidas);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [usuario]);

  const marcarLeida = async (id: number) => {
    await api.patch(`/api/notificaciones/${id}/leer`).catch(() => {});
    setNotificaciones((prev) => prev.map((n) => n.id === id ? { ...n, leida: true } : n));
    setNoLeidas((prev) => Math.max(0, prev - 1));
  };

  const marcarTodasLeidas = async () => {
    await api.patch("/api/notificaciones/leer-todas").catch(() => {});
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    setNoLeidas(0);
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">
          Notificaciones
        </h1>
        {noLeidas > 0 && (
          <button
            onClick={marcarTodasLeidas}
            className="text-sm font-medium text-tostado transition-colors hover:text-malta"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {cargando ? (
        <p className="py-16 text-center text-tostado">Cargando…</p>
      ) : notificaciones.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-linea bg-white py-16 text-center">
          <p className="font-[family-name:var(--font-lora)] text-xl text-malta">Sin notificaciones</p>
          <p className="mt-2 text-sm text-tostado">Cuando alguien interactúe con tus recetas aparecerá aquí</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-linea rounded-lg border border-linea bg-white">
          {notificaciones.map((n) => (
            <li key={n.id}>
              <Link
                href={`/cervezas/${n.cerveza_id}`}
                onClick={() => { if (!n.leida) marcarLeida(n.id); }}
                className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-espuma/50 ${!n.leida ? "bg-ambar/5" : ""}`}
              >
                <span className="mt-0.5 shrink-0 text-ambar">
                  {n.tipo === "like" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="3" x2="6" y2="15" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <path d="M18 9a9 9 0 0 1-9 9" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-tostado">
                    {n.tipo === "like" ? (
                      <><span className="font-medium text-malta">{n.actor_username}</span> le dio me gusta a <span className="font-medium text-malta">{n.cerveza_nombre}</span></>
                    ) : (
                      <><span className="font-medium text-malta">{n.actor_username}</span> hizo una versión de <span className="font-medium text-malta">{n.cerveza_nombre}</span></>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-tostado/60">{tiempoRelativo(n.created_at)}</p>
                </div>
                {!n.leida && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ambar" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}