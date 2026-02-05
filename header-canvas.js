console.log("header-canvas.js loaded");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cellSize = 30;
const maxSize = 30;

let mouseX = window.innerWidth * 0.25;
let mouseY = window.innerHeight * 0.5;

let numX = 0;
let numY = 0;
let things = [];

function clamp(value, min = 0, max = 1) {
  return value <= min ? min : value >= max ? max : value;
}

function throttled(fn) {
  let didRequest = false;
  return (param) => {
    if (!didRequest) {
      requestAnimationFrame(() => {
        fn(param);
        didRequest = false;
      });
      didRequest = true;
    }
  };
}

function sizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // reset transform before scaling (important on resize)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function makeThings() {
  things = [];
  for (let y = 0; y < numY; y++) {
    for (let x = 0; x < numX; x++) {
      things.push({
        x: x * cellSize + cellSize * 0.5,
        y: y * cellSize + cellSize * 0.5,
        r: 2,
      });
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#000057";

  for (const t of things) {
    const dx = mouseX - t.x;
    const dy = mouseY - t.y;
    const dist = Math.hypot(dx, dy);

    // same vibe as your original: radius grows with distance^2
    t.r = clamp(dist * dist * 0.0003 - 1, 0, maxSize);

    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleResize() {
  sizeCanvas();
  numX = Math.ceil(window.innerWidth / cellSize);
  numY = Math.ceil(window.innerHeight / cellSize);
  makeThings();
  draw();
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  draw();
}

window.addEventListener("resize", throttled(handleResize));
window.addEventListener("mousemove", throttled(handleMouseMove));

handleResize();