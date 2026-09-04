document.getElementById('year').textContent = new Date().getFullYear();

// Keep the original hero tagline.
const heroTagline = document.querySelector('.tagline');
if (heroTagline) heroTagline.textContent = 'COSMIC VIBES BEYOND REALITY!';

// Update the lower-page community line from POINT to JOURNEY without changing the rest of the sentence.
function replacePointWithJourney() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (/\bPOINT\b/.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(/\bPOINT\b/g, 'JOURNEY');
    }
  }
}

const button = document.getElementById('signup-button');
if (button && button.getAttribute('href').startsWith('SET-')) {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Connect your Brevo signup form before publishing. See README.md.');
  });
}

// Force the Brevo text fields to use the same light treatment as the phone field.
function fixBrevoFieldColors() {
  document.querySelectorAll('.live-signup .brevo-embed .entry__field').forEach((field) => {
    field.style.setProperty('background', '#fff', 'important');
    field.style.setProperty('border-color', '#cfc4c8', 'important');
  });

  document.querySelectorAll('.live-signup .brevo-embed .input').forEach((input) => {
    input.style.setProperty('background', '#fff', 'important');
    input.style.setProperty('color', '#12081e', 'important');
  });
}

function applyMobileLayoutFixes() {
  if (document.getElementById('pfw-mobile-fixes')) return;

  const style = document.createElement('style');
  style.id = 'pfw-mobile-fixes';
  style.textContent = `
    .chips { display: none !important; }

    /* Highlight BE ONE using the site's pink-to-purple palette. */
    .be-one {
      background: linear-gradient(90deg, #ff5fc8 0%, #8d66ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent !important;
      -webkit-text-fill-color: transparent;
    }

    .live-signup .brevo-embed .sib-sms-field .entry__specification {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      font-size: 12px !important;
      line-height: 1.4 !important;
      white-space: normal !important;
      word-break: normal !important;
      overflow-wrap: normal !important;
    }

    .live-signup .brevo-embed .sib-sms-field .entry__specification::after {
      content: none !important;
      display: none !important;
    }

    @keyframes pfwTickerScroll {
      from { transform: translateX(100vw); }
      to { transform: translateX(-100%); }
    }

    @media (max-width: 760px) {
      header {
        gap: 12px !important;
      }

      header .pfw {
        padding: 9px !important;
        font-size: 10.5px !important;
        flex: 0 0 auto !important;
      }

      header nav {
        gap: 12px !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex-wrap: nowrap !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }

      header nav a {
        display: inline !important;
        white-space: nowrap !important;
        font-size: 10px !important;
        letter-spacing: .055em !important;
      }

      header nav a:last-child {
        display: inline !important;
        font-size: 0 !important;
      }

      header nav a:last-child::after {
        content: "IG ↗";
        font: 500 10px 'DM Mono', monospace;
        letter-spacing: .055em;
        white-space: nowrap;
      }

      .ticker {
        position: relative !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        color: transparent !important;
        min-height: 44px !important;
      }
      .ticker::after {
        content: "PSYCH ROCK ✦ COMMUNITY ✦ CRAFT BEER ✦ VINYL ✦ LIVE MUSIC ✦ STRANGE HAPPENINGS ✦ NORTHERN CALIFORNIA ✦";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color: #0b0710;
        white-space: nowrap;
        animation: pfwTickerScroll 18s linear infinite;
      }

      .flyer-feature {
        grid-template-columns: minmax(105px, 42%) minmax(0, 1fr) !important;
        gap: 16px !important;
      }
      .flyer-feature .flyer-info { min-width: 0 !important; }
      .flyer-feature .flyer-info h3 {
        font-size: clamp(18px, 5vw, 22px) !important;
        line-height: .95 !important;
        letter-spacing: -.045em !important;
        max-width: 100% !important;
        white-space: nowrap !important;
      }
      .flyer-actions .btn {
        white-space: nowrap !important;
        font-size: 9px !important;
        padding: 0 12px !important;
        min-height: 44px !important;
      }

      .live-signup {
        padding: 28px 24px 24px !important;
      }
      .live-signup .brevo-embed {
        margin-top: 8px !important;
      }
      .live-signup .brevo-embed .sib-form {
        padding: 0 !important;
      }
      .live-signup .brevo-embed #sib-form-container,
      .live-signup .brevo-embed #sib-container {
        padding: 0 !important;
        margin: 0 !important;
      }
      .live-signup .brevo-embed .sib-form-block {
        padding-top: 6px !important;
        padding-bottom: 6px !important;
      }
      .live-signup .brevo-embed .form__entry {
        margin: 0 !important;
      }
      .live-signup .brevo-embed .entry__label {
        margin-bottom: 4px !important;
      }
      .live-signup .brevo-embed .entry__specification {
        margin-top: 4px !important;
      }
      .live-signup .brevo-embed .sib-form-block__button {
        margin-top: 2px !important;
      }
      .live-signup > .note {
        margin: 10px 0 0 !important;
      }
    }

    .pfw-subscribe-success {
      padding: 24px 0 12px;
      text-align: center;
      color: #12081e;
      font-family: 'Space Grotesk', sans-serif;
    }
    .pfw-subscribe-success strong {
      display: block;
      font-family: 'Archivo Black', sans-serif;
      font-size: clamp(24px, 4vw, 34px);
      line-height: 1;
      margin-bottom: 10px;
    }
    .pfw-subscribe-success span {
      font-size: 14px;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);
}

function keepBrevoSuccessInline() {
  const form = document.getElementById('sib-form');
  const embed = document.querySelector('.live-signup .brevo-embed');
  if (!form || !embed || form.dataset.pfwInlineSuccess === 'true') return;

  form.dataset.pfwInlineSuccess = 'true';

  const frame = document.createElement('iframe');
  frame.name = 'pfw-brevo-submit-frame';
  frame.setAttribute('aria-hidden', 'true');
  frame.style.display = 'none';
  document.body.appendChild(frame);

  form.setAttribute('target', frame.name);
  let submitted = false;
  form.addEventListener('submit', () => { submitted = true; });

  frame.addEventListener('load', () => {
    if (!submitted) return;
    embed.innerHTML = `
      <div class="pfw-subscribe-success" role="status" aria-live="polite">
        <strong>THANK YOU FOR SUBSCRIBING.</strong>
        <span>You’re on the Psych Fest West mailing list.</span>
      </div>
    `;
  });
}

replacePointWithJourney();
fixBrevoFieldColors();
applyMobileLayoutFixes();
keepBrevoSuccessInline();

window.addEventListener('load', () => {
  replacePointWithJourney();
  fixBrevoFieldColors();
  applyMobileLayoutFixes();
  keepBrevoSuccessInline();
});
