import { toggleLoading } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const {session_id, backend_url} = await fetchConfig();
  const client = await initializeClient(session_id, backend_url);
  const cardHandler = await client.use("CARD");
  const threeDSHandler = await client.use("3DS");

  await setupCardForm(cardHandler);
  setup3DSHandler(threeDSHandler);
  setupButtonListeners(cardHandler);

  toggleLoading(false);
});

// Function to fetch session ID and backend URL
async function fetchConfig() {
  const response = await fetch("/config");
  const data = await response.json();
  return data;
}

// Function to initialize Hellgate client
async function initializeClient(session_id, backend_url) {
  const { Hellgate } = window;
  return await Hellgate.init(session_id, {
    base_url: backend_url,
    challenge_3ds_container: document.getElementById("challenge"),
  });
}

// Function to setup event listeners for 3DS handler
function setup3DSHandler(threeDSHandler) {
  threeDSHandler.onStartChallenge(() => {
    console.log("Challenge started");
    document.getElementById("modal").style.display = "block";
  });

  threeDSHandler.onChallengeFinished(() => {
    console.log("Challenge finished");
    document.getElementById("modal").style.display = "none";
  });
}

// Function to create and mount card form and cardholder name field
async function setupCardForm(cardHandler) {
  const style = {
    fonts: [
      "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap",
    ],
    base: {
      fontFamily: "Nunito, sans-serif",
      color: "rgb(14, 23, 38)",
      fontSize: "16px",
      fontWeight: 400,
      "::placeholder": { color: "#6b7280" },
      ":disabled": { color: "#aaa" },
      padding: "0px",
      backgroundColor: "transparent",
    },
    complete: { color: "cornflowerblue" },
    invalid: { color: "lightcoral" },
  };

  const cardForm = await cardHandler.createForm({ style });
  const cardHolder = cardHandler.createTextField({
    placeholder: "Cardholder Name",
  });

  await Promise.all([
    cardForm.mount("#card-form"),
    cardHolder.mount("#cardholderName"),
  ]);
}

// Function to handle result response
function displayResultMessage(result) {
  const elemResult = document.getElementById("message");
  const elemResultContainer = document.getElementById("challenge-result");
  const containerElement = document.getElementById("container");
  const { status, data } = result;
  const isSuccess = status === "success";
  const icon = isSuccess ? "check.svg" : "error.svg";
  const htmlIcon = `
  <div class="check">
    <img src="./assets/svg/${icon}" />
  </div>`;
  document.getElementById("modal").style.display = "block";
  
  elemResult.innerHTML = isSuccess
    ? `Tokenization completed.<br> ${htmlIcon} Token ID <br> ${data.token_id}`
    : `Tokenization failed.<br> ${htmlIcon} ${data.message}`;

  containerElement.style.display = "none";
  elemResultContainer.style.display = "block";
}

// Function to handle form submission
async function handleSubmit(cardHandler) {
  toggleLoading(true);

  try {
    const additionalData = {
      cardholder_name: document.getElementById("cardholderName").value,
    };

    const result = await cardHandler.process(additionalData);
    displayResultMessage(result);
  } catch (e) {
    console.log(e.message);
  }

  toggleLoading(false);
}

// Function to setup event listeners for buttons
function setupButtonListeners(cardHandler) {
  document
    .getElementById("submit-button")
    .addEventListener("click", async () => {
      await handleSubmit(cardHandler);
    });

  document.getElementById("retry-button").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
    location.reload();
  });
}
