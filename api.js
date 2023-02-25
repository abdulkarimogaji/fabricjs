const liveEventBackground = document.getElementById("live-event-background");
const socialShareContainer = document.getElementById("social-share-container");
const textShareContainer = document.getElementById("text-share-form");
const emailShareContainer = document.getElementById("email-share-form");
const eventDescription = document.getElementById("event-description");
const galleryLink = document.getElementById("view-image-gallery");
const sms = document.getElementById("smsOption");
const overlayContainer = document.getElementById("overlay-container");
const backgroundsContainer = document.getElementById("backgrounds-container");
const propsContainer = document.getElementById("props-container");

// global values
let SMS_ENABLED = false;
let TEXT_EDIT_FEATURE = false;
let EVENT_ID = "";
let PROPS_FETCHED = false;
let BACKGROUNDS_FETCHED = false;
let OVERLAYS_FETCHED = false;
let USING_TRANSPARENT_IMAGE = false;

async function fetchEvent() {
  let uniqueId = "cjvlewis";
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/events/${uniqueId}`
    );
    let data = await response.json();
    if (data.status != 200) throw new Error("Status not 200");

    let isLightMode = isHexColorLight(data.live_event.text_color);
    TEXT_EDIT_FEATURE = Number(data.live_event.text_feature_enabled) == 1;
    SMS_ENABLED = Number(data.live_event.sms_enabled) == 1;
    EVENT_ID = data.live_event.id;

    if (!isLightMode) {
      socialShareContainer.style.color = "white";
      textShareContainer.style.color = "white";
      emailShareContainer.style.color = "white";
    }
    if (!SMS_ENABLED) {
      sms.style.visibility = "hidden";
      sms.style.order = "2";
    }
    liveEventBackground.style.backgroundImage = `url(${data.live_event.background})`;
    galleryLink.href = `https://portal.brandpix.com/virtual_photo_booth/${data.live_event.slug}/gallery`;
  } catch (err) {
    console.log("API ERROR FETCHING EVENTS", err);
  }
}

async function uploadToPublicGallery(imgSrc) {
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/gallery/${EVENT_ID}?image=${imgSrc}`,
      {
        method: "post",
      }
    );
    if (response.status > 399) throw new Error("error");
  } catch (err) {
    console.log("ERROR IN UPLOADING TO PUBLIC GALLERY: ", err.message);
  }
}

async function uploadToBucket(imgSrc) {
  var ImageURL = imgSrc;
  if (
    !(ImageURL.split(":")[0] != "http" && ImageURL.split(":")[0] != "https")
  ) {
    return;
  }
  // Split the base64 string in data and contentType
  var realData, block, contentType, blob;
  block = ImageURL.split(";");
  // Get the content type of the image
  contentType = block[0].split(":")[1]; // In this case "image/gif"
  // get the real base64 content of the file
  realData = block[1].split(",")[1]; // In this case
  // Convert it to a blob to upload
  blob = b64toBlob(realData, contentType);
  const newForm = document.createElement("form");
  let formData = new FormData(newForm);
  formData.append("file", blob);

  try {
    const response = await fetch(
      "https://portal.brandpix.com/v1/api/file/upload?bucket=com.nds.images",
      {
        method: "post",
        body: formData,
      }
    );
    const data = await response.json();
  } catch (err) {}
}

function isHexColorLight(color) {
  const hex = color.replace("#", "");
  const c_r = parseInt(hex.substring(0, 0 + 2), 16);
  const c_g = parseInt(hex.substring(2, 2 + 2), 16);
  const c_b = parseInt(hex.substring(4, 4 + 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
}

async function fetchOverlays() {
  if (OVERLAYS_FETCHED) return;

  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/get_overlays?live_event_id=${EVENT_ID}`,
      {}
    );
    const data = await response.json();
    if (!Array.isArray(data.overlays)) throw new Error("an error occurred");

    OVERLAYS_FETCHED = true;

    data.overlays.forEach((ov) => {
      const tmp = document.createElement("img");
      tmp.classList.add("swiper-slide");
      tmp.setAttribute("src", ov.image);

      tmp.addEventListener("click", () => onClickOverlay(tmp));

      overlayContainer.appendChild(tmp);

      // activate swiper
      new Swiper(".overlay-slider-swiper", {
        slidesPerView: 3,
        spaceBetween: 10,
        loop: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    });
  } catch (err) {
    console.log("ERROR FETCHING OVERLAYS", err);
  }
}

async function fetchBackgrounds() {
  if (BACKGROUNDS_FETCHED) return;

  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/get_backgrounds?live_event_id=${EVENT_ID}`
    );
    const data = await response.json();
    if (!Array.isArray(data.backgrounds)) throw new Error("an error occurred");

    BACKGROUNDS_FETCHED = true;

    data.backgrounds.forEach((bg) => {
      const tmp = document.createElement("img");
      tmp.classList.add("swiper-slide");
      tmp.setAttribute("src", bg.image);

      tmp.addEventListener("click", () => onClickBackground(tmp));

      backgroundsContainer.appendChild(tmp);

      // activate swiper
      new Swiper(".background-slider-swiper", {
        slidesPerView: 3,
        spaceBetween: 10,
        loop: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    });
  } catch (err) {
    console.log("ERROR FETCHING BACKGROUNDS", err);
  }
}
async function fetchProps() {
  if (PROPS_FETCHED) return;
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/get_props?live_event_id=${EVENT_ID}`
    );
    const data = await response.json();
    console.log(data);
    if (!Array.isArray(data.props)) throw new Error("an error occurred");

    PROPS_FETCHED = true;

    data.props.forEach((prop) => {
      const tmp = document.createElement("img");
      tmp.classList.add("swiper-slide");
      tmp.setAttribute("src", prop.image);

      tmp.addEventListener("click", () => onClickProp(tmp));

      propsContainer.appendChild(tmp);

      // activate swiper
      new Swiper(".prop-slider-swiper", {
        slidesPerView: 3,
        spaceBetween: 10,
        loop: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    });
  } catch (err) {
    console.log("ERROR FETCHING PROPS", err);
  }
}

async function onClickOverlay(ov) {
  OVERLAY.src = ov.src;
  OVERLAY.classList.add("show");
}

function onClickBackground(bg) {
  // add background to canvas
  fabric.Image.fromURL(bg.src, function (img, err) {
    img.set({
      originX: "left",
      originY: "top",
    });
    img.scaleToHeight(GLOBAL_WIDTH);
    img.scaleToWidth(GLOBAL_WIDTH);
    CANVAS.setBackgroundImage(img, CANVAS.renderAll.bind(CANVAS));
  });

  // replace the photo_image object with image transparent background
  if (USING_TRANSPARENT_IMAGE) return;
  return;
  CANVAS.forEachObject((obj, idx) => {
    if (obj.objectKey == "PHOTO_IMAGE") {
      fabric.Image.fromURL(TRANSPARENT_BG_IMAGE, (img) => {
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
          objectKey: "PHOTO_IMAGE_TRANSPARENT",
        });
        img.scaleToHeight(GLOBAL_WIDTH);
        img.scaleToWidth(GLOBAL_WIDTH);

        CANVAS.insertAt(img, idx);
        CANVAS.remove(obj);
        USING_TRANSPARENT_IMAGE = true;
      });
    }
  });
}

function onClickProp(pr) {
  console.log("clicked");
  fabric.Image.fromURL(pr.src, (img) => {
    img.set({
      left: 20,
      top: 20,
      padding: 1,
      rotatingPointOffset: 0,
    });
    img.scaleToHeight(100);
    img.scaleToWidth(100);
    CANVAS.add(img);
  });
}

window.addEventListener("load", async () => {
  await fetchEvent();
  fetchOverlays();
  fetchBackgrounds();
  fetchProps();
});

async function fetchTransparentBgImage(imageData) {
  try {
    const response = await fetch(
      `https://portal.brandpix.com/remove_background.php?base64=${imageData}`
    );
    const data = await response.json();
    console.log("response converting", data);
    return data.url;
  } catch (err) {
    console.log("ERROR FETCHING TRANSPARENT BG", err);
  }
  return null;
}
