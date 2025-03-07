export const submitButtonEl = document.getElementById('submit-button');
export const retryButtonEl = document.getElementById('retry-button');
export const modalEl = document.getElementById('modal');
export const deleteBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
<path d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`

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

export function loadingTokens() {
  const tbody = document.getElementById('cardsTableBody');

  if (!document.getElementById('loaderRow')) {
    tbody.innerHTML = `
        <tr id="loaderRow">
            <td colspan="9" class="loader-container">
                <div class="loader"></div>
            </td>
        </tr>
    `;
  }
}


export function renderResultMessage() {

  main.style.display = "none";

}

