"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SkeletonGrid } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";

type Cerveza = {
  id: number;
  nombre: string;
  descripcion: string | null;
  estilo: string | null;
  alcohol: number | null;
  amargor: number | null;
  parent_id: number | null;
  username: string | null;
  created_at: string;
};

export default function MisRecetasPage() {
  const router = useRouter();
  const { usuario, cargando } = useAuth();
  const t = useTranslations("misRecetas");
  const { mostrar, ToastComponent } = useToast();
  const [mias, setMias] = useState<Cerveza[]>([]);
  const [favoritas, setFavoritas] = useState<Cerveza[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    if (!cargando && !usuario) router.push("/login");
  }, [cargando, usuario, router]);

  useEffect(() => {
    if (usuario) {
      Promise.all([api.get("/api/cervezas/mis-recetas"), api.get("/api/cervezas/me-gustan")])
        .then(([m, f]) => { setMias(m.data); setFavoritas(f.data); })
        .catch(() => mostrar("No se pudieron cargar tus recetas.", "error"))
        .finally(() => setCargandoDatos(false));
    }
  }, [usuario]);

  if (cargando || !usuario) return null;

  const TarjetaCerveza = ({ c }: { c: Cerveza }) => (
    <Link href={`/cervezas/${c.id}`} className="group rounded-lg border border-linea bg-white p-6 transition-all hover:border-ambar/50 hover:shadow-[0_2px_12px_rgba(92,58,33,0.08)]">
      {c.estilo && <span className="inline-block rounded-full bg-ambar/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">{c.estilo}</span>}
      <h3 className="mt-3 font-[family-name:var(--font-lora)] text-xl font-semibold text-malta group-hover:text-ambar-oscuro">{c.nombre}</h3>
      {c.descripcion && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tostado">{c.descripcion}</p>}
      <div className="mt-4 flex items-center justify-between text-sm text-tostado/80">
        <div className="flex gap-4">
          {c.alcohol != null && <span>{c.alcohol}% vol.</span>}
          {c.amargor != null && <span>{c.amargor} IBU</span>}
          {c.parent_id != null && <span className="text-ambar-oscuro">{t("version")}</span>}
        </div>
        {c.username && <span>{t("por")} {c.username}</span>}
      </div>
    </Link>
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      {ToastComponent}
      <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">{t("titulo")}</h1>
      {cargandoDatos ? (
        <SkeletonGrid n={6} />
      ) : (
        <>
          <section className="mt-8">
            {mias.length === 0 ? (
              <div className="rounded-lg border border-dashed border-linea bg-white py-16 text-center">
                <p className="font-[family-name:var(--font-lora)] text-xl text-malta">{t("sinRecetas")}</p>
                <p className="mt-2 text-tostado">{t("sinRecetasDesc")}</p>
                <Link href="/cervezas/nueva" className="mt-4 inline-block text-sm font-medium text-ambar-oscuro hover:underline">
                  Crear mi primera receta →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mias.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
              </div>
            )}
          </section>
          {favoritas.length > 0 && (
            <section className="mt-14">
              <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">{t("favoritas")}</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favoritas.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}