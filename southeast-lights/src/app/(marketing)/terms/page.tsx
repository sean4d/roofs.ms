import { LegalPage } from "@/components/shared/legal-page";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: "Terms of Service | Southeast Lights",
  description: "Terms governing use of the Southeast Lights website and our estimates.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      sections={[
        {
          heading: "Estimates are estimates",
          body: `Any figure produced by the estimator on this site, or quoted before we have reviewed your property, is a ballpark only. Final pricing is confirmed in a written estimate after we review the property and complete the design. Nothing on this website constitutes a binding offer.`,
        },
        {
          heading: "Seasonal lighting remains our property",
          body: `Seasonal holiday lighting installed under our service model remains the property of ${siteConfig.legalName}. The seasonal price covers design, materials, installation, in-season maintenance, removal and storage. Customers do not acquire ownership of seasonal lighting materials. Permanent architectural lighting is different: that system becomes the property of the customer once installed and paid for.`,
        },
        {
          heading: "Payment",
          body: `We accept ${siteConfig.payment.accepted.join(", ").toLowerCase()}. ${siteConfig.payment.deposit}. ${siteConfig.payment.balance}.`,
        },
        {
          heading: "Scheduling and takedown",
          body: `Installation and takedown dates are scheduled in advance but are not guaranteed, as weather and crew availability affect them. Takedown normally begins in mid-January. You may request a preferred window and we will accommodate it where we can.`,
        },
        {
          heading: "Maintenance",
          body: `In-season maintenance of normal failures is included at no additional charge. Damage caused deliberately, or by a third party, is handled case by case and may be chargeable.`,
        },
        {
          heading: "Website content",
          body: `Photography marked as development or demo content is illustrative and does not depict Southeast Lights installations. Content on this site is provided for information and may change without notice.`,
        },
        {
          heading: "Contact",
          body: `${siteConfig.legalName} d/b/a ${siteConfig.name}. ${siteConfig.email} · ${siteConfig.phone.display}.`,
        },
      ]}
    />
  );
}
