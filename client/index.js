import {
  cardFormStyle,
  modalEl,
  submitButtonEl,
  toggleLoadingCards,
} from './utils.js';

import { fetchTokens } from './cards-list.js';

let cardHolderField;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchTokens();
  } catch (error) {
    console.error('Error fetching tokens:', error);
  }
});

export function tokenizeButton() {
  const header = document.querySelector('.header');
  if (header.querySelector('.download-btn')) {
    return; 
  }
  const button = document.createElement('button');
  button.className = 'download-btn';
  button.innerHTML = `
    <img src="./assets/svg/add.svg" />
    Tokenize Card
  `;

  header.appendChild(button);
  button.addEventListener('click', async event => {
    event.preventDefault();
    toggleLoadingCards(true);

    try {
      const main = document.querySelector('main');
      const tokenize_form = document.querySelector('.tokenize-card-container');

      main.style.display = 'block';

      main.addEventListener('click', () => {
        main.style.display = 'none';
      });
      tokenize_form.addEventListener('click', event => {
        event.stopPropagation();
      });

      const { session_id, backend_url } = await fetchConfig();
      if (!session_id) throw new Error('Session ID is missing');

      const { Hellgate } = window;
      const client = await Hellgate.init(session_id, {
        base_url: backend_url,
        challenge_3ds_container: document.getElementById('challenge'),
      });
      const cardHandler = client.use('CARD');
      const threeDSHandler = client.use('3DS');

      await setupCardForm(cardHandler);
      setup3DSHandler(threeDSHandler);
      setupButtonListeners(cardHandler);
    } catch (error) {
      console.error('Error initializing tokenization:', error);
    } finally {
      toggleLoadingCards(false);
    }
  });
}

async function fetchConfig() {
  try {
    const response = await fetch('/config');
    return response.json();
  } catch (error) {
    console.error('Error fetching config:', error);
    return {};
  }
}

function setup3DSHandler(threeDSHandler) {
  threeDSHandler.onStartChallenge(() => {
    if (modalEl) {
      modalEl.style.display = 'block';
    }
  });
  threeDSHandler.onChallengeFinished(() => {
    if (modalEl) {
      modalEl.style.display = 'none';
    }
  });
}

async function setupCardForm(cardHandler) {
  try {
    const { cardNumber, expiryDate, securityCode } =
      await cardHandler.createFormFields({
        style: cardFormStyle,
        cardNumber: { placeholder: '0000 0000 0000 0000' },
        securityCode: { placeholder: '000' },
      });
    cardHolderField = cardHandler.createTextField({
      style: cardFormStyle,
      placeholder: 'John Doe',
    });

    await Promise.all([
      cardNumber.mount('#card-number'),
      expiryDate.mount('#expiry-date'),
      securityCode.mount('#security-code'),
      cardHolderField.mount('#cardholder-Name'),
    ]);
  } catch (error) {
    console.error('Error setting up card form:', error);
  }
}

function setupButtonListeners(cardHandler) {
  submitButtonEl.addEventListener('click', () => handleSubmit(cardHandler));
}

async function handleSubmit(cardHandler) {
  toggleLoadingCards(true);

  try {
    await cardHandler.process({
      cardholder_name: cardHolderField,
    });
    
    cardHandler.reset();
    await fetchTokens();

    const mainContainer = document.querySelector('main');
    mainContainer.style.display = 'none';
  } catch (error) {
    console.error('Error processing card:', error);
  } finally {
    toggleLoadingCards(false);
  }
}
