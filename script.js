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
 * Keep Google's real reCAPTCHA badge physically inside the form. Google may
 * recreate or move the badge after initial load, so this stays synchronized
 * instead of disconnecting after the first successful placement.
 */
const placeRecaptchaBadge = () => {
  const form = document.querySelector('.live-signup .brevo-embed #sib-form');
  const submitButton = form?.querySelector('.sib-form-block__button');
  const submitRow = submitButton?.closest('[style*="padding"]') || submitButton?.parentElement?.parentElement;
  if (!form || !submitRow) return false;

  let slot = form.querySelector('.recaptcha-badge-slot');
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'recaptcha-badge-slot sib-form-block';
    slot.setAttribute('aria-label', 'reCAPTCHA protection');
    form.insertBefore(slot, submitRow);
  } else if (slot.nextElementSibling !== submitRow) {
    form.insertBefore(slot, submitRow);
  }

  const badges = [...document.querySelectorAll('.grecaptcha-badge')];
  if (!badges.length) return false;

  badges.forEach(badge => {
    if (badge.parentElement !== slot) slot.appendChild(badge);

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
  });

  return true;
};

const syncFormPolish = () => {
  polishBrevoCountryPicker();
  placeRecaptchaBadge();
};

syncFormPolish();
window.addEventListener('load', syncFormPolish);

/* Brevo and Google both add DOM after page load, so keep these two pieces synced. */
const formObserver = new MutationObserver(() => {
  syncFormPolish();
});
formObserver.observe(document.body, { childList: true, subtree: true });

/* Backup for Google moving the badge without a useful child-list mutation. */
window.setInterval(placeRecaptchaBadge, 1000);
