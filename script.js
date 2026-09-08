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
 * The Brevo embed already has a reCAPTCHA marker row directly above SUBSCRIBE.
 * Keep Google's real badge attached to <body>, but position it in document
 * coordinates instead of viewport coordinates. This makes it scroll naturally
 * with the form rather than floating/bouncing while the page moves.
 */
const positionRecaptchaBadge = () => {
  const marker = document.querySelector('.live-signup .brevo-embed .g-recaptcha-v3');
  const anchorRow = marker?.parentElement;
  const badge = document.querySelector('.grecaptcha-badge');
  const field = document.querySelector('.live-signup .brevo-embed .entry__field');

  if (!anchorRow || !badge || !field) return false;

  anchorRow.style.setProperty('min-height', '72px', 'important');
  anchorRow.style.setProperty('position', 'relative', 'important');

  const rowRect = anchorRow.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();

  const left = fieldRect.left - bodyRect.left;
  const top = rowRect.top - bodyRect.top + 6;

  badge.style.setProperty('position', 'absolute', 'important');
  badge.style.setProperty('left', `${left}px`, 'important');
  badge.style.setProperty('top', `${top}px`, 'important');
  badge.style.setProperty('right', 'auto', 'important');
  badge.style.setProperty('bottom', 'auto', 'important');
  badge.style.setProperty('width', '256px', 'important');
  badge.style.setProperty('height', '60px', 'important');
  badge.style.setProperty('overflow', 'hidden', 'important');
  badge.style.setProperty('transform', 'scale(.72)', 'important');
  badge.style.setProperty('transform-origin', 'top left', 'important');
  badge.style.setProperty('z-index', '20', 'important');
  badge.style.setProperty('opacity', '1', 'important');
  badge.style.setProperty('visibility', 'visible', 'important');

  return true;
};

const syncFormPolish = () => {
  polishBrevoCountryPicker();
  positionRecaptchaBadge();
};

syncFormPolish();
window.addEventListener('load', syncFormPolish);
window.addEventListener('resize', positionRecaptchaBadge);

/* Brevo and Google both build pieces lazily. */
const formObserver = new MutationObserver(syncFormPolish);
formObserver.observe(document.body, { childList: true, subtree: true });

/* Google may rewrite its own badge style after load; re-assert without scroll tracking. */
window.setInterval(positionRecaptchaBadge, 750);
