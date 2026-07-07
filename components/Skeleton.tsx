export function SkeletonTarjeta() {
  return (
    <div className="animate-pulse rounded-lg border border-linea bg-white p-5 sm:p-6">
      <div className="h-5 w-20 rounded-full bg-ambar/15" />
      <div className="mt-3 h-6 w-3/4 rounded bg-linea" />
      <div className="mt-2 h-4 w-full rounded bg-linea/70" />
      <div className="mt-1 h-4 w-2/3 rounded bg-linea/70" />
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-24 rounded bg-linea/60" />
        <div className="h-4 w-20 rounded bg-linea/60" />
      </div>
    </div>
  );
}

export function SkeletonDetalle() {
  return (
    <div className="animate-pulse">
      <section className="border-b border-linea bg-crema">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="h-6 w-20 rounded-full bg-ambar/15" />
          <div className="mt-3 h-10 w-2/3 rounded bg-linea" />
          <div className="mt-2 h-4 w-40 rounded bg-linea/60" />
          <div className="mt-4 h-4 w-full rounded bg-linea/70" />
          <div className="mt-1 h-4 w-3/4 rounded bg-linea/70" />
          <div className="mt-6 flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="h-3 w-16 rounded bg-linea/50" />
                <div className="h-5 w-12 rounded bg-linea" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 rounded-md bg-linea/60" />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="h-7 w-32 rounded bg-linea" />
            <div className="mt-5 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between py-3 border-b border-linea">
                  <div className="h-4 w-32 rounded bg-linea/70" />
                  <div className="h-4 w-16 rounded bg-linea/60" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-7 w-32 rounded bg-linea" />
            <div className="mt-5 space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-ambar/15" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full rounded bg-linea/70" />
                    <div className="h-4 w-2/3 rounded bg-linea/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function SkeletonRanking() {
  return (
    <div className="mt-8 min-h-[300px] space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-5 rounded-lg border border-linea bg-white p-5">
          <div className="h-10 w-10 shrink-0 rounded-full bg-ambar/15" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-linea" />
            <div className="h-3 w-32 rounded bg-linea/60" />
          </div>
          <div className="h-5 w-8 rounded bg-linea/60" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ n = 6 }: { n?: number }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <SkeletonTarjeta key={i} />
      ))}
    </div>
  );
}