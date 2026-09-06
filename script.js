document.getElementById('year').textContent = new Date().getFullYear();

const ticker = document.querySelector('.ticker');
const tickerText = ticker?.querySelector('span');

if (ticker && tickerText) {
  const items = tickerText.textContent
    .split('✦')
    .map((item) => item.trim())
    .filter(Boolean);

  const withoutBayArea = items.filter((item) => item.toUpperCase() !== 'BAY AREA');
  const hasBayArea = items.some((item) => item.toUpperCase() === 'BAY AREA');
  const orderedItems = hasBayArea ? [...withoutBayArea, 'BAY AREA'] : withoutBayArea;
  const loopText = `${orderedItems.join(' ✦ ')} ✦ `;

  tickerText.textContent = loopText;
  tickerText.classList.add('ticker-copy');

  if (!ticker.querySelector('.ticker-copy[aria-hidden="true"]')) {
    const duplicate = tickerText.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    ticker.appendChild(duplicate);
  }
}

// Keep the reCAPTCHA v3 badge inside the mailing-list form, left-aligned directly above Subscribe.
const placeRecaptchaBadge = () => {
  const form = document.querySelector('.live-signup .brevo-embed #sib-form');
  const badge = document.querySelector('.grecaptcha-badge');
  const submitButton = form?.querySelector('.sib-form-block__button');
  const submitRow = submitButton?.closest('[style*="padding"]') || submitButton?.parentElement?.parentElement;

  if (!form || !badge || !submitRow) return false;

  let slot = form.querySelector('.recaptcha-badge-slot');
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'recaptcha-badge-slot';
    slot.setAttribute('aria-label', 'reCAPTCHA protection');
  }

  if (slot.parentElement !== form || slot.nextElementSibling !== submitRow) {
    form.insertBefore(slot, submitRow);
  }

  if (badge.parentElement !== slot) slot.appendChild(badge);
  return true;
};

if (!placeRecaptchaBadge()) {
  const captchaObserver = new MutationObserver(() => {
    if (placeRecaptchaBadge()) captchaObserver.disconnect();
  });
  captchaObserver.observe(document.body, { childList: true, subtree: true });
}
