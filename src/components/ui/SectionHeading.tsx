export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl px-4 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-champagne">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-ivory">{title}</h2>
      {description && <p className="mt-4 text-muted">{description}</p>}
    </div>
  );
}