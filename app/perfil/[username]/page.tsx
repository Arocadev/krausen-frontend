"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

type Cerveza = {
  id: number;
  nombre: string;
  descripcion: string | null;
  estilo: string | null;
  alcohol: number | null;
  amargor: number | null;
  parent_id: number | null;
  imagen_url: string | null;
  username: string | null;
  created_at: string;
};

type Perfil = {
  username: string;
  created_at: string;
  total_recetas: number;
  total_likes_recibidos: number;
  recetas: Cerveza[];
  me_gustas: Cerveza[];
};

export default function PerfilPublicoPage() {
  const { username } = useParams();
  const t = useTranslations("perfilPublico");
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<"recetas" | "me_gustas">("recetas");

  useEffect(() => {
    if (!username) return;
    api.get(`/api/usuarios/${username}`)
      .then((res) => setPerfil(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [username]);

  if (cargando) return <p className="py-24 text-center text-tostado">{t("cargando")}</p>;

  if (!perfil) return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-[family-name:var(--font-lora)] text-2xl text-malta">{t("noEncontrado")}</h1>
      <Link href="/" className="mt-4 inline-block text-ambar-oscuro hover:underline">{t("volver")}</Link>
    </main>
  );

  const avatarUrl = (u: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${u}&backgroundColor=c8861b&textColor=ffffff&fontSize=40`;

  const TarjetaCerveza = ({ c }: { c: Cerveza }) => (
    <Link href={`/cervezas/${c.id}`} className="group rounded-lg border border-linea bg-white p-5 transition-all hover:border-ambar/50 hover:shadow-[0_2px_12px_rgba(92,58,33,0.08)]">
      {c.imagen_url && <img src={`http://127.0.0.1:8000${c.imagen_url}`} alt={c.nombre} className="mb-3 h-36 w-full rounded-md object-cover" />}
      {c.estilo && <span className="inline-block rounded-full bg-ambar/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">{c.estilo}</span>}
      <h3 className="mt-3 font-[family-name:var(--font-lora)] text-lg font-semibold text-malta group-hover:text-ambar-oscuro">{c.nombre}</h3>
      {c.descripcion && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tostado">{c.descripcion}</p>}
      <div className="mt-3 flex gap-3 text-sm text-tostado/80">
        {c.alcohol != null && <span>{c.alcohol}% vol.</span>}
        {c.amargor != null && <span>{c.amargor} IBU</span>}
        {c.parent_id != null && <span className="text-ambar-oscuro">{t("version")}</span>}
      </div>
    </Link>
  );

  const lista = tab === "recetas" ? perfil.recetas : perfil.me_gustas;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-start gap-5">
        <img src={avatarUrl(perfil.username)} alt={perfil.username} className="h-16 w-16 shrink-0 rounded-full" />
        <div>
          <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">{perfil.username}</h1>
          <p className="mt-1 text-sm text-tostado">
            {t("cerveceroDesde")} {new Date(perfil.created_at).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </p>
          <div className="mt-3 flex gap-6 text-sm">
            <span className="text-tostado"><span className="font-semibold text-malta">{perfil.total_recetas}</span> {t("recetas")}</span>
            <span className="text-tostado"><span className="font-semibold text-malta">{perfil.total_likes_recibidos}</span> {t("meGustasRecibidos")}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex border-b border-linea">
        <button onClick={() => setTab("recetas")} className={`px-4 pb-3 text-sm font-medium transition-colors ${tab === "recetas" ? "border-b-2 border-ambar text-ambar-oscuro" : "text-tostado hover:text-malta"}`}>
          {t("recetas")} ({perfil.recetas.length})
        </button>
        <button onClick={() => setTab("me_gustas")} className={`px-4 pb-3 text-sm font-medium transition-colors ${tab === "me_gustas" ? "border-b-2 border-ambar text-ambar-oscuro" : "text-tostado hover:text-malta"}`}>
          {t("meGustas")} ({perfil.me_gustas.length})
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-linea bg-white py-16 text-center">
          <p className="font-[family-name:var(--font-lora)] text-xl text-malta">
            {tab === "recetas" ? t("sinRecetas") : t("sinMeGustas")}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {lista.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
        </div>
      )}
    </main>
  );
}