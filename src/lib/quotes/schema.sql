-- Schema for the /quote estimating tool.
--
-- Applied by scripts/migrate.mjs, which is safe to run repeatedly: every
-- statement here is IF NOT EXISTS or otherwise idempotent.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Users
--
-- Accounts are self-serve but the email domain is checked server side, so the
-- only people who can create one are people who can already receive mail at
-- the company. There is no invite step and no password.
--
-- NOTE ON DELETION. Admins get a "remove" action for reps who quit, and it
-- sets active = false rather than deleting the row. A rep who leaves takes
-- their access with them immediately, but their customers, their quotes and
-- the history of who sent what all have to survive them. A hard delete would
-- cascade that away, and the first time somebody removed a rep at the end of a
-- good month the company would lose the month.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  name          text,
  role          text NOT NULL DEFAULT 'rep' CHECK (role IN ('admin', 'rep')),
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz
);

CREATE INDEX IF NOT EXISTS users_active_idx ON users (active, role);

-- ---------------------------------------------------------------------------
-- Sign-in tokens (magic links)
--
-- Only the SHA-256 of the emailed token is stored. A stolen database backup
-- therefore contains nothing anyone can sign in with, and a token is single
-- use: used_at is stamped the first time it is redeemed.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS login_tokens (
  token_hash  text PRIMARY KEY,
  email       text NOT NULL,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_tokens_email_idx ON login_tokens (email, created_at DESC);

-- ---------------------------------------------------------------------------
-- Customers: one row per address we have quoted or intend to.
--
-- owner_id is the rep who pinned it. Reps see only their own rows; admins see
-- everything. That rule lives in src/lib/quotes/auth.ts and is applied in
-- every query, never in the UI.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid NOT NULL REFERENCES users (id),
  address      text NOT NULL,
  city         text,
  state        text,
  postal       text,
  lat          double precision NOT NULL,
  lon          double precision NOT NULL,
  -- Google's stable id for the place, so the same house pinned twice by two
  -- reps can be spotted instead of quietly quoted twice at two prices.
  place_id     text,
  name         text,
  email        text,
  phone        text,
  status       text NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','quoted','contacted','appointment','sold','lost')),
  tags         text[] NOT NULL DEFAULT '{}',
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_owner_idx  ON customers (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS customers_status_idx ON customers (status, created_at DESC);
CREATE INDEX IF NOT EXISTS customers_place_idx  ON customers (place_id);
CREATE INDEX IF NOT EXISTS customers_tags_idx   ON customers USING gin (tags);

-- ---------------------------------------------------------------------------
-- Quotes: a priced estimate for a customer, at a moment in time.
--
-- The pricing INPUTS are stored alongside the outputs on purpose. Rate cards
-- change. Without the snapshot, a quote from March cannot be explained in
-- June, and "why did we tell them $9,232" has no answer.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     uuid NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES users (id),

  -- Measurement
  roof_sqft       numeric,
  squares         numeric,
  pitch_degrees   numeric,
  planes          integer,
  measure_source  text CHECK (measure_source IN ('solar','manual')),
  measure_quality text,

  -- Pricing inputs, snapshotted
  material        text,
  tear_off        boolean,
  stories         text,
  rate_card       jsonb,

  -- Pricing outputs
  price_low       integer,
  price_high      integer,
  price_shown     integer,
  monthly_low     integer,
  monthly_high    integer,

  -- Delivery
  pdf_url         text,
  sent_via        text CHECK (sent_via IN ('email','hand','mail')),
  sent_at         timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quotes_customer_idx ON quotes (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_creator_idx  ON quotes (created_by, created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_sent_idx     ON quotes (sent_at DESC) WHERE sent_at IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Roofr handoff queue.
--
-- Deliberately NOT every quote. The owner's instruction is that only closed
-- work goes to Roofr, so a row appears here when a customer is marked sold and
-- nowhere else. Kept as its own table rather than a flag so a failed push can
-- be retried and seen.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roofr_exports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  uuid NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','sent','failed','skipped')),
  attempts     integer NOT NULL DEFAULT 0,
  last_error   text,
  external_id  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS roofr_exports_customer_idx ON roofr_exports (customer_id);

-- ---------------------------------------------------------------------------
-- Cross-device sign-in.
--
-- The owner signed in on a laptop, opened the emailed link on his phone, and
-- the laptop sat on "check your email" forever. That is the normal failure of
-- a magic link: the browser that ASKED and the browser that OPENS are often
-- not the same one, because email is read on a phone.
--
-- pending_id is a random handle handed to the browser that made the request,
-- as an http-only cookie. When the link is opened ANYWHERE, claimed_by is
-- stamped with the user, and the original browser, which is polling, picks up
-- its own session. The link still works normally on the device that opened it.
-- ---------------------------------------------------------------------------
ALTER TABLE login_tokens ADD COLUMN IF NOT EXISTS pending_id text;
ALTER TABLE login_tokens ADD COLUMN IF NOT EXISTS claimed_by uuid REFERENCES users (id);
CREATE INDEX IF NOT EXISTS login_tokens_pending_idx ON login_tokens (pending_id);

-- ---------------------------------------------------------------------------
-- Shareable proposals.
--
-- A quote needs a link a homeowner can open without an account, for the email
-- and for the QR code on a printed piece. That link is the credential, so it
-- is 32 random bytes and it names nothing: no rep, no pipeline, no other
-- customer. Nullable because a quote only gets one when it is actually shared.
-- ---------------------------------------------------------------------------
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS public_token text;
CREATE UNIQUE INDEX IF NOT EXISTS quotes_public_token_idx ON quotes (public_token)
  WHERE public_token IS NOT NULL;

-- ---------------------------------------------------------------------------
-- When the aerial photograph was taken.
--
-- The proposal told homeowners their roof was "measured from current aerial
-- imagery". For most of this territory the imagery is from 2013 or 2019, so
-- that sentence was false on a document a customer keeps. Storing the date
-- lets the page state it instead of claiming freshness it does not have.
-- ---------------------------------------------------------------------------
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS imagery_date date;

-- ---------------------------------------------------------------------------
-- Estimates that came from the website rather than a rep.
--
-- The public instant estimator creates real customers and real quotes, but
-- there is no rep behind them. Rather than invent a fake user row to satisfy a
-- foreign key, ownership is nullable and NULL means "from the website".
--
-- That falls out correctly against the existing scoping rule: ownerScope()
-- returns null for an admin, so admins see website leads alongside everything
-- else, and a rep's scope never matches NULL, so website leads stay out of
-- their pipeline. Which is right: these belong to the office.
-- ---------------------------------------------------------------------------
ALTER TABLE customers ALTER COLUMN owner_id DROP NOT NULL;
ALTER TABLE quotes ALTER COLUMN created_by DROP NOT NULL;

-- ---------------------------------------------------------------------------
-- Company profile: everything on the proposal that the office should own.
--
-- Until now every value on a customer-facing estimate lived in
-- src/config/site.ts, which means changing a phone number required a code
-- change and a deploy. That is the wrong place for facts about the business.
--
-- A single row, id = 1, because there is one company. Every column is
-- NULLABLE and NULL means "use the value from site.ts", so the proposal keeps
-- working before anybody has opened the settings screen, and clearing a field
-- reverts to the built-in rather than blanking the document.
--
-- The logo is stored as a data URI in the row rather than in object storage.
-- It is one small image for one company, and putting it here means no bucket
-- to provision, no second set of credentials, and no separate thing to back
-- up. The upload route caps the size so this stays true.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_profile (
  id              integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  legal_name      text,
  display_name    text,
  phone           text,
  email           text,
  website         text,
  street          text,
  city            text,
  state           text,
  postal          text,
  license         text,
  warranty        text,
  financing_line  text,
  credentials     text[],
  headline        text,
  closing_line    text,
  accent_color    text,
  logo_data_uri   text,
  show_storms     boolean NOT NULL DEFAULT true,
  show_insurance  boolean NOT NULL DEFAULT true,
  show_financing  boolean NOT NULL DEFAULT true,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid REFERENCES users (id)
);
