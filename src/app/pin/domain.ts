/**
 * The company mailbox domain, safe to import from a client component.
 *
 * src/lib/quotes/auth.ts is marked "server-only" because it holds the session
 * signing key and the database calls, so importing it into the sign-in form
 * would fail the build. This one constant is needed in the browser purely to
 * render a placeholder and a hint, and it is not a secret: anyone can read the
 * company's email address off the website footer.
 *
 * It is the SERVER's copy in auth.ts that decides who gets in. This is a label.
 */
export const ALLOWED_DOMAIN = "southeastroofing.llc";
