document.getElementById('year').textContent = new Date().getFullYear();

const button = document.getElementById('signup-button');
if (button && button.getAttribute('href').startsWith('SET-')) {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Connect your Brevo signup form before publishing. See README.md.');
  });
}
