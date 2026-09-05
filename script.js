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
  const loopText = `${orderedItems.join(' ✦ ')} ✦`;

  tickerText.textContent = loopText;
  tickerText.classList.add('ticker-copy');

  if (!ticker.querySelector('.ticker-copy[aria-hidden="true"]')) {
    const duplicate = tickerText.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    ticker.appendChild(duplicate);
  }
}
