function renderIcon(icon, bg) {
  return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = 20;

    if (bg == "bgtrue") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(left, top, size / 2 + 2, 0, 2 * Math.PI, false);
      ctx.shadowColor = "#00000055";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.restore();
    }

    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

let deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

let img = document.createElement("img");
img.src = deleteIcon;

var rotateIcon =
  "data:image/svg+xml,%3Csvg height='32px' width='32px' fill='%23000000' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' x='0px' y='0px' viewBox='0 0 33.317 28' enable-background='new 0 0 33.317 28' xml:space='preserve'%3E%3Cpath d='M16.659,24c-5.078,0-9.213-3.987-9.475-9h2.975l-4.5-5l-4.5,5h3.025c0.264,6.671,5.74,12,12.475,12c3.197,0,6.104-1.21,8.315-3.185l-2.122-2.122C21.188,23.127,19.027,24,16.659,24z'%3E%3C/path%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M29.133,14c-0.265-6.669-5.74-12-12.475-12c-3.197,0-6.104,1.21-8.315,3.185l2.122,2.122C12.129,5.873,14.29,5,16.659,5c5.077,0,9.213,3.987,9.475,9h-2.975l4.5,5l4.5-5H29.133z'%3E%3C/path%3E%3C/svg%3E";

var rotateImg = document.createElement("img");
rotateImg.src = rotateIcon;

var scaleIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIXRFWHRDcmVhdGlvbiBUaW1lADIwMjI6MTA6MjggMjE6NDY6NDRjs+NtAAAFJUlEQVR4Xu3dvY9UZRjGYSBYKCAxGon2FjYmdsZCDSCxtBQjWKiVf4y1pd8xMZZoNAHtrNXWxI+AKH4UajQQ0edhh2LxrLMDc855n3euK7lzZidT7Cbnt7Mzszu7BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4NbsXRxbcDB2MnY0diS2L1bd1di3sY9i78Uux2Blx2MXYv90vK9ij8ZgJSdiV2JDJ1Vv+yv2WAx25VDsYmzoZOp152MHYhQw98/5p2P5eGOT3B97dusirZs7kHxAvokeXxxp3NyB3L04bprDiyON6+Gp1IryqV8KEMg8ziyONE4g0/s89uHWRVonkGn9HjsV+/vaRzRPINP5OpbP2uU9CEXM/btYn8TW/ZTnL7Evti424cfYx7E3Y3/mFbBbGcjQq823svzx5ZkYlDdGIDmR0IWxAsmJhPLGDCQnEkobO5CcSChrikByIqGkqQLJiYSVbdILhfm1vhUTCbtWLZBfY/lGCDdLJKykWiD5axrPx0TCRlj1MUjePj0Xy8cUQ7fZ7TwmoXk3G0gSCd27lUCSSOjarQaSREK31hFIEgldWlcgSSR0Z52BJJHQlXUHkkRCN8YIJImELowVSBIJ5Y0ZSBIJpY0dSBIJZU0RSBIJJU0VSBIJ5UwZSBIJpUwdSBIJZcwRSBIJJcwVSBIJzZszkCQSmjZ3IEkkNKuFQJJIaFIrgSSR0JyWAkkioSmtBZJEQjNaDCSJhCa0GkgSCbNrOZAkEmbVeiBJJMymQiBJJMyiSiBJJEyuUiBJJEyqWiBJJEymYiBJJEziXGzo5NlpeftWiITR5b9CGzpxdto7sZaIhFHl/xscOml22oux1oiE0dwe+y42dNLcuG9iefsWiYTRHItdiQ2dNNf3R+yRWMtEwmieil2KDZ00X8YejlUgEkZzOPZy7N3Ymdirsadj+2OViASWEAksIRJYQiSwhEhgCZHAEiKBJUQCS4gElhAJLCESWEIksIRIYIlNjWRf7Hjsldj7sddiL8UOxWCbTYvkgdhnsaGv42LsRAy22ZRIHoz9FBv6/K8v/4gu711gm94juS2WfwQ39HnfuPOxO2KwTc+RnIwNfb477YUY/Eevkaz6Vk9vx2BQj5Gs+m6aZ2Owo94iqfp2szSsp0gEwih6iUQgjKaHSATCqKpHIhBGVzkSgTCJqpEIhMlUjEQgTKpaJAJhcpUiEQizqBKJQJhNhUgEwqxaj0QgzK7lSARCE1qNRCA0o8VIBEJTWotEIDSnpUgEQpNaiUQgNKuFSARC0+aORCA0b85IBEIJc0UiEMqYIxKBUMrUkQiEcqaMRCCUNFUkAqGsKSIRCKWNHYlAKG/MSARCF8aKRCB0Y4xIBEJX1h2JQOjOOiMRCF1aVyQ/33DdsgmEMtYRyaoTCKVMHYlAKGfKSARCSVNFIhDKmiISgVDa2JEIhPLGjEQgdGGsSGYNZO/iSC0HYydjR2NHYvtiLXgodtfWxbX5NPbE1kVY7njsQmzou22Pm/UepJXvPOzOidgHsfuufcToBFLHodjrsf3XPmISAqnjdCwfbzAhgdSRD8iZmEDquHdx3DRXF8dZCKSOHxbHTXNxcZyFQOo4tzhumrOLI/yvO2N5LzL0WkGvOx87EINdyddBrsSGTqbedjnmiQlW9mQsfy4fOql62fexY7HZ+V2smvJFw1Ox/A57T17RiUuxfKz1Ruy3vAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKC0PXv+BeTcjYSFYwqMAAAAAElFTkSuQmCC";

var scaleImg = document.createElement("img");
scaleImg.src = scaleIcon;

fabric.Object.prototype.cornerSize = 40;
fabric.Object.prototype.padding = 7;
fabric.Object.prototype.transparentCorners = false;

fabric.Object.prototype.setControlsVisibility({
  tl: false,
  mt: false,
  tr: true,
  ml: false,
  mr: false,
  bl: false,
  mb: false,
  br: true,
  mtr: false,
});

let controlsUtils = fabric.controlsUtils;

fabric.Object.prototype.controls.tr = new fabric.Control({
  x: 0.5,
  y: -0.5,
  cornerPadding: 0,
  actionHandler: controlsUtils.rotationWithSnapping,
  cursorStyleHandler: controlsUtils.rotationStyleHandler,
  withConnection: true,
  render: renderIcon(rotateImg, "bgtrue"),
  cornerSize: 40,
  actionName: "rotate",
  sizeX: 40,
  sizeY: 40,
  touchSizeX: 40,
  touchSizeY: 40,
});

fabric.Object.prototype.controls.br = new fabric.Control({
  x: 0.5,
  y: 0.5,
  cornerPadding: 0,
  actionHandler: controlsUtils.scalingEqually,
  withConnection: true,
  render: renderIcon(scaleImg, "bgtrue"),
  cornerSize: 40,
  actionName: "scale",
  sizeX: 40,
  sizeY: 40,
  touchSizeX: 40,
  touchSizeY: 40,
});

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: -0.5,
  y: -0.5,
  offsetY: 0,
  cornerPadding: 0,
  cursorStyle: "pointer",
  mouseUpHandler: deleteObject,
  render: renderIcon(img, "bgtrue"),
  sizeX: 40,
  sizeY: 40,
  touchSizeX: 40,
  touchSizeY: 40,
  cornerSize: 40,
});

function deleteObject(eventData, transform) {
  let target = transform.target;
  let canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}
