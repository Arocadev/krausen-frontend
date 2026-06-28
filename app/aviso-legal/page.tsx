"use client";

import { useTranslations } from "next-intl";

export default function AvisoLegalPage() {
  const t = useTranslations("avisoLegal");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-lora)] text-3xl font-semibold text-malta sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-3 text-sm text-tostado">{t("actualizacion")}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-tostado">
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">1. Titular del sitio</h2>
          <p className="mt-2">Krausen es una plataforma web de carácter educativo y de demostración, desarrollada como proyecto de portfolio por Alejandro Rodríguez (ArocaDev). No constituye una actividad comercial ni empresarial.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">2. Objeto</h2>
          <p className="mt-2">Krausen es una plataforma comunitaria que permite a los usuarios registrados compartir, descubrir y versionar recetas de cerveza artesanal. El acceso y uso de la plataforma implica la aceptación de las presentes condiciones.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">3. Propiedad intelectual</h2>
          <p className="mt-2">Las recetas publicadas por los usuarios son propiedad de sus respectivos autores. Al publicar una receta en Krausen, el usuario concede a la plataforma una licencia no exclusiva para mostrar dicho contenido. El código fuente de la plataforma está disponible en GitHub bajo los términos de su licencia correspondiente.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">4. Protección de datos</h2>
          <p className="mt-2">Los datos personales recogidos (email, nombre de usuario) se utilizan exclusivamente para el funcionamiento de la plataforma. No se ceden a terceros ni se utilizan con fines comerciales. El usuario puede solicitar la eliminación de su cuenta y datos en cualquier momento.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">5. Responsabilidad</h2>
          <p className="mt-2">Krausen no se hace responsable del contenido publicado por los usuarios. Las recetas publicadas son responsabilidad exclusiva de sus autores. La plataforma se reserva el derecho de eliminar contenido que incumpla las normas de uso.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">6. Consumo responsable</h2>
          <p className="mt-2">Krausen es una plataforma dedicada a la elaboración artesanal de cerveza. Todo el contenido está dirigido exclusivamente a mayores de 18 años. Krausen promueve el consumo responsable de alcohol.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-lora)] text-xl font-semibold text-malta">7. Modificaciones</h2>
          <p className="mt-2">Krausen se reserva el derecho de modificar el presente aviso legal en cualquier momento. Las modificaciones serán efectivas desde su publicación en la plataforma.</p>
        </section>
      </div>
    </main>
  );
}