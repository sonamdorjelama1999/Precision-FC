import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";

/** The dark banner that opens every page except the home page. */
export function PageHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-14 pb-13 text-white">
      <div className="pfc-page-glow absolute inset-0" aria-hidden />
      <Wrap className="relative">
        <Eyebrow onDark>{eyebrow}</Eyebrow>
        <h1 className="text-[clamp(34px,5.4vw,58px)] font-black uppercase tracking-[-0.03em]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3.5 max-w-[60ch] text-white/70">{description}</p>
        ) : null}
      </Wrap>
    </section>
  );
}
