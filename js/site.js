document.addEventListener('DOMContentLoaded', () => {
  const orderGroups = document.querySelectorAll('[data-order-group]');
  if (!orderGroups.length) {
    return;
  }

  const storageKey = 'orderPreference';
  const comingSoonLabel = 'Online Ordering Coming Soon';
  const messages = document.querySelectorAll('[data-order-message]');

  messages.forEach((message) => {
    if (!message.dataset.defaultMessage) {
      message.dataset.defaultMessage = message.textContent.trim();
    }
  });

  const updateMessages = (provider) => {
    if (provider) {
      messages.forEach((message) => {
        message.textContent = `Thanks for letting us know you prefer ${provider}. Online ordering is coming soon—stay tuned!`;
      });
    } else {
      messages.forEach((message) => {
        message.textContent = message.dataset.defaultMessage || message.textContent;
      });
    }
  };

  const renderComingSoon = (group) => {
    if (group.dataset.orderState === 'coming-soon') {
      return;
    }

    group.innerHTML = '';
    const button = document.createElement('a');
    button.href = '#';
    button.className = 'flex items-center justify-center w-full sm:w-auto sm:min-w-[280px] bg-gray-200 text-gray-600 font-semibold py-4 px-10 rounded-lg shadow-md cursor-not-allowed pointer-events-none';
    button.textContent = comingSoonLabel;
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('tabindex', '-1');
    button.setAttribute('title', comingSoonLabel);
    group.appendChild(button);
    group.dataset.orderState = 'coming-soon';
  };

  const renderComingSoonEverywhere = (provider) => {
    orderGroups.forEach(renderComingSoon);
    updateMessages(provider);
  };

  const storedPreference = sessionStorage.getItem(storageKey);
  if (storedPreference) {
    renderComingSoonEverywhere(storedPreference);
    return;
  }

  orderGroups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-order-provider]');

    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        const providerName = button.dataset.orderLabel || button.textContent.trim();

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'order_online_click', {
            event_category: 'engagement',
            event_label: providerName,
            order_provider: providerName
          });
        }

        sessionStorage.setItem(storageKey, providerName);
        renderComingSoonEverywhere(providerName);
      });
    });
  });
});
