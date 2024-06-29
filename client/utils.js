export function toggleLoading(boolean) {
  const elemButton = document.getElementById("submit-button");
  const elemCardData = document.getElementById("card-form");
  const elemCardName = document.getElementById("cardholderName");
  const elemLoading = document.getElementById("loading-dot");

  elemButton.style.display = boolean ? "none" : "block";
  elemCardData.style.display = boolean ? "none" : "block";
  elemCardName.style.display = boolean ? "none" : "block";
  elemLoading.style.display = boolean ? "block" : "none";
}
