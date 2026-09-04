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

// Fix two mobile layout issues caused by Brevo's generated styles and the two-column event header.
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
      .flyer-feature .flyer-info {
        min-width: 0 !important;
      }

      .flyer-feature .flyer-info h3 {
        font-size: clamp(21px, 6vw, 28px) !important;
        line-height: .95 !important;
        letter-spacing: -.045em !important;
        max-width: 100% !important;
      }
    }
  `;
  document.head.appendChild(style);
}

fixBrevoFieldColors();
applyMobileLayoutFixes();
window.addEventListener('load', () => {
  fixBrevoFieldColors();
  applyMobileLayoutFixes();
});
