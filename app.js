const START_BUTTON = document.getElementById("getting-started");
const APP_SCREEN = document.getElementById("app");
const LOADER = document.getElementById("loader");
const COUNTDOWN = document.getElementById("countdown");
const COUNTDOWN_TEXT = document.getElementById("countdown-text");
const CANVAS_LABEL = document.getElementById("canvas-label");
const CANVAS_CONTAINER = document.getElementById("canvas-section");
const CANVAS = new fabric.Canvas("canvas");

const ALL_FILTERS = [
  [],
  [new fabric.Image.filters.Grayscale()],
  [new fabric.Image.filters.Brownie()],
  [new fabric.Image.filters.Vintage()],
  [new fabric.Image.filters.Technicolor()],
  [new fabric.Image.filters.Polaroid()],
  [new fabric.Image.filters.Kodachrome()],
  [new fabric.Image.filters.BlackWhite()],
];

let GLOBAL_WIDTH = 275;
let TRANSPARENT_BG_IMAGE = null;

//
CANVAS.setHeight(GLOBAL_WIDTH);
CANVAS.setWidth(GLOBAL_WIDTH);
//

const VIDEO = document.getElementById("video");
const OVERLAY = document.getElementById("overlay");
const captureBtn = document.getElementById("capture-btn");

const VENDOR_URL = window.URL || window.webkitURL;
const shutterSound = new Audio();
shutterSound.autoplay = true;
let FLIP_MODE = true;

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
  SOCIAL_SHARE: "SOCIAL_SHARE",
};
let WEBCAM_ON = false;
let IN_COUNTDOWN = false;
let IN_SCREEN_CHANGE = false;
let CURRENT_MODE = MODES.NONE;
let CURRENT_SCREEN = SCREENS.SELECT_MODE;

function mobileAndTabletCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

function startLoader() {
  LOADER.classList.remove("hidden");
}

function clearOverlay() {
  OVERLAY.src = "";
  OVERLAY.classList.remove("show");
}

function stopLoader() {
  LOADER.classList.add("hidden");
}

function playShutterSound() {
  shutterSound.src = "../assets/shutter_sound.mp3";
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

function clearFabricObjects() {
  CANVAS.forEachObject((obj) => {
    // if (obj.objectKey == "PHOTO_IMAGE") {
    console.log("removing");
    CANVAS.remove(obj);
    // }
  });

  // remove overlay image
  CANVAS.overlayImage = null;
  CANVAS.backgroundImage = null;
  CANVAS.renderAll.bind(CANVAS);
}

async function changeScreen(screenType, direction) {
  if (CURRENT_SCREEN == screenType || IN_SCREEN_CHANGE) return;
  // stop webcam on other screens
  if (
    ![SCREENS.SELECT_MODE, SCREENS.CAPTURE_SCREEN].includes(screenType) &&
    WEBCAM_ON
  ) {
    stopWebcam();
  }
  startLoader();
  IN_SCREEN_CHANGE = true;
  console.log("SCREEN_CHANGE: ", screenType);
  // changes to canvas here  mix-blend-mode: multiply;

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
    case SCREENS.SELECT_MODE:
      CANVAS_LABEL.innerText = "Choose your favorite photo experience";
      clearOverlay();
      clearFabricObjects();
      USING_TRANSPARENT_IMAGE = false;
      await startWebcam();
      break;
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
    case SCREENS.SELECT_PRconstOPS:
      CANVAS_LABEL.innerText = "Photo Props. Why Not?";
      break;
    case SCREENS.SELECT_EMAIL_OR_PHONE:
      CANVAS_CONTAINER.classList.add("hidden");
      CANVAS_LABEL.innerText =
        "Would you like to receive it by email or texted to your phone?";
      break;
    case SCREENS.SOCIAL_SHARE:
      CANVAS_CONTAINER.classList.add("hidden");
      CANVAS_LABEL.innerText = "";
      break;
    default:
      CANVAS_LABEL.innerText = "";
  }

  CURRENT_SCREEN = screenType;
  IN_SCREEN_CHANGE = false;
  stopLoader();
}

async function takePicture() {
  return new Promise((resolve, reject) => {
    const camCanvas = document.createElement("canvas");
    const context = camCanvas.getContext("2d", { willReadFrequently: true });
    camCanvas.width = 1080;
    camCanvas.height = 1080;
    if (mobileAndTabletCheck() && FLIP_MODE) {
      context.translate(1080, 0);
      context.scale(-1, 1);
    } else if (FLIP_MODE) {
      context.translate(1080, 0);
      context.scale(-1, 1);
    }
    context.drawImage(VIDEO, 0, 0, 1080, 1080);
    const data = camCanvas.toDataURL("image/png", 0.2);
    camCanvas.remove();
    resolve(data);
  });
}

async function photoCapture() {
  await startCountdown(3);
  playShutterSound();

  const url = await takePicture();

  // add image to canvas
  fabric.Image.fromURL(url, (img) => {
    img.setOptions({
      left: 0,
      top: 0,
      hasControls: false,
      hasRotatingPoint: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      objectKey: "PHOTO_IMAGE",
    });
    img.scaleToHeight(GLOBAL_WIDTH);
    img.scaleToWidth(GLOBAL_WIDTH);

    // get transparent image
    fetchTransparentBgImage(
      url.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, "")
    ).then((result) => (TRANSPARENT_BG_IMAGE = result));

    CANVAS.add(img);
  });

  // add overlay to canvas
  fabric.Image.fromURL(OVERLAY.src, function (img, isError) {
    img.set({
      originX: "left",
      originY: "top",
    });
    img.scaleToHeight(GLOBAL_WIDTH);
    img.scaleToWidth(GLOBAL_WIDTH);
    CANVAS.setOverlayImage(img, CANVAS.renderAll.bind(CANVAS));
  });
  clearOverlay();
  changeScreen(SCREENS.CONFIRM_CAPTURE);
}

async function boomerangCapture() {
  changeScreen(SCREENS.CONFIRM_CAPTURE);
}

async function threeShotGifCapture() {
  changeScreen(SCREENS.CONFIRM_CAPTURE);
}

async function startWebcam() {
  const facingMode = FLIP_MODE ? "user" : "environment";
  if (!navigator.mediaDevices.getUserMedia) return;
  try {
    VIDEO.srcObject = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        aspectRatio: 1,
      },
    });
  } catch (err) {
    console.log("ERROR STARTING WEBCAM", err.message);
  }
  WEBCAM_ON = true;
}

function stopWebcam() {
  var stream = VIDEO.srcObject;
  if (stream) {
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
    VIDEO.srcObject = null;
  }
  WEBCAM_ON = false;
}

START_BUTTON.addEventListener("click", async () => {
  APP_SCREEN.classList.remove("hidden");
  START_BUTTON.classList.add("hidden");
  await startWebcam();
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

// event listeners for effects
document.querySelectorAll("#effects-slider img").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = +btn.getAttribute("data-filter-index") || 0;

    CANVAS.forEachObject((obj) => {
      if (obj.objectKey == "PHOTO_IMAGE") {
        obj.filters = ALL_FILTERS[idx];
        obj.applyFilters();
      }
    });
    CANVAS.renderAll();
  });
});
