import Image from "next/image";

import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME_FEATURE } from "@/data/club";

/**
 * The panel under the hero: caption left, poster right.
 *
 * Light ground between the navy hero and the navy footer, so the poster reads
 * as a framed object rather than melting into the page. The two columns are
 * vertically centred, which keeps the text optically anchored against a tall
 * portrait image instead of floating at the top of it.
 */
export function FeaturePoster() {
  const { eyebrow, title, body, footnote, image } = HOME_FEATURE;

  return (
    <section className="py-14 md:py-20">
      <Wrap>
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mb-5 text-[clamp(30px,4.4vw,46px)] font-black uppercase tracking-[-0.03em]">
              {title}
            </h2>
            <p className="mb-4 max-w-[46ch] text-[clamp(16px,1.5vw,18px)] text-ink-2">{body}</p>
            <p className="max-w-[46ch] text-[15px] text-ink-3">{footnote}</p>
          </div>

          <div className="justify-self-center lg:justify-self-end">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 1024px) min(92vw, 520px), 40vw"
              className="h-auto w-full max-w-[520px] rounded-card shadow-[0_30px_60px_-24px_rgba(7,21,35,0.55)]"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}
