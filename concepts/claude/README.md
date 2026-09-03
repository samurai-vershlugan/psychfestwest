# Psych Fest West — Site Guide

This is a single, self-contained file (`index.html`) plus a temp logo (`logo.svg` / `favicon.png` / `social-card.png`). No build tools, no framework, nothing to install. You can open `index.html` directly in a browser to preview it.

## What's in the box

- `index.html` — the whole site (structure, styling, and behavior in one file)
- `logo.svg` — the temp mark, used as the favicon and as the base for the social sharing image
- `favicon.png`, `social-card.png` — PNG exports of the logo for browser tabs and link previews

## 1. Hosting it (GitHub Pages)

1. Create a new GitHub repo (e.g. `psychfestwest-site`) and upload these files to the root.
2. In the repo, go to **Settings → Pages**, set the source branch to `main` and folder to `/root`.
3. Under **Settings → Pages → Custom domain**, add `psychfestwest.com` and follow GitHub's DNS instructions (an A record or CNAME with your domain registrar). GitHub Pages is free and handles HTTPS automatically once the domain is verified.

## 2. Turning on RSVP + mailing list capture (Supabase)

Right now the RSVP and mailing-list forms are live in the design but not connected to anywhere — they'll show a friendly "not connected yet" message until you plug in a free Supabase project. Takes about 10 minutes:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run:

   ```sql
   create table rsvps (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     email text not null,
     event_title text not null,
     created_at timestamp with time zone default now()
   );

   create table subscribers (
     id uuid default gen_random_uuid() primary key,
     email text not null,
     created_at timestamp with time zone default now()
   );

   alter table rsvps enable row level security;
   alter table subscribers enable row level security;

   create policy "Allow public insert" on rsvps for insert to anon with check (true);
   create policy "Allow public insert" on subscribers for insert to anon with check (true);
   ```

3. Go to **Settings → API** in Supabase, copy your **Project URL** and **anon public key**.
4. Open `index.html`, find this block near the bottom (search for `SUPABASE_URL`):

   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```

   Paste your values in. Save, re-upload, done. RSVPs and signups will now land in your Supabase tables, viewable anytime in the Supabase **Table Editor**.

## 3. Turning on analytics (Google Analytics — free)

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com) and grab your **Measurement ID** (looks like `G-XXXXXXXXXX`).
2. In `index.html`, find the commented-out block near the top (search for `GOOGLE ANALYTICS`) and uncomment it, replacing `G-XXXXXXXXXX` with your real ID in both places.

If you'd rather not deal with Google, [Plausible](https://plausible.io) or [Fathom](https://usefathom.com) are simple, privacy-friendly, low-cost alternatives — just swap in their one-line script tag in the same spot.

## 4. Updating event info yourself

Search `index.html` for `const EVENTS = [`. Each event is one block like this:

```js
{
  presents: "Psych Fest West Presents",
  title: "Gizz Night",
  date: "Sunday, October 18",
  time: "3–8 PM",
  location: "Bay Area, CA",
  venue: "Venue TBA",
  description: "Our inaugural gathering featuring...",
  price: "FREE",
  rsvpUrl: "#rsvp-gizz-night"
}
```

- **To edit the current event:** just change the text between the quotes.
- **To add a future event:** copy the whole `{ ... }` block, paste it above or below the existing one (separated by a comma), and edit the details. It'll automatically appear on the page as its own flyer card with its own RSVP form — no other changes needed.
- **To remove an event:** delete its block.

No other part of the file needs to change for routine updates.

## 5. Replacing the temp logo later

`logo.svg` is intentionally simple — a placeholder mark, not a finished brand identity. When you have a real logo:

- Replace `logo.svg`, `favicon.png`, and `social-card.png` with your new files (same filenames keeps everything else working automatically), or
- Update the `<link rel="icon">` and `og:image` tags near the top of `index.html` if the new filenames are different.

## Design notes (for whoever touches this next)

- **Colors:** ink `#12191C`, ink-soft/teal `#1B3236`, paper `#F3EBDA`, coral-deep `#C15A3A`, coral `#E87A52`, gold `#F0B04E`, teal `#3E8E86`.
- **Type:** Unbounded Black (the PSYCH FEST WEST wordmark only) + Fraunces (section headlines, italic taglines) + Space Grotesk (body/UI), all loaded free from Google Fonts.
- **The wordmark's "misprint" look** is three offset text layers with blend modes — it's CSS, not an image, so it stays crisp at any size.
- **The hero background** (starfield → sunset sky → sun → layered hills) is one inline SVG with gradient-filled hill shapes for a soft rim-light blend at the horizon — no image files, loads instantly.
