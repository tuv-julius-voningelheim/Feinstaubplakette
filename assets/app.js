const dialog = document.querySelector('.order-dialog');
const closeButton = dialog.querySelector('.dialog-close');
const cancelButton = dialog.querySelector('.dialog-cancel');
const simulatedStart = dialog.querySelector('.simulated-start');
const toast = document.querySelector('.toast');
let lastTrigger = null;

document.querySelectorAll('.order-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    dialog.showModal();
  });
});

function closeDialog() {
  dialog.close();
  lastTrigger?.focus();
}

closeButton.addEventListener('click', closeDialog);
cancelButton.addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

simulatedStart.addEventListener('click', () => {
  closeDialog();
  toast.hidden = false;
  window.setTimeout(() => {
    toast.hidden = true;
  }, 4000);
});

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menü öffnen' : 'Menü schließen');
  mobileNav.hidden = isOpen;
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menü öffnen');
    mobileNav.hidden = true;
  });
});