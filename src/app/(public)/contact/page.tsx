import { ContactForm } from "@/components/contact/contact-form";
import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CLUB } from "@/data/club";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Precision FC — sponsorship, media or general enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="Get in touch"
        title="Contact"
        description="Sponsorship, media or just to say hello — send a message and the club will get back to you."
      />

      <section className="py-12 md:py-17">
        <Wrap>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
            <div className="rounded border border-line bg-paper-2 p-[22px]">
              <Eyebrow>Club details</Eyebrow>
              <ul>
                <li className="border-b border-line py-3">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                    Email
                  </span>
                  <a
                    href={`mailto:${CLUB.email}`}
                    className="font-semibold text-teal-dark hover:underline"
                  >
                    {CLUB.email}
                  </a>
                </li>
                <li className="border-b border-line py-3">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                    Ground
                  </span>
                  <b className="font-semibold">{CLUB.ground}</b>
                </li>
                <li className="py-3">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                    Based in
                  </span>
                  <b className="font-semibold">{CLUB.city}</b>
                </li>
              </ul>
            </div>

            <ContactForm />
          </div>
        </Wrap>
      </section>
    </>
  );
}
