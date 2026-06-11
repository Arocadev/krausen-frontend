"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Ingrediente = { id: number; nombre: string; tipo: string };
type FilaIngrediente = { ingrediente_id: number; cantidad: string; unidad: string };
type FilaPaso = { descripcion: string; duracion_min: string };

function FormularioCerveza() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forkId = searchParams.get("fork");
  const { usuario, cargando } = useAuth();

  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<Ingrediente[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estilo, setEstilo] = useState("");
  const [litros, setLitros] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [amargor, setAmargor] = useState("");
  const [filas, setFilas] = useState<FilaIngrediente[]>([]);
  const [pasos, setPasos] = useState<FilaPaso[]>([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!cargando && !usuario) router.push("/login");
  }, [cargando, usuario, router]);

  useEffect(() => {
    api.get("/api/ingredientes/").then((res) => setIngredientesDisponibles(res.data));
  }, []);

  const [nombreOriginal, setNombreOriginal] = useState("");

  useEffect(() => {
    if (forkId) {
      api.get(`/api/cervezas/${forkId}`).then((res) => {
        setNombreOriginal(res.data.nombre);
      }).catch(() => {});
    }
  }, [forkId]);
  
  const agregarIngrediente = () =>
    setFilas([...filas, { ingrediente_id: 0, cantidad: "", unidad: "g" }]);

  const quitarIngrediente = (i: number) =>
    setFilas(filas.filter((_, idx) => idx !== i));

  const actualizarFila = (i: number, campo: keyof FilaIngrediente, valor: string) => {
    const nuevas = [...filas];
    nuevas[i] = { ...nuevas[i], [campo]: campo === "ingrediente_id" ? Number(valor) : valor } as FilaIngrediente;
    setFilas(nuevas);
  };

  const agregarPaso = () => setPasos([...pasos, { descripcion: "", duracion_min: "" }]);

  const quitarPaso = (i: number) => setPasos(pasos.filter((_, idx) => idx !== i));

  const actualizarPaso = (i: number, campo: keyof FilaPaso, valor: string) => {
    const nuevos = [...pasos];
    nuevos[i] = { ...nuevos[i], [campo]: valor };
    setPasos(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const body = {
        nombre,
        descripcion: descripcion || null,
        estilo: estilo || null,
        litros: litros ? Number(litros) : null,
        alcohol: alcohol ? Number(alcohol) : null,
        amargor: amargor ? Number(amargor) : null,
        parent_id: forkId ? Number(forkId) : null,
        ingredientes: filas
          .filter((f) => f.ingrediente_id && f.cantidad)
          .map((f) => ({
            ingrediente_id: f.ingrediente_id,
            cantidad: Number(f.cantidad),
            unidad: f.unidad,
          })),
        pasos: pasos
          .filter((p) => p.descripcion.trim())
          .map((p, i) => ({
            orden: i + 1,
            descripcion: p.descripcion,
            duracion_min: p.duracion_min ? Number(p.duracion_min) : null,
          })),
      };
      const res = await api.post("/api/cervezas/", body);
      router.push(`/cervezas/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "No se pudo publicar la receta");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando || !usuario) return null;

  const inputClase =
    "w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-espuma px-6 py-14">
      <div className="mx-auto max-w-2xl rounded-lg border border-linea bg-white p-10">
        <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">
          {forkId ? "Tu versión de la receta" : "Nueva receta"}
        </h1>
        <p className="mt-2 text-tostado">
          {forkId
            ? "Parte de la receta original y dale tu toque."
            : "Comparte tu elaboración con la comunidad."}
        </p>
        {nombreOriginal && (
            <p className="mt-3 rounded-md bg-espuma px-4 py-3 text-sm text-tostado">
              Basada en: <span className="font-medium text-malta">{nombreOriginal}</span>
            </p>
          )}

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-malta">Nombre *</label>
            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-malta">Descripción</label>
            <textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={inputClase} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Estilo</label>
              <input type="text" placeholder="IPA, Stout, Lager…" value={estilo} onChange={(e) => setEstilo(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Litros</label>
              <input type="number" min="1" value={litros} onChange={(e) => setLitros(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Alcohol (% vol.)</label>
              <input type="number" step="0.1" min="0" value={alcohol} onChange={(e) => setAlcohol(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Amargor (IBU)</label>
              <input type="number" min="0" value={amargor} onChange={(e) => setAmargor(e.target.value)} className={inputClase} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-malta">Ingredientes</label>
              <button type="button" onClick={agregarIngrediente} className="text-sm font-medium text-ambar-oscuro hover:underline">
                + Añadir
              </button>
            </div>
            {filas.map((fila, i) => (
              <div key={i} className="mt-3 flex gap-2">
                <select
                  value={fila.ingrediente_id}
                  onChange={(e) => actualizarFila(i, "ingrediente_id", e.target.value)}
                  className="flex-1 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar"
                >
                  <option value={0}>Selecciona…</option>
                  {ingredientesDisponibles.map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.nombre}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Cant."
                  value={fila.cantidad}
                  onChange={(e) => actualizarFila(i, "cantidad", e.target.value)}
                  className="w-24 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar"
                />
                <select
                  value={fila.unidad}
                  onChange={(e) => actualizarFila(i, "unidad", e.target.value)}
                  className="w-20 rounded-md border border-linea bg-white px-2 py-2 text-sm text-malta outline-none focus:border-ambar"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="ud">ud</option>
                </select>
                <button type="button" onClick={() => quitarIngrediente(i)} className="px-2 text-tostado hover:text-red-700">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-malta">Pasos de elaboración</label>
              <button type="button" onClick={agregarPaso} className="text-sm font-medium text-ambar-oscuro hover:underline">
                + Añadir
              </button>
            </div>
            {pasos.map((paso, i) => (
              <div key={i} className="mt-3 flex gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-espuma text-sm font-medium text-ambar-oscuro">
                  {i + 1}
                </span>
                <input
                  type="text"
                  placeholder="Describe el paso…"
                  value={paso.descripcion}
                  onChange={(e) => actualizarPaso(i, "descripcion", e.target.value)}
                  className="flex-1 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="min"
                  value={paso.duracion_min}
                  onChange={(e) => actualizarPaso(i, "duracion_min", e.target.value)}
                  className="w-20 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar"
                />
                <button type="button" onClick={() => quitarPaso(i)} className="px-2 text-tostado hover:text-red-700">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-ambar px-6 py-3 font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
          >
            {enviando ? "Publicando…" : "Publicar receta"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function NuevaCervezaPage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-tostado">Cargando…</p>}>
      <FormularioCerveza />
    </Suspense>
  );
}