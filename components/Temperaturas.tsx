"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  cervezaId: string;
  esAutor: boolean;
};

type InfoFermentacion = {
  configurada: boolean;
  dias: number;
  intervalo_horas: number;
  total_slots: number;
  registrados: number;
};

type Temperatura = {
  slot: number;
  temperatura: number;
};

export default function Temperaturas({ cervezaId, esAutor }: Props) {
  const [info, setInfo] = useState<InfoFermentacion | null>(null);
  const [temperaturas, setTemperaturas] = useState<Temperatura[]>([]);
  const [slotActual, setSlotActual] = useState(0);
  const [tempInput, setTempInput] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargar = () => {
    api.get(`/api/cervezas/${cervezaId}/fermentacion`).then((res) => setInfo(res.data)).catch(() => {});
    api.get(`/api/cervezas/${cervezaId}/temperaturas`).then((res) => setTemperaturas(res.data)).catch(() => {});
  };

  useEffect(() => {
    cargar();
  }, [cervezaId]);

  if (!info || !info.configurada) return null;

  const slotLabel = (slot: number) => {
    const horaTotal = slot * info.intervalo_horas;
    const dia = Math.floor(horaTotal / 24) + 1;
    const hora = horaTotal % 24;
    return `D${dia} ${hora}h`;
  };

  const datosGrafica = Array.from({ length: info.total_slots }, (_, i) => {
    const reg = temperaturas.find((t) => t.slot === i);
    return {
      nombre: slotLabel(i),
      temp: reg ? reg.temperatura : null,
    };
  });

  const registrar = async () => {
    if (!tempInput) return;
    setEnviando(true);
    try {
      await api.post(`/api/cervezas/${cervezaId}/temperaturas`, {
        slot: slotActual,
        temperatura: Number(tempInput),
      });
      setTempInput("");
      setSlotActual((prev) => Math.min(prev + 1, info.total_slots - 1));
      cargar();
    } catch {
    } finally {
      setEnviando(false);
    }
  };

  const slotsRegistrados = new Set(temperaturas.map((t) => t.slot));

  return (
    <section className="border-t border-linea">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="font-[family-name:var(--font-lora)] text-2xl font-semibold text-malta">
          Fermentación
        </h2>
        <p className="mt-2 text-sm text-tostado">
          {info.dias} días · cada {info.intervalo_horas} horas · {info.registrados}/{info.total_slots} registros
        </p>

        {temperaturas.length > 0 && (
          <div className="mt-8 rounded-lg border border-linea bg-white p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={datosGrafica}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DCCB" />
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 11, fill: "#5C3A21" }}
                  interval={Math.max(Math.floor(info.total_slots / 12) - 1, 0)}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#5C3A21" }}
                  domain={["auto", "auto"]}
                  unit="°C"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF6EF",
                    border: "1px solid #E5DCCB",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                  formatter={(value: any) => [`${value}°C`, "Temperatura"]}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#C8861B"
                  strokeWidth={2}
                  dot={{ fill: "#9A6612", r: 3 }}
                  activeDot={{ fill: "#C8861B", r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {esAutor && info.registrados < info.total_slots && (
          <div className="mt-6 rounded-lg border border-linea bg-white p-6">
            <p className="mb-4 text-sm font-medium text-malta">Registrar temperatura</p>
            <div className="flex items-center gap-3">
              <select
                value={slotActual}
                onChange={(e) => setSlotActual(Number(e.target.value))}
                className="rounded-md border border-linea bg-white px-3 py-2.5 text-sm text-malta outline-none focus:border-ambar"
              >
                {Array.from({ length: info.total_slots }, (_, i) => (
                  <option key={i} value={i}>
                    {slotLabel(i)} {slotsRegistrados.has(i) ? "✓" : ""}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.1"
                min="0"
                max="40"
                placeholder="°C"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                className="w-24 rounded-md border border-linea bg-white px-3 py-2.5 text-sm text-malta outline-none focus:border-ambar"
              />
              <button
                onClick={registrar}
                disabled={enviando || !tempInput}
                className="rounded-md bg-ambar px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ambar-oscuro disabled:opacity-60"
              >
                {enviando ? "…" : "Registrar"}
              </button>
            </div>
          </div>
        )}

        {esAutor && info.registrados >= info.total_slots && (
          <p className="mt-6 text-sm text-tostado">Todos los registros completados.</p>
        )}
      </div>
    </section>
  );
}