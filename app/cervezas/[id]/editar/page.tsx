"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Ingrediente = { id: number; nombre: string; tipo: string };
type FilaIngrediente = { ingrediente_id: number; cantidad: string; unidad: string };
type FilaPaso = { descripcion: string; duracion_min: string };

export default function EditarCervezaPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario, cargando } = useAuth();
  const t = useTranslations("formulario");

  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<Ingrediente[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estilo, setEstilo] = useState("");
  const [litros, setLitros] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [amargor, setAmargor] = useState("");
  const [diasFermentacion, setDiasFermentacion] = useState("");
  const [intervaloHoras, setIntervaloHoras] = useState("");
  const [filas, setFilas] = useState<FilaIngrediente[]>([]);
  const [pasos, setPasos] = useState<FilaPaso[]>([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);
  const inputImagenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!cargando && !usuario) router.push("/login");
  }, [cargando, usuario, router]);

  useEffect(() => {
    api.get("/api/ingredientes/").then((res) => setIngredientesDisponibles(res.data));
    api.get(`/api/cervezas/${id}`).then((res) => {
      const c = res.data;
      setNombre(c.nombre); setDescripcion(c.descripcion || ""); setEstilo(c.estilo || "");
      setLitros(c.litros?.toString() || ""); setAlcohol(c.alcohol?.toString() || "");
      setAmargor(c.amargor?.toString() || ""); setDiasFermentacion(c.dias_fermentacion?.toString() || "");
      setIntervaloHoras(c.intervalo_horas?.toString() || ""); setImagenActual(c.imagen_url || null);
      setFilas(c.ingredientes?.map((ing: any) => ({ ingrediente_id: ing.ingrediente.id, cantidad: ing.cantidad.toString(), unidad: ing.unidad })) || []);
      setPasos(c.pasos?.map((p: any) => ({ descripcion: p.descripcion, duracion_min: p.duracion_min?.toString() || "" })) || []);
      setCargandoDatos(false);
    }).catch(() => router.push("/"));
  }, [id]);

  const agregarIngrediente = () => setFilas([...filas, { ingrediente_id: 0, cantidad: "", unidad: "g" }]);
  const quitarIngrediente = (i: number) => setFilas(filas.filter((_, idx) => idx !== i));
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

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file); setImagenPreview(URL.createObjectURL(file));
  };

  const validar = (): string => {
    if (!nombre.trim()) return "El nombre es obligatorio.";
    if (!descripcion.trim()) return "La descripción es obligatoria.";
    if (!estilo) return "El estilo es obligatorio.";
    if (!litros || Number(litros) <= 0) return "Los litros son obligatorios y deben ser mayores que 0.";
    if (!alcohol || Number(alcohol) < 0) return "El alcohol es obligatorio.";
    if (!amargor || Number(amargor) < 0) return "El amargor (IBU) es obligatorio.";
    if (filas.filter((f) => f.ingrediente_id && f.cantidad).length === 0) return "Añade al menos un ingrediente.";
    if (pasos.filter((p) => p.descripcion.trim()).length === 0) return "Añade al menos un paso de elaboración.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) { setError(errorValidacion); return; }
    setError(""); setEnviando(true);
    try {
      await api.put(`/api/cervezas/${id}`, {
        nombre, descripcion, estilo,
        litros: Number(litros), alcohol: Number(alcohol), amargor: Number(amargor),
        parent_id: null,
        dias_fermentacion: diasFermentacion ? Number(diasFermentacion) : null,
        intervalo_horas: intervaloHoras ? Number(intervaloHoras) : null,
        ingredientes: filas.filter((f) => f.ingrediente_id && f.cantidad).map((f) => ({ ingrediente_id: f.ingrediente_id, cantidad: Number(f.cantidad), unidad: f.unidad })),
        pasos: pasos.filter((p) => p.descripcion.trim()).map((p, i) => ({ orden: i + 1, descripcion: p.descripcion, duracion_min: p.duracion_min ? Number(p.duracion_min) : null })),
      });
      if (imagenFile) {
        const formData = new FormData();
        formData.append("imagen", imagenFile);
        await api.post(`/api/cervezas/${id}/imagen`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      router.push(`/cervezas/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "No se pudo guardar la receta");
    } finally { setEnviando(false); }
  };

  if (cargando || !usuario || cargandoDatos) return null;

  const inputClase = "w-full rounded-md border border-linea bg-white px-4 py-2.5 text-malta outline-none transition-colors focus:border-ambar";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-espuma px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl rounded-lg border border-linea bg-white p-6 sm:p-10">
        <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta">{t("editarTitulo")}</h1>
        <p className="mt-2 text-tostado">{t("editarSubtitulo")}</p>
        <p className="mt-4 text-xs text-tostado/60">{t("camposObligatorios")}</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-malta">{t("nombre")}</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} placeholder={t("nombrePlaceholder")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-malta">{t("descripcion")}</label>
            <textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={inputClase} placeholder={t("descripcionPlaceholder")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-malta">{t("imagen")}</label>
            {(imagenPreview || imagenActual) ? (
              <div className="relative">
                <img src={imagenPreview || `http://127.0.0.1:8000${imagenActual}`} alt="Preview" className="h-48 w-full rounded-lg border border-linea object-cover" />
                <button type="button" onClick={() => { setImagenPreview(null); setImagenFile(null); setImagenActual(null); if (inputImagenRef.current) inputImagenRef.current.value = ""; }} className="absolute right-2 top-2 rounded-full bg-malta/70 px-2 py-0.5 text-xs text-white hover:bg-malta">
                  {t("quitarImagen")}
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => inputImagenRef.current?.click()} className="flex h-32 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-linea bg-espuma/30 text-sm text-tostado transition-colors hover:border-ambar hover:text-ambar-oscuro">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                {t("subirImagen")}
              </button>
            )}
            <input ref={inputImagenRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImagenChange} className="hidden" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("estilo")}</label>
              <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={inputClase}>
                <option value="">{t("seleccionaEstilo")}</option>
                <option value="IPA">IPA</option><option value="APA">APA (American Pale Ale)</option>
                <option value="Stout">Stout</option><option value="Porter">Porter</option>
                <option value="Lager">Lager</option><option value="Pilsner">Pilsner</option>
                <option value="Wheat Beer">Wheat Beer</option><option value="Belgian Ale">Belgian Ale</option>
                <option value="Saison">Saison</option><option value="Amber Ale">Amber Ale</option>
                <option value="Red Ale">Red Ale</option><option value="Brown Ale">Brown Ale</option>
                <option value="Barley Wine">Barley Wine</option><option value="Sour">Sour</option>
                <option value="Gose">Gose</option><option value="Kölsch">Kölsch</option>
                <option value="Märzen">Märzen</option><option value="Bock">Bock</option>
                <option value="Dunkel">Dunkel</option><option value="Hefeweizen">Hefeweizen</option>
                <option value="Tripel">Tripel</option><option value="Dubbel">Dubbel</option>
                <option value="NEIPA">NEIPA (New England IPA)</option>
                <option value="Imperial Stout">Imperial Stout</option><option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("litros")}</label>
              <input type="number" min="1" value={litros} onChange={(e) => setLitros(e.target.value)} className={inputClase} placeholder="20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("alcohol")}</label>
              <input type="number" step="0.1" min="0" value={alcohol} onChange={(e) => setAlcohol(e.target.value)} className={inputClase} placeholder="5.5" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("amargor")}</label>
              <input type="number" min="0" max="120" value={amargor} onChange={(e) => setAmargor(e.target.value)} className={inputClase} placeholder="40" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("diasFermentacion")}</label>
              <select value={diasFermentacion} onChange={(e) => setDiasFermentacion(e.target.value)} className={inputClase}>
                <option value="">{t("sinSeguimiento")}</option>
                <option value="1">1 día</option><option value="3">3 días</option>
                <option value="5">5 días</option><option value="7">7 días</option>
                <option value="10">10 días</option><option value="14">14 días</option>
                <option value="21">21 días</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-malta">{t("registrarCada")}</label>
              <select value={intervaloHoras} onChange={(e) => setIntervaloHoras(e.target.value)} className={inputClase} disabled={!diasFermentacion}>
                <option value="">{t("selecciona")}</option>
                <option value="4">4 horas</option><option value="6">6 horas</option>
                <option value="8">8 horas</option><option value="12">12 horas</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-malta">{t("ingredientes")}</label>
              <button type="button" onClick={agregarIngrediente} className="text-sm font-medium text-ambar-oscuro hover:underline">{t("anadir")}</button>
            </div>
            {filas.map((fila, i) => (
              <div key={i} className="mt-3 flex gap-2">
                <select value={fila.ingrediente_id} onChange={(e) => actualizarFila(i, "ingrediente_id", e.target.value)} className="flex-1 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar">
                  <option value={0}>{t("seleccionaIngrediente")}</option>
                  {ingredientesDisponibles.map((ing) => <option key={ing.id} value={ing.id}>{ing.nombre}</option>)}
                </select>
                <input type="number" step="0.1" min="0" placeholder={t("cant")} value={fila.cantidad} onChange={(e) => actualizarFila(i, "cantidad", e.target.value)} className="w-24 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar" />
                <select value={fila.unidad} onChange={(e) => actualizarFila(i, "unidad", e.target.value)} className="w-20 rounded-md border border-linea bg-white px-2 py-2 text-sm text-malta outline-none focus:border-ambar">
                  <option value="g">g</option><option value="kg">kg</option>
                  <option value="ml">ml</option><option value="l">L</option><option value="ud">ud</option>
                </select>
                <button type="button" onClick={() => quitarIngrediente(i)} className="px-2 text-tostado hover:text-red-700">✕</button>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-malta">{t("pasos")}</label>
              <button type="button" onClick={agregarPaso} className="text-sm font-medium text-ambar-oscuro hover:underline">{t("anadir")}</button>
            </div>
            {pasos.map((paso, i) => (
              <div key={i} className="mt-3 flex gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ambar/15 text-sm font-medium text-ambar-oscuro">{i + 1}</span>
                <input type="text" placeholder={t("describePaso")} value={paso.descripcion} onChange={(e) => actualizarPaso(i, "descripcion", e.target.value)} className="flex-1 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar" />
                <input type="number" min="0" placeholder={t("min")} value={paso.duracion_min} onChange={(e) => actualizarPaso(i, "duracion_min", e.target.value)} className="w-20 rounded-md border border-linea bg-white px-3 py-2 text-sm text-malta outline-none focus:border-ambar" />
                <button type="button" onClick={() => quitarPaso(i)} className="px-2 text-tostado hover:text-red-700">✕</button>
              </div>
            ))}
          </div>
          {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <button type="submit" disabled={enviando} className="rounded-md bg-ambar px-6 py-3 font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60">
            {enviando ? t("guardando") : t("guardar")}
          </button>
        </form>
      </div>
    </main>
  );
}