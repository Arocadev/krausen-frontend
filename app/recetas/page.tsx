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
  username: string | null;
  created_at: string;
};

export default function RecetasPage() {
  const [cervezas, setCervezas] = useState<Cerveza[]>([]);
  const [ultimas, setUltimas] = useState<Cerveza[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [estilo, setEstilo] = useState("");
  const [alcoholMin, setAlcoholMin] = useState("");
  const [alcoholMax, setAlcoholMax] = useState("");
  const [amargorMin, setAmargorMin] = useState("");
  const [amargorMax, setAmargorMax] = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const cargarTodas = () => {
    api.get("/api/cervezas/").then((res) => {
      setCervezas(res.data);
      setUltimas(res.data.slice(0, 6));
    }).catch(() => {}).finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarTodas();
  }, []);

  const buscar = () => {
    setCargando(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (estilo) params.set("estilo", estilo);
    if (alcoholMin) params.set("alcohol_min", alcoholMin);
    if (alcoholMax) params.set("alcohol_max", alcoholMax);
    if (amargorMin) params.set("amargor_min", amargorMin);
    if (amargorMax) params.set("amargor_max", amargorMax);

    api.get(`/api/cervezas/buscar?${params.toString()}`)
      .then((res) => setCervezas(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstilo("");
    setAlcoholMin("");
    setAlcoholMax("");
    setAmargorMin("");
    setAmargorMax("");
    cargarTodas();
  };

  const hayFiltrosActivos = busqueda || estilo || alcoholMin || alcoholMax || amargorMin || amargorMax;

  const inputClase = "w-full rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none transition-colors focus:border-ambar";

  const TarjetaCerveza = ({ c }: { c: Cerveza }) => (
    <Link
      href={`/cervezas/${c.id}`}
      className="group rounded-lg border border-linea bg-white p-6 transition-all hover:border-ambar/50 hover:shadow-[0_2px_12px_rgba(92,58,33,0.08)]"
    >
      {c.estilo && (
        <span className="inline-block rounded-full bg-ambar/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">
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
      <div className="mt-4 flex items-center justify-between text-sm text-tostado/80">
        <div className="flex gap-4">
          {c.alcohol != null && <span>{c.alcohol}% vol.</span>}
          {c.amargor != null && <span>{c.amargor} IBU</span>}
          {c.parent_id != null && <span className="text-ambar-oscuro">Versión</span>}
        </div>
        {c.username && <span>por {c.username}</span>}
      </div>
    </Link>
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-[family-name:var(--font-lora)] text-4xl font-semibold text-malta">
        Recetas
      </h1>

      <div className="mt-8 flex gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
          className="flex-1 rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar"
        />
        <button
          onClick={buscar}
          className="rounded-md bg-ambar px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro"
        >
          Buscar
        </button>
        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className={`rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
            filtrosAbiertos || hayFiltrosActivos
              ? "border-ambar bg-ambar/10 text-ambar-oscuro"
              : "border-linea bg-white text-tostado hover:border-tostado"
          }`}
        >
          Filtros
        </button>
      </div>

      {filtrosAbiertos && (
        <div className="mt-4 rounded-lg border border-linea bg-white p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Estilo</label>
              <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={inputClase}>
                <option value="">Selecciona estilo…</option>
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
            <div>
              <label className="mb-1.5 block text-xs font-medium text-malta">Alcohol mín.</label>
              <input type="number" step="0.1" min="0" placeholder="0" value={alcoholMin} onChange={(e) => setAlcoholMin(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-malta">Alcohol máx.</label>
              <input type="number" step="0.1" min="0" placeholder="100" value={alcoholMax} onChange={(e) => setAlcoholMax(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-malta">IBU mín.</label>
              <input type="number" min="0" placeholder="0" value={amargorMin} onChange={(e) => setAmargorMin(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-malta">IBU máx.</label>
              <input type="number" min="0" placeholder="200" value={amargorMax} onChange={(e) => setAmargorMax(e.target.value)} className={inputClase} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={buscar} className="rounded-md bg-ambar px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro">
              Aplicar filtros
            </button>
            {hayFiltrosActivos && (
              <button onClick={limpiarFiltros} className="text-sm font-medium text-tostado hover:text-malta">
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {!hayFiltrosActivos && ultimas.length > 0 && (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
            Últimas recetas
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ultimas.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
          {hayFiltrosActivos ? "Resultados" : "Todas las recetas"}
        </h2>
        <p className="mt-1 text-sm text-tostado">
          {cervezas.length} receta{cervezas.length !== 1 ? "s" : ""}
        </p>

        {cargando ? (
          <p className="py-16 text-center text-tostado">Cargando…</p>
        ) : cervezas.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-linea bg-white py-16 text-center">
            <p className="font-[family-name:var(--font-lora)] text-xl text-malta">
              {hayFiltrosActivos ? "No se encontraron recetas con esos filtros" : "Aún no hay recetas publicadas"}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cervezas.map((c) => <TarjetaCerveza key={c.id} c={c} />)}
          </div>
        )}
      </section>
    </main>
  );
}