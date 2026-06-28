"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

const LIMIT = 6;

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

export default function RecetasPage() {
  const router = useRouter();
  const t = useTranslations("recetas");
  const [cervezas, setCervezas] = useState<Cerveza[]>([]);
  const [ultimas, setUltimas] = useState<Cerveza[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [estilo, setEstilo] = useState("");
  const [alcoholMin, setAlcoholMin] = useState("");
  const [alcoholMax, setAlcoholMax] = useState("");
  const [amargorMin, setAmargorMin] = useState("");
  const [amargorMax, setAmargorMax] = useState("");
  const [ingrediente, setIngrediente] = useState("");
  const [autor, setAutor] = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [hayFiltros, setHayFiltros] = useState(false);

  const totalPaginas = Math.ceil(total / LIMIT);

  const cargarTodas = (pag: number = 0) => {
    setCargando(true);
    api.get(`/api/cervezas/?skip=${pag * LIMIT}&limit=${LIMIT}`)
      .then((res) => {
        setCervezas(res.data.cervezas);
        setTotal(res.data.total);
        if (pag === 0) setUltimas(res.data.cervezas.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  const buscar = (pag: number = 0) => {
    setCargando(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (estilo) params.set("estilo", estilo);
    if (alcoholMin) params.set("alcohol_min", alcoholMin);
    if (alcoholMax) params.set("alcohol_max", alcoholMax);
    if (amargorMin) params.set("amargor_min", amargorMin);
    if (amargorMax) params.set("amargor_max", amargorMax);
    if (ingrediente) params.set("ingrediente", ingrediente);
    if (autor) params.set("autor", autor);
    params.set("skip", String(pag * LIMIT));
    params.set("limit", String(LIMIT));
    api.get(`/api/cervezas/buscar?${params.toString()}`)
      .then((res) => { setCervezas(res.data.cervezas); setTotal(res.data.total); })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarTodas(0); }, []);

  const handleBuscar = () => {
    const activos = !!(busqueda || estilo || alcoholMin || alcoholMax || amargorMin || amargorMax || ingrediente || autor);
    setHayFiltros(activos);
    setPagina(0);
    if (activos) buscar(0);
    else cargarTodas(0);
  };

  const handlePagina = (nueva: number) => {
    setPagina(nueva);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (hayFiltros) buscar(nueva);
    else cargarTodas(nueva);
  };

  const limpiarFiltros = () => {
    setBusqueda(""); setEstilo(""); setAlcoholMin(""); setAlcoholMax("");
    setAmargorMin(""); setAmargorMax(""); setIngrediente(""); setAutor("");
    setHayFiltros(false); setPagina(0); cargarTodas(0);
  };

  const inputClase = "w-full rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none transition-colors focus:border-ambar";

  const TarjetaCerveza = ({ c }: { c: Cerveza }) => (
    <div
      onClick={() => router.push(`/cervezas/${c.id}`)}
      className="group cursor-pointer rounded-lg border border-linea bg-white p-5 transition-all hover:border-ambar/50 hover:shadow-[0_2px_12px_rgba(92,58,33,0.08)] sm:p-6"
    >
      {c.estilo && (
        <span className="inline-block rounded-full bg-ambar/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">{c.estilo}</span>
      )}
      <h3 className="mt-3 font-[family-name:var(--font-lora)] text-lg font-semibold text-malta group-hover:text-ambar-oscuro sm:text-xl">{c.nombre}</h3>
      {c.descripcion && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tostado">{c.descripcion}</p>}
      <div className="mt-4 flex items-center justify-between text-sm text-tostado/80">
        <div className="flex gap-3">
          {c.alcohol != null && <span>{c.alcohol}% vol.</span>}
          {c.amargor != null && <span>{c.amargor} IBU</span>}
          {c.parent_id != null && <span className="text-ambar-oscuro">{t("version")}</span>}
        </div>
        {c.username && (
          <Link href={`/perfil/${c.username}`} onClick={(e) => e.stopPropagation()} className="shrink-0 pl-2 hover:text-ambar-oscuro hover:underline">
            {t("por")} {c.username}
          </Link>
        )}
      </div>
    </div>
  );

  const Paginacion = () => {
    if (totalPaginas <= 1) return null;
    return (
      <div className="mt-10 flex items-center justify-center gap-2">
        <button onClick={() => handlePagina(pagina - 1)} disabled={pagina === 0} className="rounded-md border border-linea bg-white px-4 py-2 text-sm font-medium text-tostado transition-colors hover:border-ambar hover:text-ambar-oscuro disabled:cursor-not-allowed disabled:opacity-40">
          {t("anterior")}
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPaginas }, (_, i) => {
            const mostrar = i === 0 || i === totalPaginas - 1 || Math.abs(i - pagina) <= 1;
            const esEllipsis = !mostrar && (i === 1 || i === totalPaginas - 2);
            if (esEllipsis) return <span key={i} className="flex h-9 w-9 items-center justify-center text-sm text-tostado/50">…</span>;
            if (!mostrar) return null;
            return (
              <button key={i} onClick={() => handlePagina(i)} className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${i === pagina ? "bg-ambar text-white" : "border border-linea bg-white text-tostado hover:border-ambar hover:text-ambar-oscuro"}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
        <button onClick={() => handlePagina(pagina + 1)} disabled={pagina >= totalPaginas - 1} className="rounded-md border border-linea bg-white px-4 py-2 text-sm font-medium text-tostado transition-colors hover:border-ambar hover:text-ambar-oscuro disabled:cursor-not-allowed disabled:opacity-40">
          {t("siguiente")}
        </button>
      </div>
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta sm:text-4xl">{t("titulo")}</h1>

      <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3">
        <input
          type="text"
          placeholder={t("buscar")}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          className="min-w-0 flex-1 rounded-md border border-linea bg-white px-4 py-2.5 text-sm text-malta outline-none transition-colors focus:border-ambar"
        />
        <button onClick={handleBuscar} className="rounded-md bg-ambar px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro sm:px-5">
          {t("botonBuscar")}
        </button>
        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${filtrosAbiertos || hayFiltros ? "border-ambar bg-ambar/10 text-ambar-oscuro" : "border-linea bg-white text-tostado hover:border-tostado"}`}
        >
          {t("filtros")}
        </button>
      </div>

      {filtrosAbiertos && (
        <div className="mt-3 rounded-lg border border-linea bg-white p-4 sm:mt-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("ingrediente")}</label>
              <input type="text" placeholder="Ej: Cascade, Malta Pale…" value={ingrediente} onChange={(e) => setIngrediente(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscar()} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("autor")}</label>
              <input type="text" placeholder="Nombre de usuario…" value={autor} onChange={(e) => setAutor(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscar()} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("estilo")}</label>
              <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={inputClase}>
                <option value="">{t("todosEstilos")}</option>
                <option value="IPA">IPA</option>
                <option value="APA">APA (American Pale Ale)</option>
                <option value="Stout">Stout</option>
                <option value="Porter">Porter</option>
                <option value="Lager">Lager</option>
                <option value="Pilsner">Pilsner</option>
                <option value="Wheat Beer">Wheat Beer</option>
                <option value="Belgian Ale">Belgian Ale</option>
                <option value="Saison">Saison</option>
                <option value="Amber Ale">Amber Ale</option>
                <option value="Red Ale">Red Ale</option>
                <option value="Brown Ale">Brown Ale</option>
                <option value="Barley Wine">Barley Wine</option>
                <option value="Sour">Sour</option>
                <option value="Gose">Gose</option>
                <option value="Kölsch">Kölsch</option>
                <option value="Märzen">Märzen</option>
                <option value="Bock">Bock</option>
                <option value="Dunkel">Dunkel</option>
                <option value="Hefeweizen">Hefeweizen</option>
                <option value="Tripel">Tripel</option>
                <option value="Dubbel">Dubbel</option>
                <option value="NEIPA">NEIPA (New England IPA)</option>
                <option value="Imperial Stout">Imperial Stout</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-3 lg:grid-cols-4">
              <div><label className="mb-1.5 block text-xs font-medium text-malta">{t("alcoholMin")}</label><input type="number" step="0.1" min="0" placeholder="0" value={alcoholMin} onChange={(e) => setAlcoholMin(e.target.value)} className={inputClase} /></div>
              <div><label className="mb-1.5 block text-xs font-medium text-malta">{t("alcoholMax")}</label><input type="number" step="0.1" min="0" placeholder="100" value={alcoholMax} onChange={(e) => setAlcoholMax(e.target.value)} className={inputClase} /></div>
              <div><label className="mb-1.5 block text-xs font-medium text-malta">{t("ibuMin")}</label><input type="number" min="0" placeholder="0" value={amargorMin} onChange={(e) => setAmargorMin(e.target.value)} className={inputClase} /></div>
              <div><label className="mb-1.5 block text-xs font-medium text-malta">{t("ibuMax")}</label><input type="number" min="0" placeholder="200" value={amargorMax} onChange={(e) => setAmargorMax(e.target.value)} className={inputClase} /></div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleBuscar} className="rounded-md bg-ambar px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro">{t("aplicarFiltros")}</button>
            {hayFiltros && <button onClick={limpiarFiltros} className="text-sm font-medium text-tostado hover:text-malta">{t("limpiarFiltros")}</button>}
          </div>
        </div>
      )}

      {!hayFiltros && pagina === 0 && ultimas.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">{t("ultimas")}</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {ultimas.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
          </div>
        </section>
      )}

      <section className="mt-10 sm:mt-12">
        <div className="flex items-baseline gap-3">
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
            {hayFiltros ? t("resultados") : t("todas")}
          </h2>
          <span className="text-sm text-tostado">{total} {total !== 1 ? t("totalPlural") : t("total")}</span>
        </div>
        {cargando ? (
          <p className="py-16 text-center text-tostado">{t("cargando")}</p>
        ) : cervezas.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-linea bg-white py-16 text-center">
            <p className="font-[family-name:var(--font-lora)] text-xl text-malta">
              {hayFiltros ? t("sinResultados") : t("sinRecetas")}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {cervezas.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
            </div>
            <Paginacion />
          </>
        )}
      </section>
    </main>
  );
}