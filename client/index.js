import {
  cardFormStyle,
  modalEl,
  renderResultMessage,
  retryButtonEl,
  submitButtonEl,
  toggleLoading,
} from './utils.js';

import {
  fetchTokens
} from './cards-list.js';

let cardHolderField;

document.addEventListener('DOMContentLoaded', async () => {
  const { session_id, backend_url } = await fetchConfig();
  const tokens = await fetchTokens();
  if (!session_id) return;

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

  toggleLoading(false);
});

// Function to fetch session ID and backend URL
function fetchConfig() {
  const tbody = document.getElementById('cardsTableBody');
  tbody.innerHTML = `
      <tr id="loaderRow">
          <td colspan="8" class="loader-container">
              <div class="loader"></div>
          </td>
      </tr>
  `;

  return fetch('/config').then(r => r.json());
}


// Function to setup event listeners for 3DS handler
function setup3DSHandler(threeDSHandler) {
  threeDSHandler.onStartChallenge(() => (modalEl.style.display = 'block'));
  threeDSHandler.onChallengeFinished(() => (modalEl.style.display = 'none'));
}

// Function to create and mount card form and cardholder name field
async function setupCardForm(cardHandler) {
  const cardForm = await cardHandler.createForm({ style: cardFormStyle });
  cardHolderField = cardHandler.createTextField({
    placeholder: 'Cardholder Name',
  });

  await Promise.all([
    cardForm.mount('#card-form'),
    cardHolderField.mount('#cardholderName'),
  ]);
}

// Function to setup event listeners for buttons
function setupButtonListeners(cardHandler) {
  submitButtonEl.addEventListener('click', () => handleSubmit(cardHandler));
  retryButtonEl.addEventListener('click', () => {
    modalEl.style.display = 'none';
    location.reload();
  });
}

// Function to handle form submission
async function handleSubmit(cardHandler) {
  toggleLoading(true);

  try {
    const result = await cardHandler.process({
      cardholder_name: cardHolderField,
    });
    renderResultMessage(result);
  } catch (e) {
    console.log(e.message);
  }

  toggleLoading(false);
}
