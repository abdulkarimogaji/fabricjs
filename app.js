const START_BUTTON = document.getElementById("getting-started");
const APP_SCREEN = document.getElementById("app");
const LOADER = document.getElementById("loader");
const COUNTDOWN = document.getElementById("countdown");
const COUNTDOWN_TEXT = document.getElementById("countdown-text");
const CANVAS_LABEL = document.getElementById("canvas-label");
const CANVAS_CONTAINER = document.getElementById("canvas-container");
const captureBtn = document.getElementById("capture-btn");

const testButton = document.getElementById("test-button");

// constants
const MODES = {
  PHOTO: "PHOTO",
  BOOMERANG: "BOOMERANG",
  THREE_SHOT_GIF: "THREE_SHOT_GIF",
  NONE: "NONE",
};

const SCREENS = {
  SELECT_MODE: "SELECT_MODE",
  SELECT_BACKGROUND: "SELECT_BACKGROUND",
  CAPTURE_SCREEN: "CAPTURE_SCREEN",
  CONFIRM_CAPTURE: "CONFIRM_CAPTURE",
  SELECT_EFFECTS: "SELECT_EFFECTS",
  SELECT_PROPS: "SELECT_PROPS",
  SELECT_EMAIL_OR_PHONE: "SELECT_EMAIL_OR_PHONE",
  EMAIL_FORM: "EMAIL_FORM",
  PHONE_FORM: "PHONE_FORM",
};

let IN_COUNTDOWN = false;
let IN_SCREEN_CHANGE = false;
let CURRENT_MODE = MODES.NONE;
let CURRENT_SCREEN = SCREENS.SELECT_MODE;

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

async function changeScreen(screenType, direction) {
  if (CURRENT_SCREEN == screenType || IN_SCREEN_CHANGE) return;
  startLoader();
  IN_SCREEN_CHANGE = true;
  console.log("SCREEN_CHANGE: ", screenType);
  // changes to canvas here
  await sleep(1000);

  // hide other screens
  document.querySelectorAll("[data-screen-type]").forEach((scr) => {
    if (scr.getAttribute("data-screen-type")?.includes(screenType)) {
      scr.classList.remove("hidden");
    } else {
      scr.classList.add("hidden");
    }
  });

  switch (screenType) {
    case SCREENS.SELECT_BACKGROUND:
      CANVAS_LABEL.innerText = "Select a Background";
      break;
    case SCREENS.CONFIRM_CAPTURE:
      CANVAS_LABEL.innerText = "Do you like it?";
      break;
    case SCREENS.CAPTURE_SCREEN:
      CANVAS_LABEL.innerText = "Pick a Frame...Or Not!";
      break;
    case SCREENS.SELECT_EFFECTS:
      CANVAS_LABEL.innerText = "Try a Fun Filter, or Keep Original";
      break;
    case SCREENS.SELECT_PROPS:
      CANVAS_LABEL.innerText = "Photo Props. Why Not?";
      break;
    case SCREENS.SELECT_EMAIL_OR_PHONE:
      CANVAS_CONTAINER.classList.add("hidden");
      CANVAS_LABEL.innerText =
        "Would you like to receive it by email or texted to your phone?";
      break;
    default:
      CANVAS_LABEL.innerText = "";
  }

  CURRENT_SCREEN = screenType;
  IN_SCREEN_CHANGE = false;
  stopLoader();
}

async function photoCapture() {
  changeScreen(SCREENS.CONFIRM_CAPTURE);
}

async function boomerangCapture() {
  changeScreen(SCREENS.CONFIRM_CAPTURE);
}

async function threeShotGifCapture() {
  changeScreen(SCREENS.CONFIRM_CAPTURE);
}

START_BUTTON.addEventListener("click", () => {
  APP_SCREEN.classList.remove("hidden");
  START_BUTTON.classList.add("hidden");
});

// event listeners for selecting mode
document.querySelectorAll("[data-mode-select]").forEach((btn) => {
  btn.addEventListener("click", () => {
    var mode = btn.getAttribute("data-mode-select");
    CURRENT_MODE = mode;
    changeScreen(SCREENS.CAPTURE_SCREEN);
  });
});

// event listeners for back buttons
document.querySelectorAll("[data-back-to]").forEach((btn) => {
  btn.addEventListener("click", () => {
    var toScreen = btn.getAttribute("data-back-to");
    changeScreen(toScreen, "backwards");
  });
});

// event listeners for forward buttons
document.querySelectorAll("[data-forward-to]").forEach((btn) => {
  btn.addEventListener("click", () => {
    var toScreen = btn.getAttribute("data-forward-to");
    changeScreen(toScreen, "forwards");
  });
});

// capture button
captureBtn.addEventListener("click", () => {
  switch (CURRENT_MODE) {
    case MODES.PHOTO:
      photoCapture();
      break;
    case MODES.BOOMERANG:
      boomerangCapture();
      break;
    case MODES.THREE_SHOT_GIF:
      threeShotGifCapture();
      break;
    default:
      break;
  }
});
