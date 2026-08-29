import Image from "next/image";

import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME_FEATURES, type HomeFeature } from "@/data/club";
import { cn } from "@/lib/utils";

/**
 * The panels under the hero: a caption beside a poster.
 *
 * Sides alternate down the page — first poster right, next poster left — so a
 * run of panels reads as a rhythm rather than a stack of identical rows. On
 * phones they all collapse to caption-then-poster, since a mirrored order
 * would put one poster above its own caption and break the reading line.
 *
 * Light ground between the navy hero and the navy footer, so each poster
 * reads as a framed object instead of melting into the page.
 */
export function FeaturePosters() {
  return (
    <>
      {HOME_FEATURES.map((feature, index) => (
        <FeaturePoster
          key={feature.image.src}
          feature={feature}
          imageOnLeft={index % 2 === 1}
          isLast={index === HOME_FEATURES.length - 1}
        />
      ))}
    </>
  );
}

function FeaturePoster({
  feature,
  imageOnLeft,
  isLast,
}: {
  feature: HomeFeature;
  imageOnLeft: boolean;
  isLast: boolean;
}) {
  const { eyebrow, title, body, footnote, image } = feature;

  return (
    <section className={cn("pt-14 md:pt-20", isLast ? "pb-14 md:pb-20" : "pb-4 md:pb-6")}>
      <Wrap>
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className={cn(imageOnLeft && "lg:order-2")}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mb-5 text-[clamp(30px,4.4vw,46px)] font-black uppercase tracking-[-0.03em]">
              {title}
            </h2>
            <p className="mb-4 max-w-[46ch] text-[clamp(16px,1.5vw,18px)] text-ink-2">{body}</p>
            <p className="max-w-[46ch] text-[15px] text-ink-3">{footnote}</p>
          </div>

          <div
            className={cn(
              "justify-self-center",
              imageOnLeft ? "lg:order-1 lg:justify-self-start" : "lg:justify-self-end",
            )}
          >
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
