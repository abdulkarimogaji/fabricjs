const liveEventBackground = document.getElementById("live-event-background");
const socialShareContainer = document.getElementById("social-share-container");
const textShareContainer = document.getElementById("text-share-form");
const emailShareContainer = document.getElementById("email-share-form");
const eventDescription = document.getElementById("event-description");
const galleryLink = document.getElementById("viewImageGallery");
const sms = document.getElementById("smsOption");
const overlayContainer = document.getElementById("overlay-container");

// global values
let SMS_ENABLED = false;
let TEXT_EDIT_FEATURE = false;
let EVENT_ID = "";

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
    liveEventBackground.style.backgroundImage = data.live_event.background;
    galleryLink.href = `https://portal.brandpix.com/virtual_photo_booth/${data.live_event.slug}/gallery`;
  } catch (err) {
    console.log("API ERROR FETCHING EVENTS", err.message);
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
  try {
    const response = await fetch(
      `https://portal.brandpix.com/v1/api/live/get_overlays?live_event_id=${EVENT_ID}`,
      {}
    );
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("an error occurred");
    data.forEach((ov) => {
      const tmp = document.createElement("img");
      tmp.classList.add("swiper-slide");
      tmp.setAttribute("src", ov.image);
      // TODO: Add event listener here for applying overlay
      overlayContainer.appendChild(tmp);
    });
  } catch (err) {
    console.log("ERROR FETCHING OVERLAYS");
  }
}

window.addEventListener("load", async () => {
  fetchEvent();
});
