import { DraftBanner } from "@/components/layout/draft-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * The public site's chrome. The admin area sits outside this group and gets
 * its own layout, so the CMS never inherits the club header and footer.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DraftBanner />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
