document.addEventListener('DOMContentLoaded', () => {
  const orderButtons = document.querySelectorAll('[data-order-provider]');

  if (!orderButtons.length) {
    return;
  }

  const clickedMessage = 'Coming soon -- stay tuned!';
  const disabledSessionKey = 'orderButtonsDisabled';

  const colorClassesToRemove = [
    'bg-verde-accent',
    'hover:bg-verde-accent-dark',
    'bg-gray-900',
    'hover:bg-gray-800',
    'bg-white',
    'hover:bg-gray-50',
    'text-verde-accent',
    'text-white',
    'hover:text-white',
    'border-2',
    'border-verde-accent'
  ];

  const disableButton = (button) => {
    if (button.classList.contains('order-coming-soon')) {
      return;
    }

    colorClassesToRemove.forEach((cls) => {
      if (button.classList.contains(cls)) {
        button.classList.remove(cls);
      }
    });

    button.classList.add(
      'order-coming-soon',
      'bg-gray-200',
      'text-gray-600',
      'hover:bg-gray-200',
      'hover:text-gray-600',
      'cursor-not-allowed',
      'pointer-events-none'
    );

    button.textContent = clickedMessage;
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('title', clickedMessage);
    button.setAttribute('tabindex', '-1');
  };

  const disableAllButtons = () => {
    orderButtons.forEach(disableButton);
  };

  if (sessionStorage.getItem(disabledSessionKey) === 'true') {
    disableAllButtons();
  }

  orderButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      if (sessionStorage.getItem(disabledSessionKey) === 'true') {
        return;
      }

      const provider = button.dataset.orderProvider || '';

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'order_online_click', {
          event_category: 'engagement',
          event_label: provider || 'unknown'
        });
      }

      disableAllButtons();
      sessionStorage.setItem(disabledSessionKey, 'true');
    });
  });
});
