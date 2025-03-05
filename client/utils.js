export const submitButtonEl = document.getElementById('submit-button');
export const retryButtonEl = document.getElementById('retry-button');
export const modalEl = document.getElementById('modal');

const cardDataEl = document.getElementById('card-form');
const cardNameEl = document.getElementById('cardholderName');
const loadingEl = document.getElementById('loading-dot');
const resultEl = document.getElementById('message');
const resultContainerEl = document.getElementById('challenge-result');
const containerEl = document.getElementById('container');

export const cardFormStyle = {
  fonts: [
    'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap',
  ],
  base: {
    fontFamily: 'Nunito, sans-serif',
    color: 'rgb(14, 23, 38)',
    fontSize: '16px',
    fontWeight: 400,
    '::placeholder': { color: '#6b7280' },
    ':disabled': { color: '#aaa' },
    padding: '0px',
    backgroundColor: 'transparent',
  },
  complete: { color: 'cornflowerblue' },
  invalid: { color: 'lightcoral' },
};

export function toggleLoading(boolean) {
  submitButtonEl.style.display = boolean ? 'none' : 'block';
  cardDataEl.style.display = boolean ? 'none' : 'block';
  cardNameEl.style.display = boolean ? 'none' : 'block';
  loadingEl.style.display = boolean ? 'block' : 'none';
}

export function renderResultMessage(result) {
  const { status, data } = result;
  const isSuccess = status === 'success';
  const icon = isSuccess ? 'check.svg' : 'error.svg';
  const htmlIcon = `
  <div class="check">
    <img src="./assets/svg/${icon}" />
  </div>`;
  modalEl.style.display = 'block';

  resultEl.innerHTML = isSuccess
    ? `Tokenization completed.<br> ${htmlIcon} Token ID <br> ${data.token_id}`
    : `Tokenization failed.<br> ${htmlIcon} ${data.message}`;

  containerEl.style.display = 'none';
  resultContainerEl.style.display = 'block';
}

