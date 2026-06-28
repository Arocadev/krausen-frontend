"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type Notificacion = {
  id: number;
  tipo: "like" | "fork";
  leida: boolean;
  created_at: string;
  cerveza_id: number;
  cerveza_nombre: string | null;
  actor_username: string | null;
};

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbiertas, setNotifAbiertas] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const cerrarMenu = () => setMenuAbierto(false);

  const linkClass = (href: string) => {
    const activo = pathname === href || pathname.startsWith(href + "/");
    return `transition-colors ${activo ? "text-crema font-semibold" : "text-espuma/80 hover:text-crema"}`;
  };

  const linkMobileClass = (href: string) => {
    const activo = pathname === href || pathname.startsWith(href + "/");
    return `rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${activo ? "bg-espuma/10 text-crema" : "text-espuma/80 hover:bg-espuma/10 hover:text-crema"}`;
  };

  const cargarNotificaciones = () => {
    if (!usuario) return;
    api.get("/api/notificaciones/")
      .then((res) => {
        setNotificaciones(res.data.notificaciones);
        setNoLeidas(res.data.no_leidas);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!usuario) return;
    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, [usuario]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifAbiertas(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const marcarLeida = async (id: number) => {
    await api.patch(`/api/notificaciones/${id}/leer`).catch(() => {});
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
    setNoLeidas((prev) => Math.max(0, prev - 1));
  };

  const marcarTodasLeidas = async () => {
    await api.patch("/api/notificaciones/leer-todas").catch(() => {});
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    setNoLeidas(0);
  };

  const textoNotificacion = (n: Notificacion) => {
    if (n.tipo === "like")
      return <><span className="font-medium text-crema">{n.actor_username}</span> le dio me gusta a <span className="font-medium text-crema">{n.cerveza_nombre}</span></>;
    if (n.tipo === "fork")
      return <><span className="font-medium text-crema">{n.actor_username}</span> hizo una versión de <span className="font-medium text-crema">{n.cerveza_nombre}</span></>;
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

  const IconoCampana = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-50 bg-navbar">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-0">

        {/* Logo */}
        <Link href="/" onClick={cerrarMenu} className="flex items-center gap-1.5">
          <img src="/cerveza_logo.png" alt="" className="h-7 w-7 brightness-125" />
          <span className="font-[family-name:var(--font-lora)] text-2xl font-semibold tracking-tight text-crema">
            Krausen
          </span>
        </Link>

        {/* Links desktop */}
        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/recetas" className={linkClass("/recetas")}>Recetas</Link>
          <Link href="/ranking" className={linkClass("/ranking")}>Ranking</Link>
          {usuario && <Link href="/mis-recetas" className={linkClass("/mis-recetas")}>Mis recetas</Link>}
          {usuario && <Link href="/cervezas/nueva" className={linkClass("/cervezas/nueva")}>Crear receta</Link>}
        </div>

        {/* Acciones desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {usuario ? (
            <>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifAbiertas(!notifAbiertas)}
                  className="relative flex items-center text-espuma/80 transition-colors hover:text-crema"
                  title="Notificaciones"
                >
                  <IconoCampana />
                  {noLeidas > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ambar text-[10px] font-bold text-white">
                      {noLeidas > 9 ? "9+" : noLeidas}
                    </span>
                  )}
                </button>

                {notifAbiertas && (
                  <div className="absolute right-0 top-8 z-50 w-80 rounded-lg border border-linea bg-navbar shadow-lg">
                    <div className="flex items-center justify-between border-b border-espuma/10 px-4 py-3">
                      <span className="text-sm font-medium text-crema">Notificaciones</span>
                      {noLeidas > 0 && (
                        <button onClick={marcarTodasLeidas} className="text-xs text-espuma/60 transition-colors hover:text-crema">
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notificaciones.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-espuma/50">Sin notificaciones</p>
                      ) : (
                        notificaciones.map((n) => (
                          <Link
                            key={n.id}
                            href={`/cervezas/${n.cerveza_id}`}
                            onClick={() => { if (!n.leida) marcarLeida(n.id); setNotifAbiertas(false); }}
                            className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-espuma/5 ${!n.leida ? "bg-espuma/10" : ""}`}
                          >
                            <span className="mt-0.5 shrink-0 text-ambar">
                              {n.tipo === "like" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="6" y1="3" x2="6" y2="15" />
                                  <circle cx="18" cy="6" r="3" />
                                  <circle cx="6" cy="18" r="3" />
                                  <path d="M18 9a9 9 0 0 1-9 9" />
                                </svg>
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs leading-relaxed text-espuma/80">{textoNotificacion(n)}</p>
                              <p className="mt-1 text-[11px] text-espuma/40">{tiempoRelativo(n.created_at)}</p>
                            </div>
                            {!n.leida && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ambar" />}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/perfil" className={linkClass("/perfil")}>Mi perfil</Link>
              <div className="h-4 w-px bg-espuma/20" />
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium text-espuma/80 transition-colors hover:text-crema"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>Entrar</Link>
              <Link href="/registro" className={linkClass("/registro")}>Crear cuenta</Link>
            </>
          )}
        </div>

        {/* Botón hamburger (móvil) */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-espuma/80 transition-colors hover:bg-espuma/10 hover:text-crema md:hidden"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div className="border-t border-espuma/10 bg-navbar md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col gap-1">
              <Link href="/recetas" onClick={cerrarMenu} className={linkMobileClass("/recetas")}>Recetas</Link>
              <Link href="/ranking" onClick={cerrarMenu} className={linkMobileClass("/ranking")}>Ranking</Link>
              {usuario && <Link href="/mis-recetas" onClick={cerrarMenu} className={linkMobileClass("/mis-recetas")}>Mis recetas</Link>}
              {usuario && <Link href="/cervezas/nueva" onClick={cerrarMenu} className={linkMobileClass("/cervezas/nueva")}>Crear receta</Link>}

              <div className="my-2 border-t border-espuma/10" />

              {usuario ? (
                <>
                  <Link href="/notificaciones" onClick={cerrarMenu} className={`flex items-center gap-2 ${linkMobileClass("/notificaciones")}`}>
                    <span className="relative">
                      <IconoCampana />
                      {noLeidas > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ambar text-[10px] font-bold text-white">
                          {noLeidas > 9 ? "9+" : noLeidas}
                        </span>
                      )}
                    </span>
                    Notificaciones {noLeidas > 0 && `(${noLeidas})`}
                  </Link>
                  <Link href="/perfil" onClick={cerrarMenu} className={linkMobileClass("/perfil")}>Mi perfil</Link>
                  <button
                    onClick={() => { logout(); cerrarMenu(); }}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-espuma/80 transition-colors hover:bg-espuma/10 hover:text-crema"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="mt-1 flex flex-col gap-2">
                  <Link href="/login" onClick={cerrarMenu} className={linkMobileClass("/login")}>Entrar</Link>
                  <Link href="/registro" onClick={cerrarMenu} className={linkMobileClass("/registro")}>Crear cuenta</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}