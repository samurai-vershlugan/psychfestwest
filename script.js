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

/*
 * Brevo builds its own country picker after page load. Keep Brevo's DOM and
 * behavior intact, but decorate its native .sib-flag elements and put the
 * United States item first in the generated list.
 */
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
 * Google appends the reCAPTCHA badge to <body>. Do not reparent it because
 * Brevo relies on Google's original node. Instead reserve a slot inside the
 * form and position Google's actual badge over that slot.
 */
const ensureRecaptchaSlot = () => {
  const form = document.querySelector('.live-signup #sib-form');
  const submitButton = form?.querySelector('.sib-form-block__button');
  const submitRow = submitButton?.closest('div[style*="padding"]');
  if (!form || !submitRow) return null;

  let slot = form.querySelector('.recaptcha-badge-slot');
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'recaptcha-badge-slot';
    slot.setAttribute('aria-hidden', 'true');
    slot.style.cssText = 'height:68px;position:relative;width:100%;';
    form.insertBefore(slot, submitRow);
  }
  return slot;
};

const positionRecaptchaBadge = () => {
  const slot = ensureRecaptchaSlot();
  const badge = document.querySelector('.grecaptcha-badge');
  if (!slot || !badge) return;

  const slotRect = slot.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const left = slotRect.left - bodyRect.left;
  const top = slotRect.top - bodyRect.top + 4;

  badge.style.setProperty('position', 'absolute', 'important');
  badge.style.setProperty('left', `${left}px`, 'important');
  badge.style.setProperty('top', `${top}px`, 'important');
  badge.style.setProperty('right', 'auto', 'important');
  badge.style.setProperty('bottom', 'auto', 'important');
  badge.style.setProperty('transform', 'none', 'important');
  badge.style.setProperty('transform-origin', 'top left', 'important');
  badge.style.setProperty('visibility', 'visible', 'important');
  badge.style.setProperty('opacity', '1', 'important');
  badge.style.setProperty('z-index', '20', 'important');
};

let polishFrame = null;
const scheduleFormPolish = () => {
  if (polishFrame) cancelAnimationFrame(polishFrame);
  polishFrame = requestAnimationFrame(() => {
    polishBrevoCountryPicker();
    positionRecaptchaBadge();
    polishFrame = null;
  });
};

scheduleFormPolish();
window.addEventListener('load', scheduleFormPolish);
window.addEventListener('resize', scheduleFormPolish);

const formPolishObserver = new MutationObserver(scheduleFormPolish);
formPolishObserver.observe(document.body, { childList: true, subtree: true });
