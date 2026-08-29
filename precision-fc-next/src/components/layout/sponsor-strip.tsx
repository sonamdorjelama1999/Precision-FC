import Image from "next/image";

import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";
import { SPONSOR_TIER_LABEL, type Sponsor } from "@/types";

/**
 * The sponsor band. Principal partners render larger than the rest, which is
 * the whole point of the tier — a sponsor pays for prominence, not just for
 * being listed.
 *
 * Logos with no image fall back to the sponsor's name set in the display face,
 * so a half-filled CMS still looks deliberate.
 */
export function SponsorStrip({
  sponsors,
  onDark = false,
}: {
  sponsors: Sponsor[];
  onDark?: boolean;
}) {
  if (sponsors.length === 0) return null;

  const principal = sponsors.filter((s) => s.tier === "PRINCIPAL");
  const rest = sponsors.filter((s) => s.tier !== "PRINCIPAL");

  return (
    <section className={cn("py-12", onDark ? "bg-navy-800" : "bg-paper-2 border-y border-line")}>
      <Wrap>
        <Eyebrow onDark={onDark}>
          {principal.length ? SPONSOR_TIER_LABEL.PRINCIPAL : "Our partners"}
        </Eyebrow>

        {principal.length > 0 ? (
          <div className="mb-9 flex flex-wrap items-center gap-x-12 gap-y-6">
            {principal.map((sponsor) => (
              <SponsorLogo key={sponsor.id} sponsor={sponsor} onDark={onDark} large />
            ))}
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {rest.map((sponsor) => (
              <SponsorLogo key={sponsor.id} sponsor={sponsor} onDark={onDark} />
            ))}
          </div>
        ) : null}
      </Wrap>
    </section>
  );
}

function SponsorLogo({
  sponsor,
  onDark,
  large = false,
}: {
  sponsor: Sponsor;
  onDark: boolean;
  large?: boolean;
}) {
  const content = sponsor.logoUrl ? (
    <Image
      src={sponsor.logoUrl}
      alt={sponsor.name}
      width={large ? 220 : 150}
      height={large ? 88 : 60}
      className={cn(
        "w-auto object-contain transition-opacity",
        large ? "max-h-[68px]" : "max-h-[44px]",
        onDark && "brightness-0 invert",
      )}
    />
  ) : (
    <span
      className={cn(
        "font-display font-extrabold tracking-[-0.02em] uppercase",
        large ? "text-2xl" : "text-lg",
        onDark ? "text-white/80" : "text-ink-2",
      )}
    >
      {sponsor.name}
    </span>
  );

  if (!sponsor.websiteUrl) {
    return <div className="opacity-80">{content}</div>;
  }

  return (
    <a
      href={sponsor.websiteUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={sponsor.name}
      className="opacity-80 transition-opacity hover:opacity-100"
    >
      {content}
    </a>
  );
}
