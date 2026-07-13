// components/footer.tsx — Global site footer — server component

import Link from "next/link";

const CONTACT_EMAIL = "contact.provibal@gmail.com";

const PRODUCT_LINKS = [
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/pricing" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
] as const;

const SUPPORT_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "Email", href: `mailto:${CONTACT_EMAIL}` },
] as const;

const linkClass =
  "text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            {href.startsWith("mailto:") ? (
              <a href={href} className={linkClass}>
                {label}
              </a>
            ) : (
              <Link href={href} className={linkClass}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg)] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Row 1 — Logo + tagline */}
        <div className="mb-10">
          <Link
            href="/"
            className="font-serif text-xl font-bold text-[var(--text-primary)]"
          >
            Provibal
          </Link>
          <p className="mt-2 max-w-xs text-sm text-[var(--text-muted)]">
            Generate production-grade AI prompts for any project.
          </p>
        </div>

        {/* Row 2 — Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <FooterLinkColumn title="Product" links={PRODUCT_LINKS} />
          <FooterLinkColumn title="Legal" links={LEGAL_LINKS} />
          <FooterLinkColumn title="Support" links={SUPPORT_LINKS} />
        </div>

        {/* Row 3 — Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[var(--border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--text-muted)]">
            © 2025 Provibal. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">Built with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
