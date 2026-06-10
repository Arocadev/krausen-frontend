"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type EntradaRanking = {
  posicion: number;
  id: number;
  nombre: string;
  estilo: string | null;
  media: number;
  total_valoraciones: number;
};

export default function RankingPage() {
  const [ranking, setRanking] = useState<EntradaRanking[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get("/api/ranking/mensual")
      .then((res) => setRanking(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const mes = new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-[family-name:var(--font-lora)] text-4xl font-semibold text-malta">
        Ranking del mes
      </h1>
      <p className="mt-2 capitalize text-tostado">{mes}</p>

      {cargando ? (
        <p className="py-16 text-center text-tostado">Cargando ranking…</p>
      ) : ranking.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-linea bg-espuma/60 py-20 text-center">
          <p className="font-[family-name:var(--font-lora)] text-xl text-malta">
            Todavía no hay valoraciones este mes
          </p>
          <p className="mt-2 text-tostado">Valora recetas para que aparezcan aquí.</p>
        </div>
      ) : (
        <ol className="mt-10 space-y-3">
          {ranking.map((r) => (
            <li key={r.id}>
              <Link
                href={`/cervezas/${r.id}`}
                className="group flex items-center gap-5 rounded-lg border border-linea bg-white p-5 transition-all hover:border-ambar/50"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-lora)] text-lg font-semibold ${
                    r.posicion === 1
                      ? "bg-ambar text-white"
                      : r.posicion <= 3
                      ? "bg-espuma text-ambar-oscuro"
                      : "bg-espuma/60 text-tostado"
                  }`}
                >
                  {r.posicion}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-medium text-malta group-hover:text-ambar-oscuro">
                    {r.nombre}
                  </h2>
                  {r.estilo && <p className="text-sm text-tostado">{r.estilo}</p>}
                </div>
                <div className="text-right">
                  <p className="font-medium text-malta">★ {r.media}</p>
                  <p className="text-xs text-tostado">{r.total_valoraciones} valoraciones</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}