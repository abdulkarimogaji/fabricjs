const [PLAY, PAUSE, STOP] = [0, 1, 2];

/**
 * fabricGif "async"
 * Mainly a wrapper for gifToSprite
 * @param {string|File} gif can be a URL, dataURL or an "input File"
 * @param {number} maxWidth Optional, scale to maximum width
 * @param {number} maxHeight Optional, scale to maximum height
 * @param {number} maxDuration Optional, in milliseconds reduce the gif frames to a maximum duration, ex: 2000 for 2 seconds
 * @returns {*} {error} object if any or a 'fabric.image' instance of the gif with new 'play', 'pause', 'stop' methods
 */
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const fabricGif = async (
  gif,
  filter = "",
  maxWidth,
  maxHeight,
  maxDuration,
  context
) => {
  const { error, dataUrl, delay, frameWidth, framesLength } = await gifToSprite(
    gif,
    maxWidth,
    maxHeight,
    maxDuration
  );

  if (error) return { error };

  return new Promise((resolve) => {
    fabric.Image.fromURL(dataUrl, (img) => {
      const sprite = img.getElement();
      // sprite.style.filter = "blur(10px)"

      let framesIndex = 0;
      let start = performance.now();
      let status;

      img.width = frameWidth;
      img.height = sprite.naturalHeight;
      img.mode = "image";
      img.top = 200;
      img.left = 200;
      let imageData;

      img._render = function (ctx) {
        if (status === PAUSE || (status === STOP && framesIndex === 0)) return;
        const now = performance.now();
        const delta = now - start;
        if (delta > delay) {
          start = now;
          framesIndex++;
        }
        if (framesIndex === framesLength || status === STOP) framesIndex = 0;
        if (!isSafari) {
          if (filter === "brownie") {
            ctx.filter = "hue-rotate(25deg)";
          } else if (filter === "grayscale") {
            ctx.filter = "grayscale(.8) contrast(100%)";
          } else if (filter === "vintage") {
            ctx.filter = "hue-rotate(45deg) contrast(100%)";
          } else if (filter === "technicolor") {
            ctx.filter = "hue-rotate(340deg) contrast(100%)";
          } else if (filter === "polaroid") {
            ctx.filter = "brightness(135%) contrast(100%)";
          } else if (filter === "bw") {
            ctx.filter = "grayscale(.6) contrast(30%)";
          } else {
            ctx.filter = "contrast(100%)";
          }
          // ctx.drawImage(
          //   sprite,
          //   frameWidth * framesIndex,
          //   0,
          //   frameWidth,
          //   sprite.height,
          //   -this.width / 2,
          //   -this.height / 2,
          //   frameWidth,
          //   sprite.height
          // );
        }

        ctx.drawImage(
          sprite,
          frameWidth * framesIndex,
          0,
          frameWidth,
          sprite.height,
          -this.width / 2,
          -this.height / 2,

          frameWidth,
          sprite.height
        );

        if (isSafari) {
          let imageData = ctx.getImageData(0, 0, 1080, 1080);

          if (filter == "grayscale") {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // red
              data[i + 1] = avg; // green
              data[i + 2] = avg; // blue
            }

            ctx.putImageData(imageData, 0, 0, 0, 0, 1080, 1080);
          } else if (filter == "brownie") {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const red = data[i];
              const green = data[i + 1];
              const blue = data[i + 2];

              data[i] = Math.min(
                Math.round(0.393 * red + 0.769 * green + 0.189 * blue),
                255
              );
              data[i + 1] = Math.min(
                Math.round(0.349 * red + 0.686 * green + 0.168 * blue),
                255
              );
              data[i + 2] = Math.min(
                Math.round(0.272 * red + 0.534 * green + 0.131 * blue),
                255
              );
            }

            ctx.putImageData(imageData, 0, 0, 0, 0, 1080, 1080);
          } else if (filter === "vintage") {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const red = data[i];
              const green = data[i + 1];
              const blue = data[i + 2];

              data[i] = Math.min(
                Math.round(0.693 * red + 0.969 * green + 0.589 * blue),
                255
              );
              data[i + 1] = Math.min(
                Math.round(0.349 * red + 0.686 * green + 0.168 * blue),
                255
              );
              data[i + 2] = Math.min(
                Math.round(0.272 * red + 0.534 * green + 0.131 * blue),
                255
              );
            }

            ctx.putImageData(imageData, 0, 0, 0, 0, 1080, 1080);
          } else if (filter === "technicolor") {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const red = data[i];
              const green = data[i + 1];
              const blue = data[i + 2];

              data[i] = Math.min(
                Math.round(0.393 * red + 0.769 * green + 0.189 * blue),
                255
              );
              data[i + 1] = Math.min(
                Math.round(0.349 * red + 0.686 * green + 0.168 * blue),
                255
              );
              data[i + 2] = Math.min(
                Math.round(0.572 * red + 0.734 * green + 0.331 * blue),
                255
              );
            }

            ctx.putImageData(imageData, 0, 0, 0, 0, 1080, 1080);
          } else if (filter === "polaroid") {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const red = data[i];
              const green = data[i + 1];
              const blue = data[i + 2];

              data[i] = Math.min(
                Math.round(0.593 * red + 0.869 * green + 0.289 * blue),
                255
              );
              data[i + 1] = Math.min(
                Math.round(0.549 * red + 0.786 * green + 0.268 * blue),
                255
              );
              data[i + 2] = Math.min(
                Math.round(0.572 * red + 0.734 * green + 0.231 * blue),
                255
              );
            }

            ctx.putImageData(imageData, 0, 0, 0, 0, 1080, 1080);
          } else if (filter === "bw") {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // red
              data[i + 1] = avg; // green
              data[i + 2] = avg; // blue
            }
            ctx.putImageData(imageData, 0, 0, 0, 0, 1080, 1080);
          }
        }
      };

      img.play = function () {
        status = PLAY;
        this.dirty = true;
      };
      img.pause = function () {
        status = PAUSE;
        this.dirty = false;
      };
      img.stop = function () {
        status = STOP;
        this.dirty = false;
      };
      img.getStatus = () => ["Playing", "Paused", "Stopped"][status];

      img.play();
      resolve(img);
    });
  });
};
