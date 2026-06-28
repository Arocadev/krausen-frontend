import Link from "next/link";

const faqs = [
  {
    pregunta: "¿Qué es Krausen?",
    respuesta: "Krausen es una plataforma comunitaria para compartir, descubrir y versionar recetas de cerveza artesanal. El nombre viene del término cervecero 'krausen', que describe la espuma de fermentación que se forma durante el proceso de elaboración.",
  },
  {
    pregunta: "¿Necesito una cuenta para ver las recetas?",
    respuesta: "No. Puedes explorar todas las recetas publicadas sin necesidad de registrarte. Sin embargo, para crear recetas, dar me gusta, comentar o hacer versiones necesitarás una cuenta.",
  },
  {
    pregunta: "¿Qué es un fork o versión de una receta?",
    respuesta: "Un fork es tu propia versión de una receta existente. Puedes tomar cualquier receta de la comunidad como base y modificarla a tu gusto. La receta original queda vinculada y se muestra el árbol de versiones.",
  },
  {
    pregunta: "¿Puedo editar mi receta después de publicarla?",
    respuesta: "Sí, puedes editar tu receta mientras no tenga versiones (forks) hechas por otros usuarios. Una vez que alguien haya creado una versión de tu receta, no podrás editarla para mantener la coherencia del árbol de versiones.",
  },
  {
    pregunta: "¿Qué es el seguimiento de fermentación?",
    respuesta: "Al crear una receta puedes configurar un período de fermentación (días e intervalo de horas). Esto te permite registrar la temperatura de fermentación en cada slot de tiempo y ver la evolución en una gráfica.",
  },
  {
    pregunta: "¿Cómo funciona el ranking?",
    respuesta: "El ranking mensual muestra las 10 recetas que han recibido más me gustas durante el mes en curso. Se actualiza en tiempo real.",
  },
  {
    pregunta: "¿Puedo desactivar una receta?",
    respuesta: "Sí. En lugar de eliminarla, puedes desactivar una receta para que deje de aparecer en los listados públicos. Tú seguirás viéndola en 'Mis recetas' y podrás reactivarla cuando quieras.",
  },
  {
    pregunta: "¿Cómo recupero mi contraseña?",
    respuesta: "En la página de login encontrarás el enlace '¿Olvidaste tu contraseña?'. Introduce tu email y recibirás un enlace para restablecerla.",
  },
  {
    pregunta: "¿Los ingredientes son fijos o puedo añadir los míos?",
    respuesta: "Actualmente los ingredientes disponibles son los que hay en el catálogo de la plataforma (47 ingredientes entre maltas, lúpulos, levaduras y adjuntos). Si necesitas un ingrediente que no está disponible, puedes solicitarlo a través de los administradores.",
  },
  {
    pregunta: "¿Es gratuito?",
    respuesta: "Sí, Krausen es completamente gratuito. No hay planes de pago ni funciones de pago.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta sm:text-4xl">
        Preguntas frecuentes
      </h1>
      <p className="mt-3 text-tostado">
        Todo lo que necesitas saber sobre Krausen.
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-linea bg-white p-6">
            <h2 className="font-[family-name:var(--font-lora)] text-lg font-semibold text-malta">
              {faq.pregunta}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-tostado">
              {faq.respuesta}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-tostado">
        ¿Tienes alguna otra pregunta?{" "}
        <Link href="/recetas" className="font-medium text-ambar-oscuro hover:underline">
          Explora las recetas
        </Link>{" "}
        o{" "}
        <Link href="/registro" className="font-medium text-ambar-oscuro hover:underline">
          crea tu cuenta
        </Link>.
      </p>
    </main>
  );
}