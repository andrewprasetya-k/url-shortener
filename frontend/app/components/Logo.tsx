export function Logo(props: React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href="/dashboard" className="inline-flex items-center gap-2" {...props}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 28 28"
        fill="none"
        className="text-blue-600 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M11 17H8a5 5 0 0 1 0-10h3"
          stroke="currentColor"
          strokeWidth="3.25"
          strokeLinecap="round"
        />
        <path
          d="M17 7h3a5 5 0 0 1 0 10h-3"
          stroke="currentColor"
          strokeWidth="3.25"
          strokeLinecap="round"
        />
        <path
          d="M10 12h8"
          stroke="currentColor"
          strokeWidth="3.25"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-semibold text-gray-900 tracking-tight">
        Zippr
      </span>
    </a>
  );
}
