// Same artwork as src/app/icon.svg
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <rect width="512" height="512" rx="112" fill="#141414" />
      <g fill="#cb171e">
        <rect x="112" y="124" width="200" height="44" rx="22" />
        <circle cx="352" cy="146" r="22" />
        <rect x="176" y="234" width="152" height="44" rx="22" />
        <circle cx="368" cy="256" r="22" />
        <rect x="176" y="344" width="224" height="44" rx="22" />
      </g>
      <rect x="112" y="234" width="28" height="154" rx="14" fill="#ef4444" opacity=".45" />
    </svg>
  );
}
