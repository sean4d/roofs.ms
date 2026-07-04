import { EmergencyBanner } from "@/components/layout/emergency-banner";
import { TopBar } from "@/components/layout/top-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StickyMobileCTA } from "@/components/layout/sticky-mobile-cta";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { roofingContractorSchema } from "@/lib/schema";

/** Marketing shell: header, footer, sticky CTAs, smooth scroll, org schema. */
export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SmoothScrollProvider />
      <EmergencyBanner />
      <TopBar />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <StickyMobileCTA />
      <JsonLd data={roofingContractorSchema()} />
    </>
  );
}
