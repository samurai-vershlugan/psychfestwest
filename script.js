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

// Keep United States at the top of Brevo's generated country menu.
const pinUnitedStates = () => {
  document.querySelectorAll('.sib-sms-select__dropdown, .sib-sms-select__list').forEach((menu) => {
    const candidates = Array.from(menu.querySelectorAll('[role="option"], li, .sib-sms-select__item'));
    const us = candidates.find((node) => /United States/i.test(node.textContent || ''));
    if (us && us.parentElement && us.parentElement.firstElementChild !== us) {
      us.parentElement.insertBefore(us, us.parentElement.firstElementChild);
    }
  });
};

// Give Google's native v3 badge a left-aligned visual slot without moving the badge node.
const ensureCaptchaSlot = () => {
  const form = document.querySelector('.live-signup .brevo-embed #sib-form');
  const submitButton = form?.querySelector('.sib-form-block__button');
  const submitRow = submitButton?.closest('[style*="padding"]') || submitButton?.parentElement?.parentElement;
  if (!form || !submitRow) return null;

  let slot = form.querySelector('.recaptcha-visual-slot');
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'recaptcha-visual-slot';
    slot.setAttribute('aria-hidden', 'true');
    form.insertBefore(slot, submitRow);
  }
  return slot;
};

const positionCaptchaBadge = () => {
  const slot = ensureCaptchaSlot();
  const badge = document.querySelector('.grecaptcha-badge');
  if (!slot || !badge) return false;

  const rect = slot.getBoundingClientRect();
  badge.style.setProperty('position', 'fixed', 'important');
  badge.style.setProperty('right', 'auto', 'important');
  badge.style.setProperty('bottom', 'auto', 'important');
  badge.style.setProperty('left', `${Math.round(rect.left)}px`, 'important');
  badge.style.setProperty('top', `${Math.round(rect.top)}px`, 'important');
  badge.style.setProperty('visibility', 'visible', 'important');
  badge.style.setProperty('opacity', '1', 'important');
  return true;
};

const refreshDynamicFormUI = () => {
  pinUnitedStates();
  positionCaptchaBadge();
};

const formObserver = new MutationObserver(refreshDynamicFormUI);
formObserver.observe(document.body, { childList: true, subtree: true });

window.addEventListener('load', refreshDynamicFormUI);
window.addEventListener('resize', refreshDynamicFormUI);
window.addEventListener('scroll', refreshDynamicFormUI, { passive: true });

window.setTimeout(refreshDynamicFormUI, 500);
window.setTimeout(refreshDynamicFormUI, 1500);
window.setTimeout(refreshDynamicFormUI, 4000);
