"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Ingrediente = {
  ingrediente: { id: number; nombre: string; tipo: string };
  cantidad: number;
  unidad: string;
};

type Paso = { id: number; orden: number; descripcion: string; duracion_min: number | null };

type Cerveza = {
  id: number;
  nombre: string;
  descripcion: string | null;
  estilo: string | null;
  litros: number | null;
  alcohol: number | null;
  amargor: number | null;
  parent_id: number | null;
  usuario_id: number;
  created_at: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
};

type Valoracion = {
  id: number;
  usuario_id: number;
  nota: number;
  comentario: string | null;
  created_at: string;
};

export default function DetalleCervezaPage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [cerveza, setCerveza] = useState<Cerveza | null>(null);
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [media, setMedia] = useState<number>(0);
  const [cargando, setCargando] = useState(true);

  const [nota, setNota] = useState(7);
  const [comentario, setComentario] = useState("");
  const [errorValoracion, setErrorValoracion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargarDatos = () => {
    Promise.all([
      api.get(`/api/cervezas/${id}`),
      api.get(`/api/cervezas/${id}/valoraciones`),
      api.get(`/api/cervezas/${id}/media`),
    ])
      .then(([c, v, m]) => {
        setCerveza(c.data);
        setValoraciones(v.data);
        setMedia(m.data.media);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (id) cargarDatos();
  }, [id]);

  const enviarValoracion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValoracion("");
    setEnviando(true);
    try {
      await api.post(`/api/cervezas/${id}/valoraciones`, { nota, comentario: comentario || null });
      setComentario("");
      cargarDatos();
    } catch (err: any) {
      setErrorValoracion(err.response?.data?.detail || "No se pudo enviar la valoración");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return <p className="py-24 text-center text-tostado">Cargando receta…</p>;
  }

  if (!cerveza) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-lora)] text-2xl text-malta">
          Receta no encontrada
        </h1>
        <Link href="/" className="mt-4 inline-block text-ambar-oscuro hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className="border-b border-linea bg-espuma">
        <div className="mx-auto max-w-4xl px-6 py-14">
          {cerveza.estilo && (
            <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">
              {cerveza.estilo}
            </span>
          )}
          <h1 className="mt-4 font-[family-name:var(--font-lora)] text-4xl font-semibold text-malta">
            {cerveza.nombre}
          </h1>
          {cerveza.descripcion && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-tostado">
              {cerveza.descripcion}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-tostado">
            {media > 0 && (
              <span className="font-medium text-malta">
                ★ {media} <span className="font-normal text-tostado">({valoraciones.length})</span>
              </span>
            )}
            {cerveza.alcohol != null && <span>{cerveza.alcohol}% vol.</span>}
            {cerveza.amargor != null && <span>{cerveza.amargor} IBU</span>}
            {cerveza.litros != null && <span>{cerveza.litros} L</span>}
            {cerveza.parent_id != null && (
              <Link href={`/cervezas/${cerveza.parent_id}`} className="text-ambar-oscuro hover:underline">
                Versión de otra receta
              </Link>
            )}
          </div>

          {usuario && (
            <Link
              href={`/cervezas/nueva?fork=${cerveza.id}`}
              className="mt-8 inline-block rounded-md border border-ambar px-5 py-2.5 text-sm font-medium text-ambar-oscuro transition-colors hover:bg-ambar hover:text-white"
            >
              Hacer mi versión
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-12 px-6 py-14 md:grid-cols-2">
        <div>
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
            Ingredientes
          </h2>
          {cerveza.ingredientes.length === 0 ? (
            <p className="mt-4 text-tostado">Sin ingredientes detallados.</p>
          ) : (
            <ul className="mt-5 divide-y divide-linea">
              {cerveza.ingredientes.map((ing, i) => (
                <li key={i} className="flex items-baseline justify-between py-3">
                  <span className="text-malta">{ing.ingrediente.nombre}</span>
                  <span className="text-sm text-tostado">
                    {ing.cantidad} {ing.unidad}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
            Elaboración
          </h2>
          {cerveza.pasos.length === 0 ? (
            <p className="mt-4 text-tostado">Sin pasos detallados.</p>
          ) : (
            <ol className="mt-5 space-y-5">
              {cerveza.pasos.map((paso) => (
                <li key={paso.id} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-espuma text-sm font-medium text-ambar-oscuro">
                    {paso.orden}
                  </span>
                  <div>
                    <p className="leading-relaxed text-malta">{paso.descripcion}</p>
                    {paso.duracion_min != null && (
                      <p className="mt-1 text-sm text-tostado">{paso.duracion_min} min</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="border-t border-linea bg-espuma/50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
            Valoraciones
          </h2>

          {usuario ? (
            <form onSubmit={enviarValoracion} className="mt-6 rounded-lg border border-linea bg-white p-6">
              <div className="flex flex-wrap items-center gap-4">
                <label htmlFor="nota" className="text-sm font-medium text-malta">
                  Tu nota
                </label>
                <select
                  id="nota"
                  value={nota}
                  onChange={(e) => setNota(Number(e.target.value))}
                  className="rounded-md border border-linea bg-white px-3 py-2 text-malta outline-none focus:border-ambar"
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Comentario (opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                className="mt-4 w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar"
              />
              {errorValoracion && (
                <p className="mt-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
                  {errorValoracion}
                </p>
              )}
              <button
                type="submit"
                disabled={enviando}
                className="mt-4 rounded-md bg-ambar px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
              >
                {enviando ? "Enviando…" : "Valorar"}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-tostado">
              <Link href="/login" className="text-ambar-oscuro hover:underline">Entra</Link>{" "}
              para dejar tu valoración.
            </p>
          )}

          {valoraciones.length > 0 && (
            <ul className="mt-8 space-y-4">
              {valoraciones.map((v) => (
                <li key={v.id} className="rounded-lg border border-linea bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-malta">★ {v.nota}/10</span>
                    <span className="text-xs text-tostado">
                      {new Date(v.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  {v.comentario && (
                    <p className="mt-2 leading-relaxed text-tostado">{v.comentario}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}