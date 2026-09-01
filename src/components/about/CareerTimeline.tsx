const entries = [
  { year: "1996", role: "Cambridge, History of Art" },
  { year: "1997", role: "Christie's, London — European Furniture & Works of Art" },
  { year: "2010", role: "The Royal Household — Surveyor of The Queen's Works of Art" },
  { year: "2021", role: "Duke's, Dorchester — 2021–2022" },
  { year: "2022", role: "Gurr Johns — Director of Decorative Arts" },
  { year: "2024", role: "Independent practice — Shaftesbury, Dorset" },
];

export function CareerTimeline() {
  return (
    <div>
      {entries.map(({ year, role }) => (
        <div key={year} className="flex gap-8 py-5 border-t border-[var(--rule)] last:border-b">
          <span className="small-caps text-sm text-[var(--muted)] w-12 shrink-0 pt-0.5">
            {year}
          </span>
          <span className="text-[var(--ink-soft)]">{role}</span>
        </div>
      ))}
    </div>
  );
}
