import { useMemo, useState, type ReactNode } from "react";
import { LocateFixed, MapPin, Search, Tag, X } from "lucide-react";
import { NOTES } from "@/data/meta";
import { TOTAL_AREA_KM2, formatKm2, formatShare, kecamatan } from "@/data/sleman";
import { SlemanMap } from "@/components/sleman-map";

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        "inline-flex h-11 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors " +
        (pressed
          ? "border-primary bg-primary text-surface"
          : "border-line bg-surface text-ink hover:bg-primary-soft")
      }
    >
      {children}
    </button>
  );
}

export function SlemanExplorer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showPins, setShowPins] = useState(true);
  const [focusToken, setFocusToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [mapReady, setMapReady] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("id");
    if (!needle) return kecamatan;
    return kecamatan.filter((item) => item.name.toLocaleLowerCase("id").includes(needle));
  }, [query]);

  const active = kecamatan.find((item) => item.name === selected) ?? null;

  function choose(name: string) {
    setSelected(name);
    setFocusToken((value) => value + 1);
  }

  function clearSelection() {
    setSelected(null);
    setResetToken((value) => value + 1);
  }

  const detail = active ? (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Kecamatan</p>
          <h2 className="font-display text-2xl leading-tight text-ink">{active.name}</h2>
        </div>
        <button
          type="button"
          onClick={clearSelection}
          className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink hover:bg-primary-soft"
          aria-label="Tutup pilihan"
        >
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{NOTES[active.name]}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-primary-soft px-3 py-2">
          <dt className="text-xs text-muted">Luas perkiraan</dt>
          <dd className="font-medium tabular-nums text-ink">{formatKm2(active.areaKm2)}</dd>
        </div>
        <div className="rounded-xl bg-primary-soft px-3 py-2">
          <dt className="text-xs text-muted">Bagian kabupaten</dt>
          <dd className="font-medium tabular-nums text-ink">{formatShare(active.areaKm2)}</dd>
        </div>
      </dl>
    </div>
  ) : null;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink lg:h-dvh lg:overflow-hidden">
      <header className="z-30 shrink-0 border-b border-line bg-bg px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
              Daerah Istimewa Yogyakarta
            </p>
            <h1 className="font-display text-3xl leading-none text-ink sm:text-4xl">Kabupaten Sleman</h1>
          </div>
          <p className="hidden max-w-56 text-right text-sm text-muted sm:block">
            17 kecamatan · {formatKm2(TOTAL_AREA_KM2)}
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:min-h-0 lg:flex-row">
        <aside className="order-2 flex w-full flex-col gap-3 border-line px-4 py-4 lg:order-1 lg:min-h-0 lg:w-96 lg:shrink-0 lg:overflow-hidden lg:border-r lg:px-5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari kecamatan"
              aria-label="Cari kecamatan"
              className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-10 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
            />
          </div>

          <div className="hidden lg:block">{detail}</div>

          <ul className="kec-scroll flex flex-col gap-1 lg:min-h-0 lg:flex-1 lg:overflow-y-scroll">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-sm text-muted">Tidak ada kecamatan dengan nama itu.</li>
            ) : (
              filtered.map((item) => {
                const on = item.name === selected;
                const hot = item.name === hovered;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => choose(item.name)}
                      onMouseEnter={() => setHovered(item.name)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(item.name)}
                      onBlur={() => setHovered(null)}
                      className={
                        "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors " +
                        (on ? "bg-primary text-surface" : hot ? "bg-primary-soft text-ink" : "hover:bg-primary-soft")
                      }
                    >
                      <span
                        className="size-3 shrink-0 rounded-full border border-ink/20"
                        style={{ background: item.color }}
                        aria-hidden
                      />
                      <span className="flex-1 font-medium">{item.name}</span>
                      <span className={"text-xs tabular-nums " + (on ? "text-surface/80" : "text-muted")}>
                        {formatKm2(item.areaKm2)}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <p className="text-xs leading-relaxed text-muted">
            Garis di dalam peta adalah batas kecamatan. Luas dihitung dari poligon, perkiraan, bukan angka
            resmi BPS. Batas disederhanakan dari data administrasi Indonesia.
          </p>
        </aside>

        <section className="order-1 relative min-h-96 flex-1 lg:order-2 lg:min-h-0">
          <SlemanMap
            selected={selected}
            hovered={hovered}
            showLabels={showLabels}
            showPins={showPins}
            onSelect={choose}
            onHover={setHovered}
            focusToken={focusToken}
            resetToken={resetToken}
            readyTick={mapReady}
            onReady={() => setMapReady((value) => value + 1)}
          />

          <div className="absolute top-3 left-3 z-[500] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
            <Toggle pressed={showLabels} onClick={() => setShowLabels((value) => !value)}>
              <Tag className="size-4" />
              Nama
            </Toggle>
            <Toggle pressed={showPins} onClick={() => setShowPins((value) => !value)}>
              <MapPin className="size-4" />
              Penanda
            </Toggle>
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm font-medium text-ink hover:bg-primary-soft"
            >
              <LocateFixed className="size-4" />
              Seluruh wilayah
            </button>
          </div>

          {active ? <div className="absolute inset-x-3 bottom-3 z-[500] lg:hidden">{detail}</div> : null}
        </section>
      </div>
    </div>
  );
}
