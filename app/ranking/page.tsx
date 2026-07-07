"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { SkeletonRanking } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";

type EntradaRanking = {
  posicion: number;
  id: number;
  nombre: string;
  estilo: string | null;
  username: string;
  total_likes: number;
};

type Periodo = "mensual" | "anual" | "global";

export default function RankingPage() {
  const t = useTranslations("ranking");
  const { mostrar, ToastComponent } = useToast();
  const [ranking, setRanking] = useState<EntradaRanking[]>([]);
  const [cargando, setCargando] = useState(true);
  const [periodo, setPeriodo] = useState<Periodo>("mensual");

  useEffect(() => {
    setCargando(true);
    api.get(`/api/ranking/${periodo}`)
      .then((res) => setRanking(res.data))
      .catch(() => mostrar("No se pudo cargar el ranking.", "error"))
      .finally(() => setCargando(false));
  }, [periodo]);

  const subtitulo = {
    mensual: new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }).toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
    anual: `${t("subtituloAno")} ${new Date().getFullYear()}`,
    global: t("subtituloGlobal"),
  }[periodo];

  const sinLikes = {
    mensual: t("sinLikesMes"),
    anual: t("sinLikesAno"),
    global: t("sinLikesGlobal"),
  }[periodo];

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      {ToastComponent}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-lora)] text-4xl font-semibold text-malta">{t("titulo")}</h1>
          <p className="mt-2 text-tostado">{subtitulo}</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as Periodo)}
          className="mt-1 rounded-full border border-linea bg-white px-4 py-1.5 text-sm font-medium text-tostado outline-none transition-colors hover:border-ambar/50 focus:border-ambar"
        >
          <option value="mensual">{t("esteMes")}</option>
          <option value="anual">{t("esteAno")}</option>
          <option value="global">{t("global")}</option>
        </select>
      </div>

      {cargando ? (
        <SkeletonRanking />
      ) : ranking.length === 0 ? (
        <div className="mt-10 min-h-[300px] rounded-lg border border-dashed border-linea bg-white py-20 text-center">
          <p className="font-[family-name:var(--font-lora)] text-xl text-malta">{sinLikes}</p>
          <p className="mt-2 text-sm text-tostado">Sé el primero en conseguir me gustas este periodo.</p>
        </div>
      ) : (
        <ol className="mt-8 min-h-[300px] space-y-3">
          {ranking.map((r) => (
            <li key={r.id}>
              <Link href={`/cervezas/${r.id}`} className="group flex items-center gap-5 rounded-lg border border-linea bg-white p-5 transition-all hover:border-ambar/50">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-lora)] text-lg font-semibold ${r.posicion === 1 ? "bg-ambar text-white" : r.posicion <= 3 ? "bg-ambar/15 text-ambar-oscuro" : "bg-ambar/10 text-tostado"}`}>
                  {r.posicion}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-medium text-malta group-hover:text-ambar-oscuro">{r.nombre}</h2>
                  <p className="text-sm text-tostado">
                    {r.estilo && <span>{r.estilo} · </span>}
                    {t("porUsername")} {r.username}
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