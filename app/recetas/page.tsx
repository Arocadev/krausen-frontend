"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type Cerveza = {
  id: number;
  nombre: string;
  descripcion: string | null;
  estilo: string | null;
  alcohol: number | null;
  amargor: number | null;
  parent_id: number | null;
  created_at: string;
};

export default function RecetasPage() {
  const [cervezas, setCervezas] = useState<Cerveza[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get("/api/cervezas/")
      .then((res) => setCervezas(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-[family-name:var(--font-lora)] text-4xl font-semibold text-malta">
        Todas las recetas
      </h1>
      <p className="mt-2 text-tostado">
        {cervezas.length} receta{cervezas.length !== 1 ? "s" : ""} publicada{cervezas.length !== 1 ? "s" : ""}
      </p>

      {cargando ? (
        <p className="py-16 text-center text-tostado">Cargando recetas…</p>
      ) : cervezas.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-linea bg-espuma/60 py-20 text-center">
          <p className="font-[family-name:var(--font-lora)] text-xl text-malta">
            Aún no hay recetas publicadas
          </p>
          <p className="mt-2 text-tostado">
            Sé el primero en compartir una elaboración.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cervezas.map((c) => (
            <Link
              key={c.id}
              href={`/cervezas/${c.id}`}
              className="group rounded-lg border border-linea bg-white p-6 transition-all hover:border-ambar/50 hover:shadow-[0_2px_12px_rgba(92,58,33,0.08)]"
            >
              {c.estilo && (
                <span className="inline-block rounded-full bg-espuma px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">
                  {c.estilo}
                </span>
              )}
              <h3 className="mt-3 font-[family-name:var(--font-lora)] text-xl font-semibold text-malta group-hover:text-ambar-oscuro">
                {c.nombre}
              </h3>
              {c.descripcion && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tostado">
                  {c.descripcion}
                </p>
              )}
              <div className="mt-4 flex gap-4 text-sm text-tostado/80">
                {c.alcohol != null && <span>{c.alcohol}% vol.</span>}
                {c.amargor != null && <span>{c.amargor} IBU</span>}
                {c.parent_id != null && (
                  <span className="text-ambar-oscuro">Versión</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}