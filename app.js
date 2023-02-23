const START_BUTTON = document.getElementById("getting-started");
const APP_SCREEN = document.getElementById("app");
const LOADER = document.getElementById("loader");
const COUNTDOWN = document.getElementById("countdown");
const COUNTDOWN_TEXT = document.getElementById("countdown-text");
const testButton = document.getElementById("test-button");

function startLoader() {
  LOADER.classList.remove("hidden");
}
function stopLoader() {
  LOADER.classList.add("hidden");
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function startCountdown(sec) {
  console.log("countdown started");
  return new Promise((resolve) => {
    if (IN_COUNTDOWN || +sec < 1) {
      resolve();
      return;
    }
    IN_COUNTDOWN = true;
    COUNTDOWN.classList.remove("hidden");
    let count = +sec;
    COUNTDOWN_TEXT.innerText = String(count);
    const interval = setInterval(() => {
      if (count < 2) {
        clearInterval(interval);
        IN_COUNTDOWN = false;
        COUNTDOWN.classList.add("hidden");
        resolve();
        return;
      }
      count--;
      COUNTDOWN_TEXT.innerText = String(count);
    }, 1000);
  });
}

let IN_COUNTDOWN = false;

START_BUTTON.addEventListener("click", () => {
  APP_SCREEN.classList.remove("hidden");
  START_BUTTON.classList.add("hidden");
});

testButton.addEventListener("click", async () => {
  await startCountdown(1);
  console.log("it works");
});
