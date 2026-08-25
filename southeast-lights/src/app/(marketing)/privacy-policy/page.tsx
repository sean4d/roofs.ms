import { LegalPage } from "@/components/shared/legal-page";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: "Privacy Policy | Southeast Lights",
  description: "How Southeast Lights collects, uses and protects your information.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      sections={[
        {
          heading: "What we collect",
          body: `When you request a quote we collect the information you give us: your name, phone number, email address, property address, and anything you tell us about the project. We also record how you arrived at the site (the page you landed on, the referring site, and any campaign parameters in the link) so we can understand which marketing works.`,
        },
        {
          heading: "How we use it",
          body: `To prepare your estimate, to contact you about it, and to carry out the work if you go ahead. We use aggregate site analytics to understand how the site performs. We do not sell your information, and we do not share it except with the service providers who help us operate: our CRM, our email delivery provider, and our analytics provider.`,
        },
        {
          heading: "Text messages",
          body: `Our office line accepts text messages. If you text us, standard message and data rates from your carrier apply. We use your number to respond to your enquiry and to coordinate scheduling and service.`,
        },
        {
          heading: "Cookies and analytics",
          body: `We use Google Analytics to understand aggregate site usage. We store attribution details for your visit in your browser's session storage, which is cleared when you close the tab. We do not run advertising pixels on this site.`,
        },
        {
          heading: "Your choices",
          body: `You can ask us to delete the information we hold about you at any time by emailing ${siteConfig.email}. If you have asked for a quote and changed your mind, tell us and we will remove your details.`,
        },
        {
          heading: "Contact",
          body: `Questions about this policy: ${siteConfig.email}, or ${siteConfig.phone.display}. ${siteConfig.legalName} d/b/a ${siteConfig.name}, ${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}.`,
        },
      ]}
    />
  );
}
