export async function fetchTokens() {
  try {
    const response = await fetch('/tokens');
    const jsonResponse = await response.json();
    if (jsonResponse.data.length) {
      populateTokenizeButton();
      populateTable(jsonResponse);
    } else {
      populateEmptyTokensList();
    }
  } catch (error) {
    console.log('failed to load cards: please check network status');
    populateFailedFetchCards();
  }
}

function accountNumberMask(
  issuerIdentificationNumber,
  accountNumberLength,
  accountNumberLastFour
) {
  const maskedLength =
    accountNumberLength -
    issuerIdentificationNumber.length -
    accountNumberLastFour.length +
    (issuerIdentificationNumber.length - 6);
  const maskedNumber =
    issuerIdentificationNumber.substring(0, 6) +
    maskedNumbers(maskedLength) +
    accountNumberLastFour;
  return maskedNumber.length == 15
    ? maskedNumber.replace(/(.{4})(.{6})(.*)/, '$1 $2 $3')
    : maskedNumber.match(/.{1,4}/g)?.join(' ') ?? '';
}

function maskedNumbers(length) {
  return '●'.repeat(Math.max(0, length));
}

function populateTokenizeButton() {
  const header = document.querySelector('.header');
  const button = document.createElement('button');
  button.className = 'download-btn';
  button.innerHTML = `
    <img src="./assets/svg/add.svg" />
    Tokenize Card
`;

  header.appendChild(button);
}

function populateEmptyTokensList() {
  const tbody = document.getElementById('cardsTableBody');

  tbody.innerHTML = `
  <tr>
    <td colspan="8" class="loader-container">
      <div class="no-tokens-container">
        <img src="./assets/svg/card.svg" />
        <div class="no-tokens-text">No tokens found</div>
        <button class="download-btn">
          <img src="./assets/svg/add.svg" />
          Tokenize Card
        </button>
      </div>
    </td>
  </tr>
`;
}
function populateFailedFetchCards() {
  const tbody = document.getElementById('cardsTableBody');

  tbody.innerHTML = `
    <tr>
      <td colspan="8" class="loader-container">
        <div class="no-tokens-container">
          <img src="./assets/svg/card.svg" />
          <div class="no-tokens-text">Failed To Load Tokens</div>
        </div>
      </td>
    </tr>
  `;
}

function populateTable(cards) {
  const tbody = document.getElementById('cardsTableBody');
  tbody.innerHTML = '';

  cards.data.forEach(card => {
    const row = document.createElement('tr');

    const expiryDate =
      card.expiry_month && card.expiry_year
        ? `${String(card.expiry_month).padStart(2, '0')}/${card.expiry_year}`
        : 'N/A';

    const createdAt = new Date(card.created_at).toLocaleString();
    const issuer_identification_number = card.issuer_identification_number;
    const account_number_length = card.account_number_length;
    const account_number_last_four = card.account_number_last_four;

    row.innerHTML = `
      <td>${card.id.slice(0, 8)}...</td>
      <td>${card.scheme}</td>
      <td>
        ${accountNumberMask(
          issuer_identification_number,
          account_number_length,
          account_number_last_four
        )}
      </td>
      <td>${card.cardholder_name}</td>
      <td>
        <span class="status ${card.network_token_status}">
          ${card.network_token_status}
        </span>
      </td>
      <td>
        <span class="status ${card.identity_and_verification}">
          ${card.identity_and_verification}
        </span>
      </td>
      <td>${createdAt}</td>
      <td>${expiryDate}</td>
    `;

    tbody.appendChild(row);
  });
}
