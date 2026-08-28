import "server-only";

import { siteConfig } from "@/config/site";

/**
 * Which host this deployment should put in its own links.
 *
 * The sign-in link has to point at the deployment that MINTED it. Hardcoding
 * siteConfig.url breaks every preview: a branch deploy would email a link to
 * roofs.ms/pin/signin/..., which is production, which does not have the branch
 * on it, so the link 404s and the feature looks broken when it is fine.
 *
 * Reading the request's own Host header would also work and is what most
 * examples do, but the Host header is attacker controlled. On an endpoint that
 * emails somebody a credential, that is a way to have our own mail server send
 * a working sign-in link pointing at somebody else's domain. So the host comes
 * from Vercel's own environment instead, which nothing outside the platform
 * can set.
 */
export function baseUrl(): string {
  if (process.env.VERCEL_ENV === "production") return siteConfig.url;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return siteConfig.url;
}
