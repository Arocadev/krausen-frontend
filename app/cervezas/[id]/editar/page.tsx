"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Ingrediente = { id: number; nombre: string; tipo: string };
type FilaIngrediente = { ingrediente_id: number; cantidad: string; unidad: string };
type FilaPaso = { descripcion: string; duracion_min: string };

export default function EditarCervezaPage() {
  const { id } = useParams();
  const router = useRouter();
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
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    if (!cargando && !usuario) router.push("/login");
  }, [cargando, usuario, router]);

  useEffect(() => {
    api.get("/api/ingredientes/").then((res) => setIngredientesDisponibles(res.data));
    api.get(`/api/cervezas/${id}`).then((res) => {
      const c = res.data;
      setNombre(c.nombre);
      setDescripcion(c.descripcion || "");
      setEstilo(c.estilo || "");
      setLitros(c.litros?.toString() || "");
      setAlcohol(c.alcohol?.toString() || "");
      setAmargor(c.amargor?.toString() || "");
      setFilas(
        c.ingredientes?.map((ing: any) => ({
          ingrediente_id: ing.ingrediente.id,
          cantidad: ing.cantidad.toString(),
          unidad: ing.unidad,
        })) || []
      );
      setPasos(
        c.pasos?.map((p: any) => ({
          descripcion: p.descripcion,
          duracion_min: p.duracion_min?.toString() || "",
        })) || []
      );
      setCargandoDatos(false);
    }).catch(() => router.push("/"));
  }, [id]);

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
      await api.put(`/api/cervezas/${id}`, {
        nombre,
        descripcion: descripcion || null,
        estilo: estilo || null,
        litros: litros ? Number(litros) : null,
        alcohol: alcohol ? Number(alcohol) : null,
        amargor: amargor ? Number(amargor) : null,
        parent_id: null,
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
      });
      router.push(`/cervezas/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "No se pudo guardar la receta");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando || !usuario || cargandoDatos) return null;

  const inputClase =
    "w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar";

  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 py-14">
      <div className="mx-auto max-w-2xl rounded-lg border border-linea bg-white p-10">
        <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">
          Editar receta
        </h1>
        <p className="mt-2 text-tostado">
          Corrige los datos de tu elaboración.
        </p>

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
              <label className="mb-1.5 block text-sm font-medium text-malta">Litros</label>
              <input type="number" min="1" value={litros} onChange={(e) => setLitros(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Alcohol (% vol.)</label>
              <input type="number" step="0.1" min="0" value={alcohol} onChange={(e) => setAlcohol(e.target.value)} className={inputClase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">Amargor (IBU)</label>
              <input type="number" min="0" max="120" value={amargor} onChange={(e) => setAmargor(e.target.value)} className={inputClase} />
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
                  type="number" step="0.1" min="0" placeholder="Cant."
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
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ambar/15 text-sm font-medium text-ambar-oscuro">
                  {i + 1}
                </span>
                <input
                  type="text" placeholder="Describe el paso…"
                  value={paso.descripcion}
                  onChange={(e) => actualizarPaso(i, "descripcion", e.target.value)}
                  className="flex-1 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar"
                />
                <input
                  type="number" min="0" placeholder="min"
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
            {enviando ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </main>
  );
}