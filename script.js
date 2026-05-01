const fileInput = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');
const workspace = document.getElementById('workspace');
const originalCanvas = document.getElementById('original');
const outputCanvas = document.getElementById('output');
const pixelSizeInput = document.getElementById('pixel-size');
const pixelValueLabel = document.getElementById('pixel-value');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

let currentImage = null;
let bwMode = false;

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImage(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) loadImage(fileInput.files[0]);
});

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      drawOriginal(img);
      pixelate(img, parseInt(pixelSizeInput.value));
      uploadZone.classList.add('hidden');
      workspace.classList.remove('hidden');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function drawOriginal(img) {
  originalCanvas.width = img.naturalWidth;
  originalCanvas.height = img.naturalHeight;
  originalCanvas.getContext('2d').drawImage(img, 0, 0);
}

function pixelate(img, blockSize) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const smallW = Math.max(1, Math.floor(w / blockSize));
  const smallH = Math.max(1, Math.floor(h / blockSize));

  const offscreen = document.createElement('canvas');
  offscreen.width = smallW;
  offscreen.height = smallH;
  const offCtx = offscreen.getContext('2d');
  offCtx.drawImage(img, 0, 0, smallW, smallH);

  if (bwMode) {
    const imageData = offCtx.getImageData(0, 0, smallW, smallH);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = lum;
    }
    offCtx.putImageData(imageData, 0, 0);
  }

  outputCanvas.width = w;
  outputCanvas.height = h;
  const ctx = outputCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offscreen, 0, 0, w, h);
}

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    bwMode = btn.dataset.mode === 'bw';
    if (currentImage) pixelate(currentImage, parseInt(pixelSizeInput.value));
  });
});

pixelSizeInput.addEventListener('input', () => {
  const val = parseInt(pixelSizeInput.value);
  pixelValueLabel.textContent = val;
  if (currentImage) pixelate(currentImage, val);
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'pixel-art.png';
  link.href = outputCanvas.toDataURL('image/png');
  link.click();
});

resetBtn.addEventListener('click', () => {
  currentImage = null;
  fileInput.value = '';
  workspace.classList.add('hidden');
  uploadZone.classList.remove('hidden');
});
