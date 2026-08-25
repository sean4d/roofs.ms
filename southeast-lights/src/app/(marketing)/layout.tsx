import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessSchema } from "@/lib/seo";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* One business entity, declared once, site-wide. */}
      <JsonLd data={localBusinessSchema()} />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
