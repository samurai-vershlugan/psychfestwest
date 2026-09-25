const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

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
      if (usOption !== select.firstElementChild) {
        select.insertBefore(usOption, select.firstElementChild);
      }
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
 * Keep Google's visible reCAPTCHA badge inside the dedicated form slot.
 * Google initially appends the badge to <body>; once it exists, move that
 * same badge node into the slot so it stays directly above SUBSCRIBE.
 */
const positionRecaptchaBadge = () => {
  const slot = document.querySelector('.live-signup .recaptcha-badge-slot');
  const badge = document.querySelector('.grecaptcha-badge');

  if (!slot || !badge) return false;

  if (badge.parentElement !== slot) {
    slot.appendChild(badge);
  }

  return true;
};

const scheduleRecaptchaPosition = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(positionRecaptchaBadge);
  });
};

/* After a successful signup, place the confirmation directly below the nav. */
const successMessage = document.getElementById('success-message');
let successViewPositioned = false;

const isVisible = (element) => {
  if (!element) return false;
  const style = getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && element.getBoundingClientRect().height > 0;
};

const positionSuccessMessage = () => {
  if (!successMessage || !isVisible(successMessage)) {
    successViewPositioned = false;
    return;
  }
  if (successViewPositioned) return;

  successViewPositioned = true;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const header = document.querySelector('header');
      const headerHeight = header?.getBoundingClientRect().height || 0;
      const messageTop = successMessage.getBoundingClientRect().top + window.scrollY;
      const breathingRoom = 10;
      const targetTop = Math.max(0, messageTop - headerHeight - breathingRoom);

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
};

if (successMessage) {
  const successObserver = new MutationObserver(positionSuccessMessage);
  successObserver.observe(successMessage, {
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden'],
    childList: true,
    subtree: true
  });
}

const syncFormPolish = () => {
  polishBrevoCountryPicker();
  positionRecaptchaBadge();
  positionSuccessMessage();
};

syncFormPolish();
window.addEventListener('load', scheduleRecaptchaPosition);
window.addEventListener('resize', scheduleRecaptchaPosition);

if (document.fonts?.ready) {
  document.fonts.ready.then(scheduleRecaptchaPosition);
}

/* Brevo and Google both build pieces lazily. */
const formObserver = new MutationObserver(syncFormPolish);
formObserver.observe(document.body, { childList: true, subtree: true });

/* Google may rewrite its own badge style after load; re-assert without scroll tracking. */
