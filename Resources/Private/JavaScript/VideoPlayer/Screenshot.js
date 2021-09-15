const $ = require('jquery');

function renderScreenshot(videoDomElement) {
  // add canvas overlay to DOM
  var domElement = $("<div id='screenshot-overlay'><span class='close-screenshot-modal icon-close'></span><canvas id='screenshot-canvas'></canvas></div>");
  $('body').append(domElement);

  // bind close action
  $('.close-screenshot-modal').bind('click', function () {
    $('#screenshot-overlay').detach();
  });

  // lets go
  const canvas = document.getElementById('screenshot-canvas');
  const metadataElement = document.getElementById('metadata');
  const metadataArray = generateMetadataObject(metadataElement);
  drawCanvas(canvas, videoDomElement, metadataArray);
}

/**
 *
 * @param {HTMLCanvasElement | CanvasRenderingContext2D} target Canvas on which the screenshot is drawn
 * @param {HTMLVideoElement} videoDomElement Source video element from which the screenshot is taken
 * @param {any} metadataArray Output of {@link generateMetadataObject}
 */
function drawCanvas(target, videoDomElement, metadataArray) {
  const [targetCanvas, context] =
    target instanceof HTMLCanvasElement
      ? [target, target.getContext('2d')]
      : [target.canvas, target];

  const infoString =
    metadataArray.screenshotFields
      .map(field => metadataArray.metadata[field])
      .filter(value => typeof value === 'string')
      .join(' / ');

  targetCanvas.width = videoDomElement.videoWidth;
  targetCanvas.height = videoDomElement.videoHeight;

  context.drawImage(videoDomElement, 0, 0, targetCanvas.width, targetCanvas.height);

  context.font = '25px Arial';
  context.textAlign = 'end';
  context.fillStyle = "#FFFFFF";
  context.shadowBlur = 5;
  context.shadowColor = "black";
  context.fillText(infoString, targetCanvas.width - 10, targetCanvas.height - 10);

  targetCanvas.style.width = '80%';
  targetCanvas.style.height = 'auto';
}

/**
 *
 * @param {HTMLDataElement} dataDomElement
 */
function generateMetadataObject(dataDomElement) {
  var metadataObject = {
    metadata: {},
    screenshotFields: dataDomElement.getAttribute('data-screenshotfields').split(','),
  };

  for (const child of dataDomElement.children) {
    if (child.value) {
      metadataObject.metadata[child.id] = child.value;
    }
  }

  return metadataObject;
}

module.exports = { drawCanvas, renderScreenshot, generateMetadataObject };
