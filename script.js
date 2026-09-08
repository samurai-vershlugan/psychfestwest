document.getElementById('year').textContent = new Date().getFullYear();

const ticker = document.querySelector('.ticker');
const tickerText = ticker?.querySelector('span');

if (ticker && tickerText) {
  tickerText.classList.add('ticker-copy');

  if (!ticker.querySelector('.ticker-copy[aria-hidden="true"]')) {
    const duplicate = tickerText.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    ticker.appendChild(duplicate);
  }
}

const countryCodeToFlag = (code) => {
  if (!/^[A-Z]{2}$/.test(code)) return '';
  return String.fromCodePoint(...[...code].map(char => 127397 + char.charCodeAt(0)));
};

/* Brevo country-picker polish. */
const polishBrevoCountryPicker = () => {
  const select = document.querySelector('.live-signup select[name="SMS__COUNTRY_CODE"]');

  if (select) {
    const usOption = [...select.options].find(option => /\bUS$/.test(option.textContent.trim()));
    if (usOption) {
      if (usOption !== select.firstElementChild) select.insertBefore(usOption, select.firstElementChild);
      usOption.selected = true;
      select.value = usOption.value;
    }
  }

  document.querySelectorAll('.sib-flag').forEach(flag => {
    const codeClass = [...flag.classList].find(name => /^sib-flag-[a-z]{2}$/.test(name));
    if (!codeClass) return;

    const code = codeClass.slice(-2).toUpperCase();
    const emoji = countryCodeToFlag(code);
    if (!emoji) return;

    if (flag.textContent !== emoji) flag.textContent = emoji;
    flag.style.setProperty('background', 'none', 'important');
    flag.style.setProperty('width', '26px', 'important');
    flag.style.setProperty('height', '24px', 'important');
    flag.style.setProperty('display', 'inline-flex', 'important');
    flag.style.setProperty('align-items', 'center', 'important');
    flag.style.setProperty('justify-content', 'center', 'important');
    flag.style.setProperty('font-size', '20px', 'important');
    flag.style.setProperty('line-height', '1', 'important');
    flag.style.setProperty('flex', '0 0 26px', 'important');
  });

  const list = document.querySelector('.sib-sms-select__list');
  const usItem = list?.querySelector('li .sib-flag-us')?.closest('li');

  if (list && usItem && usItem !== list.firstElementChild) {
    list.insertBefore(usItem, list.firstElementChild);
  }
};

/*
 * Restore the exact placement approach that previously worked: move Google's
 * real reCAPTCHA badge into a slot immediately above Brevo's submit row.
 */
const placeRecaptchaBadge = () => {
  const form = document.querySelector('.live-signup .brevo-embed #sib-form');
  const badge = document.querySelector('.grecaptcha-badge');
  const submitButton = form?.querySelector('.sib-form-block__button');
  const submitRow = submitButton?.closest('[style*="padding"]') || submitButton?.parentElement?.parentElement;

  if (!form || !badge || !submitRow) return false;

  let slot = form.querySelector('.recaptcha-badge-slot');
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'recaptcha-badge-slot sib-form-block';
    slot.setAttribute('aria-label', 'reCAPTCHA protection');
  }

  if (slot.parentElement !== form || slot.nextElementSibling !== submitRow) {
    form.insertBefore(slot, submitRow);
  }

  if (badge.parentElement !== slot) {
    slot.appendChild(badge);
  }

  /* Same visual treatment used by the previously working version. */
  slot.style.setProperty('display', 'flex', 'important');
  slot.style.setProperty('justify-content', 'flex-start', 'important');
  slot.style.setProperty('min-height', '44px', 'important');
  slot.style.setProperty('margin-top', '8px', 'important');
  slot.style.setProperty('overflow', 'visible', 'important');

  badge.style.setProperty('position', 'relative', 'important');
  badge.style.setProperty('left', 'auto', 'important');
  badge.style.setProperty('right', 'auto', 'important');
  badge.style.setProperty('top', 'auto', 'important');
  badge.style.setProperty('bottom', 'auto', 'important');
  badge.style.setProperty('transform', 'scale(.72)', 'important');
  badge.style.setProperty('transform-origin', 'top left', 'important');
  badge.style.setProperty('box-shadow', 'none', 'important');
  badge.style.setProperty('visibility', 'visible', 'important');
  badge.style.setProperty('opacity', '1', 'important');

  return true;
};

polishBrevoCountryPicker();

if (!placeRecaptchaBadge()) {
  const captchaObserver = new MutationObserver(() => {
    polishBrevoCountryPicker();
    if (placeRecaptchaBadge()) captchaObserver.disconnect();
  });
  captchaObserver.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => captchaObserver.disconnect(), 15000);
}

/* Brevo builds the country menu lazily when opened, so keep only that polish observed. */
const countryObserver = new MutationObserver(() => {
  polishBrevoCountryPicker();
});
countryObserver.observe(document.body, { childList: true, subtree: true });
