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

const getElementRotation = (element) => {
  if (!element) return 0;
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === 'none') return 0;

  const match = transform.match(/^matrix\(([^)]+)\)$/);
  if (!match) return 0;

  const values = match[1].split(',').map(Number);
  const [a, b] = values;
  return Math.atan2(b, a) * (180 / Math.PI);
};

/*
 * Anchor Google's real badge to Brevo's native reCAPTCHA row. The badge stays
 * attached to <body> for Google's mechanics. On desktop, compensate for the
 * card's rotation so the badge follows the same visual left-edge line as the
 * SUBSCRIBE button instead of merely sharing its raw x coordinate.
 */
const positionRecaptchaBadge = () => {
  const marker = document.querySelector('.live-signup .brevo-embed .g-recaptcha-v3');
  const anchorRow = marker?.parentElement;
  const badge = document.querySelector('.grecaptcha-badge');
  const submitButton = document.querySelector('.live-signup .brevo-embed .sib-form-block__button');
  const signupCard = document.querySelector('.live-signup');

  if (!anchorRow || !badge || !submitButton) return false;

  const slotHeight = 94;
  const badgeScale = 0.72;
  const badgeNativeHeight = 60;
  const badgeVisualHeight = badgeNativeHeight * badgeScale;

  anchorRow.style.setProperty('height', `${slotHeight}px`, 'important');
  anchorRow.style.setProperty('min-height', `${slotHeight}px`, 'important');
  anchorRow.style.setProperty('padding', '0', 'important');
  anchorRow.style.setProperty('margin', '0', 'important');
  anchorRow.style.setProperty('position', 'relative', 'important');

  const rowRect = anchorRow.getBoundingClientRect();
  const buttonRect = submitButton.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const cardRotation = getElementRotation(signupCard);
  const angle = cardRotation * (Math.PI / 180);

  const badgeTopViewport = rowRect.top + ((rowRect.height - badgeVisualHeight) / 2);
  const verticalDifference = buttonRect.top - badgeTopViewport;
  const rotationCompensation = Math.sin(angle) * verticalDifference;

  const left = buttonRect.left - bodyRect.left + rotationCompensation;
  const top = badgeTopViewport - bodyRect.top;

  badge.style.setProperty('position', 'absolute', 'important');
  badge.style.setProperty('left', `${left}px`, 'important');
  badge.style.setProperty('top', `${top}px`, 'important');
  badge.style.setProperty('right', 'auto', 'important');
  badge.style.setProperty('bottom', 'auto', 'important');
  badge.style.setProperty('width', '256px', 'important');
  badge.style.setProperty('height', `${badgeNativeHeight}px`, 'important');
  badge.style.setProperty('overflow', 'hidden', 'important');
  badge.style.setProperty('transform', `rotate(${cardRotation}deg) scale(${badgeScale})`, 'important');
  badge.style.setProperty('transform-origin', 'top left', 'important');
  badge.style.setProperty('z-index', '20', 'important');
  badge.style.setProperty('opacity', '1', 'important');
  badge.style.setProperty('visibility', 'visible', 'important');

  return true;
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
window.addEventListener('load', syncFormPolish);
window.addEventListener('resize', positionRecaptchaBadge);

/* Brevo and Google both build pieces lazily. */
const formObserver = new MutationObserver(syncFormPolish);
formObserver.observe(document.body, { childList: true, subtree: true });

/* Google may rewrite its own badge style after load; re-assert without scroll tracking. */
