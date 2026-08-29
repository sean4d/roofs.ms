import { LegalPage } from "@/components/shared/legal-page";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Our commitment to keeping the Southeast Lights website usable for everyone.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      path="/accessibility"
      sections={[
        {
          heading: "Our commitment",
          body: `We want this site to be usable by everyone, including people using screen readers, keyboard navigation, or assistive technology. We build toward WCAG 2.1 AA and treat accessibility failures as bugs rather than enhancements.`,
        },
        {
          heading: "What we have done",
          body: `Semantic HTML throughout, visible keyboard focus on every interactive element, labeled form fields with errors announced to assistive technology, alternative text on meaningful images, and color contrast checked against the dark palette this site uses. Decorative motion, including the snow effect on the home page, is disabled entirely when your device requests reduced motion, and is not shown on mobile at all.`,
        },
        {
          heading: "Known limitations",
          body: `The lighting estimator is a visual tool by nature. Every control has a text label and the running total is available as text, so the estimate can be built and read without seeing the illustration. If any part of it is difficult to use, please tell us and we will take the details over the phone.`,
        },
        {
          heading: "Tell us",
          body: `If you have trouble using any part of this site, contact us at ${siteConfig.email} or ${siteConfig.phone.display}. We will help you directly and fix the problem.`,
        },
      ]}
    />
  );
}
