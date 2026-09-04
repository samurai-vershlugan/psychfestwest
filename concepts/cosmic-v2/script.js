document.getElementById('year').textContent = new Date().getFullYear();

const button = document.getElementById('signup-button');
if (button && button.getAttribute('href').startsWith('SET-')) {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Connect your Brevo signup form before publishing. See README.md.');
  });
}

// Force the Brevo text fields to use the same light treatment as the phone field.
function fixBrevoFieldColors() {
  document.querySelectorAll('.live-signup .brevo-embed .entry__field').forEach((field) => {
    field.style.setProperty('background', '#fff', 'important');
    field.style.setProperty('border-color', '#cfc4c8', 'important');
  });

  document.querySelectorAll('.live-signup .brevo-embed .input').forEach((input) => {
    input.style.setProperty('background', '#fff', 'important');
    input.style.setProperty('color', '#12081e', 'important');
  });
}

fixBrevoFieldColors();
window.addEventListener('load', fixBrevoFieldColors);
