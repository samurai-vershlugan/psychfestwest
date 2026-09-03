# Psych Fest West Website v1

## Best setup
Host the website free on GitHub Pages and keep GoDaddy only for the domain/DNS. Use Brevo for the mailing list.

## Connect Brevo
1. Create a free Brevo account.
2. Go to Marketing > Forms > Sign-up > Create sign-up form.
3. Choose Full page / embedded.
4. Recommended fields: Email (required), First name (optional), City or ZIP (optional).
5. Turn on double opt-in if desired.
6. Copy Brevo's embed code or hosted form URL.
7. In index.html search for `SET-YOUR-BREVO-FORM-LINK-HERE`.
8. For the fastest launch, replace that text with Brevo's hosted form URL.
9. Better: replace the whole mailing-list placeholder inside `<div class="signup">` with Brevo's embedded form code.

## Publish on GitHub Pages
1. Create a public GitHub repository named `psychfestwest`.
2. Upload index.html, style.css, script.js and CNAME.
3. Repository > Settings > Pages.
4. Source: Deploy from a branch. Choose `main` and `/ (root)`.
5. Under Custom domain, enter `psychfestwest.com`.
6. Enable Enforce HTTPS when available.

## Point GoDaddy to GitHub
In GoDaddy DNS, remove/replace records currently pointing psychfestwest.com to the GoDaddy landing page.
Follow GitHub's current Pages DNS instructions for an apex domain and set `www` as a CNAME to your `USERNAME.github.io` hostname.
GitHub recommends also verifying the domain with the TXT record provided in GitHub Pages settings.

## Before publishing
Update:
- VENUE TBA once confirmed
- Brevo form/link
- Instagram link if needed
- Any wording you want changed

## Why no Supabase yet?
Brevo already manages contacts, consent/unsubscribe and email campaigns. Supabase becomes useful later for RSVPs, event data, member profiles or a more customized application.
