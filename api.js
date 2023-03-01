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
const removeBackground = document.getElementById("no-background");
const removeOverlay = document.getElementById("no-overlay");

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

async function uploadToPublicGallery() {
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/gallery/${EVENT_ID}?image=${
        CURRENT_MODE == MODES.PHOTO ? CANVAS_EXPORT_PHOTO : CANVAS_EXPORT_VIDEO
      }`,
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
    return imgSrc;
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
    console.log("SUCCESS UPLOADING TO BUCKET");
    return data.file;
  } catch (err) {
    console.log("ERROR UPLOADING TO BUCKET", err);
  }
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
      tmp.crossOrigin = "Anonymous";
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
      tmp.crossOrigin = "Anonymous";
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
    if (!Array.isArray(data.props)) throw new Error("an error occurred");

    PROPS_FETCHED = true;

    data.props.forEach((prop) => {
      const tmp = document.createElement("img");
      tmp.classList.add("swiper-slide");
      tmp.crossOrigin = "Anonymous";
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

async function sendText(phone, imageSrc, videoSrc) {
  const mode = getMode();
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/send_image_to_phone?phone=${phone}&image=${imageSrc}&video=${videoSrc}&mode=${mode}`
    );
    const data = await response.json();
    console.log("SEND TEXT SUCCESSFUL", data);
  } catch (err) {
    console.log("FAILED TO SEND TEXT: ", err);
  }
}

async function sendEmail(name, email, imageSrc, videoSrc) {
  const mode = getMode();
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/send_image_to_mail?name=${name}&email=${email}&image=${imageSrc}&video=${videoSrc}&mode=${mode}&event=${EVENT_ID}`
    );
    const data = await response.json();
  } catch (err) {
    console.log("FAILED TO SEND EMAIL: ", err);
  }
}

function onClickBackground(bg) {
  // add background to canvas
  fabric.Image.fromURL(
    bg.src,
    function (img) {
      img.set({
        originX: "left",
        originY: "top",
      });
      img.scaleToHeight(GLOBAL_WIDTH);
      img.scaleToWidth(GLOBAL_WIDTH);
      CANVAS.setBackgroundImage(img, CANVAS.renderAll.bind(CANVAS));
    },
    { crossOrigin: "Anonymous" }
  );

  // replace the photo_image object with image transparent background
  if (USING_TRANSPARENT_IMAGE) return;
  CANVAS.forEachObject((obj, idx) => {
    if (obj.objectKey == "PHOTO_IMAGE") {
      addImageToCanvas(TRANSPARENT_BG_IMAGE, idx);
      CANVAS.remove(obj);
    }
    if (obj.objectKey == "GIF_IMAGE") {
      addGifToCanvas(TRANSPARENT_BG_IMAGE, 0, idx);
      CANVAS.remove(obj);
    }
    USING_TRANSPARENT_IMAGE = true;
  });
}

function onClickProp(pr) {
  fabric.Image.fromURL(
    pr.src,
    (img) => {
      img.set({
        left: 20,
        top: 20,
        padding: 1,
        rotatingPointOffset: 0,
        objectType: "PROP_IMAGE",
      });
      img.scaleToHeight(100);
      img.scaleToWidth(100);
      CANVAS.add(img);
    },
    { crossOrigin: "Anonymous" }
  );
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function getMode() {
  switch (CURRENT_MODE) {
    case MODES.PHOTO:
      return 1;
    case MODES.BOOMERANG:
      return 2;
    case MODES.THREE_SHOT_GIF:
      return 3;
    default:
      return 1;
  }
}

window.addEventListener("load", async () => {
  await fetchEvent();
  fetchOverlays();
  fetchBackgrounds();
  fetchProps();
});

async function fetchTransparentBgImage(imageSrc) {
  try {
    const url = await uploadToBucket(imageSrc);

    const base64 = btoa(url)
      .toString()
      .replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, "");

    const response = await fetch(
      `https://portal.brandpix.com/remove_background.php?base64=${base64}`
    );
    const data = await response.json();
    console.log("response converting", data);
    return data.url;
  } catch (err) {
    console.log("ERROR FETCHING TRANSPARENT BG", err);
  }
  return null;
}

removeBackground.addEventListener("click", () => {
  // replace the transparent image object with original
  if (!USING_TRANSPARENT_IMAGE) return;
  CANVAS.forEachObject((obj, idx) => {
    if (obj.objectKey == "PHOTO_IMAGE") {
      addImageToCanvas(PHOTO_STORED, idx);
      CANVAS.remove(obj);
    }
    if (obj.objectKey == "GIF_IMAGE") {
      addGifToCanvas(GIF_STORED, 0, idx);
      CANVAS.remove(obj);
    }
    USING_TRANSPARENT_IMAGE = false;
  });
});

removeOverlay.addEventListener("click", () => {
  OVERLAY.src = "";
  OVERLAY.classList.add("hidden");
});
