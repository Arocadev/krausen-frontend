"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type EntradaRanking = {
  posicion: number;
  id: number;
  nombre: string;
  estilo: string | null;
  username: string;
  total_likes: number;
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
        <div className="mt-10 rounded-lg border border-dashed border-linea bg-white py-20 text-center">
          <p className="font-[family-name:var(--font-lora)] text-xl text-malta">
            Todavía no hay me gustas este mes
          </p>
          <p className="mt-2 text-tostado">Dale me gusta a las recetas que te molen.</p>
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
                      ? "bg-ambar/15 text-ambar-oscuro"
                      : "bg-ambar/10 text-tostado"
                  }`}
                >
                  {r.posicion}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-medium text-malta group-hover:text-ambar-oscuro">
                    {r.nombre}
                  </h2>
                  <p className="text-sm text-tostado">
                    {r.estilo && <span>{r.estilo} · </span>}
                    por {r.username}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-malta">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="font-medium">{r.total_likes}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}