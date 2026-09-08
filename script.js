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

const prepareCountrySelect = () => {
  const select = document.querySelector('.live-signup select[name="SMS__COUNTRY_CODE"]');
  if (!select) return;

  const options = [...select.options];
  options.forEach(option => {
    const text = option.textContent.trim().replace(/^\p{Regional_Indicator}{2}\s*/u, '');
    const match = text.match(/\b([A-Z]{2})$/);
    if (!match) return;
    option.textContent = `${countryCodeToFlag(match[1])} ${text}`;
  });

  const us = [...select.options].find(option => /\bUS$/.test(option.textContent.trim()));
  if (us) {
    select.insertBefore(us, select.firstElementChild);
    us.selected = true;
  }
};

const decorateBrevoCountryDropdown = () => {
  const items = [...document.querySelectorAll('.sib-sms-select__dropdown li, .sib-sms-select__dropdown [role="option"], .sib-sms-select__item')];

  items.forEach(item => {
    if (item.querySelector('.pfw-country-flag')) return;

    const text = item.textContent.trim();
    const codeMatch = text.match(/\b([A-Z]{2})\b(?!.*\b[A-Z]{2}\b)/);
    const code = /United States/i.test(text) ? 'US' : codeMatch?.[1];
    if (!code) return;

    const flag = document.createElement('span');
    flag.className = 'pfw-country-flag';
    flag.setAttribute('aria-hidden', 'true');
    flag.textContent = countryCodeToFlag(code);
    item.prepend(flag);
  });

  const usItem = items.find(item => /\bUS\b|United States/i.test(item.textContent));
  if (usItem?.parentElement && usItem !== usItem.parentElement.firstElementChild) {
    usItem.parentElement.insertBefore(usItem, usItem.parentElement.firstElementChild);
  }
};

const placeRecaptchaBadge = () => {
  const form = document.querySelector('.live-signup #sib-form');
  const badge = document.querySelector('.grecaptcha-badge');
  const submitButton = form?.querySelector('.sib-form-block__button');
  const submitRow = submitButton?.closest('div[style*="padding"]');

  if (!form || !badge || !submitRow) return false;

  let slot = form.querySelector('.recaptcha-badge-slot');
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'recaptcha-badge-slot';
    slot.setAttribute('aria-label', 'reCAPTCHA protection');
    form.insertBefore(slot, submitRow);
  }

  if (badge.parentElement !== slot) slot.appendChild(badge);
  return true;
};

prepareCountrySelect();
decorateBrevoCountryDropdown();
placeRecaptchaBadge();

const formPolishObserver = new MutationObserver(() => {
  decorateBrevoCountryDropdown();
  placeRecaptchaBadge();
});

formPolishObserver.observe(document.body, { childList: true, subtree: true });
