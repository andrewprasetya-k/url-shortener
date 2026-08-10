export function Logo(props: React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href="/dashboard" className="inline-flex items-center gap-2" {...props}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 120 120"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="120" height="120" rx="28" fill="#2563eb" />
        <path
          d="M30 32 L90 32 L46 88 L90 88"
          fill="none"
          stroke="#ffffff"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-semibold text-gray-900 tracking-tight">
        Zippr
      </span>
    </a>
  );
}
