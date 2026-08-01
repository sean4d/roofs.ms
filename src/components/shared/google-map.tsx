/**
 * Lightweight Google Map embed: a keyless Google Maps iframe (no API key, no
 * billing, no third-party script). `query` is anything Maps can resolve: a
 * business name + address pins the profile exactly. Lazy-loaded so it never
 * costs the initial page load.
 */
export function GoogleMapEmbed({
  query,
  title,
  className,
}: {
  query: string;
  title: string;
  className?: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  );
}
