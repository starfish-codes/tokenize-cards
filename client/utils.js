export const submitButtonEl = document.getElementById('submit-button');
export const retryButtonEl = document.getElementById('retry-button');
export const modalEl = document.getElementById('modal');

const main = document.querySelector('main');
const tokenizeForm = document.querySelector('.tokenize-form');
const loadingEl = document.getElementById('loading-dot');

export const cardFormStyle = {
  fonts: [
    'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap',
  ],
  base: {
    fontFamily: 'Nunito, sans-serif',
    color: '#081f2d',
    fontSize: '16px',
    fontWeight: 400,
    '::placeholder': { color: '#081f2d' },
    ':disabled': { color: '#aaa' },
    padding: '0px',
    backgroundColor: 'transparent',
  },
  complete: { color: 'cornflowerblue' },
  invalid: { color: 'danger' },
};

export function toggleLoadingCards(boolean) {
  loadingEl.style.display = boolean ? 'block' : 'none';
  tokenizeForm.style.display = boolean ? 'none' : 'block';
}


export function renderResultMessage() {

  main.style.display = "none";

}

