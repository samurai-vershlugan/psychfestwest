document.getElementById('year').textContent = new Date().getFullYear();

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

// Keep the mobile event identity balanced and force the title to exactly two lines.
function applyMobileLayoutFixes() {
  if (document.getElementById('pfw-mobile-fixes')) return;

  const style = document.createElement('style');
  style.id = 'pfw-mobile-fixes';
  style.textContent = `
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

    @media (max-width: 760px) {
      header {
        gap: 8px !important;
      }

      header .pfw {
        padding: 8px !important;
        font-size: 10px !important;
        flex: 0 0 auto !important;
      }

      header nav {
        gap: 10px !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        min-width: 0 !important;
      }

      /* Keep Instagram out of the compact mobile nav; it remains in the footer. */
      header nav a:last-child {
        display: none !important;
      }

      header nav a {
        display: inline !important;
        white-space: nowrap !important;
        font-size: 9px !important;
        letter-spacing: .05em !important;
      }

      .flyer-feature {
        grid-template-columns: minmax(105px, 42%) minmax(0, 1fr) !important;
        gap: 16px !important;
      }

      .flyer-feature .flyer-info {
        min-width: 0 !important;
      }

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
    }

    .pfw-subscribe-success {
      padding: 32px 0 18px;
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

// Keep Brevo submission on-page. The remote response loads into a hidden iframe,
// then the form is replaced by a simple thank-you message.
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

  form.addEventListener('submit', () => {
    submitted = true;
  });

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

fixBrevoFieldColors();
applyMobileLayoutFixes();
keepBrevoSuccessInline();

window.addEventListener('load', () => {
  fixBrevoFieldColors();
  applyMobileLayoutFixes();
  keepBrevoSuccessInline();
});
