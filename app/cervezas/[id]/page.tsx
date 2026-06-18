"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Temperaturas from "@/components/Temperaturas";
import ArbolForks from "@/components/ArbolForks";

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
  username: string | null;
  created_at: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
};

export default function DetalleCervezaPage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [cerveza, setCerveza] = useState<Cerveza | null>(null);
  const [cargando, setCargando] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [dado, setDado] = useState(false);
  const [enviandoLike, setEnviandoLike] = useState(false);
  const [tieneForks, setTieneForks] = useState(false);

  const cargarDatos = () => {
    api.get(`/api/cervezas/${id}`)
      .then((res) => setCerveza(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));

    api.get(`/api/cervezas/${id}/me-gusta`)
      .then((res) => setTotalLikes(res.data.total))
      .catch(() => {});

    api.get(`/api/cervezas/tiene-forks/${id}`)
      .then((res) => setTieneForks(res.data.tiene_forks))
      .catch(() => {});
  };

  const cargarEstadoLike = () => {
    if (usuario) {
      api.get(`/api/cervezas/${id}/me-gusta/estado`)
        .then((res) => {
          setDado(res.data.dado);
          setTotalLikes(res.data.total);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (id) {
      cargarDatos();
      cargarEstadoLike();
    }
  }, [id, usuario]);

  const toggleLike = async () => {
    if (enviandoLike) return;
    setEnviandoLike(true);
    try {
      if (dado) {
        await api.delete(`/api/cervezas/${id}/me-gusta`);
        setDado(false);
        setTotalLikes((prev) => prev - 1);
      } else {
        await api.post(`/api/cervezas/${id}/me-gusta`);
        setDado(true);
        setTotalLikes((prev) => prev + 1);
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || "";
      if (msg.includes("propia")) alert(msg);
    } finally {
      setEnviandoLike(false);
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
      <section className="border-b border-linea bg-crema">
        <div className="mx-auto max-w-4xl px-6 py-14">
          {cerveza.estilo && (
            <span className="inline-block rounded-full bg-ambar/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ambar-oscuro">
              {cerveza.estilo}
            </span>
          )}
          <h1 className="mt-4 font-[family-name:var(--font-lora)] text-4xl font-semibold text-malta">
            {cerveza.nombre}
          </h1>

          {cerveza.username && (
            <p className="mt-3 text-sm text-tostado">
              Creada por <span className="font-medium text-malta">{cerveza.username}</span>
              {" · "}
              {new Date(cerveza.created_at).toLocaleDateString("es-ES")}
            </p>
          )}

          {cerveza.descripcion && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-tostado">
              {cerveza.descripcion}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-tostado">
            {cerveza.alcohol != null && <span>{cerveza.alcohol}% vol.</span>}
            {cerveza.amargor != null && <span>{cerveza.amargor} IBU</span>}
            {cerveza.litros != null && <span>{cerveza.litros} L</span>}
            {cerveza.parent_id != null && (
              <Link href={`/cervezas/${cerveza.parent_id}`} className="text-ambar-oscuro hover:underline">
                Versión de otra receta
              </Link>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            {usuario && (
              <button
                onClick={toggleLike}
                disabled={enviandoLike}
                className={`flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors ${
                  dado
                    ? "border-ambar bg-ambar text-white hover:bg-ambar-oscuro"
                    : "border-tostado/30 text-tostado hover:border-ambar hover:text-ambar-oscuro"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={dado ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {totalLikes}
              </button>
            )}
            {!usuario && totalLikes > 0 && (
              <span className="flex items-center gap-2 text-sm text-tostado">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {totalLikes} me gusta{totalLikes !== 1 ? "s" : ""}
              </span>
            )}

            {usuario && (
              <Link
                href={`/cervezas/nueva?fork=${cerveza.id}`}
                className="rounded-md border border-tostado/30 px-5 py-2.5 text-sm font-medium text-tostado transition-colors hover:border-ambar hover:text-ambar-oscuro"
              >
                Hacer mi versión
              </Link>
            )}

            {usuario && cerveza.usuario_id === usuario.id && !tieneForks && (
              <Link
                href={`/cervezas/${cerveza.id}/editar`}
                className="rounded-md border border-tostado/30 px-5 py-2.5 text-sm font-medium text-tostado transition-colors hover:border-ambar hover:text-ambar-oscuro"
              >
                Editar
              </Link>
            )}
            {usuario && cerveza.usuario_id === usuario.id && tieneForks && (
              <span className="text-sm text-tostado/60">
                No editable — tiene versiones
              </span>
            )}
          </div>
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
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ambar/15 text-sm font-medium text-ambar-oscuro">
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
    
      <Temperaturas
        cervezaId={id as string}
        esAutor={!!usuario && cerveza.usuario_id === usuario.id}
      />
      <ArbolForks cervezaId={id as string} />
    </main>
  );
}