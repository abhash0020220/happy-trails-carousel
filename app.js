/* Happy Trails Dog Walking — Carousel Generator
 * Colors sampled directly from the original Canva reference PNGs via PIL pixel sampling.
 */

const GREEN = "#135C48";
const CREAM = "#FBF3DC";
const GOLD = "#EFD389";
const TAN = "#D9A45C";
const TAN_DARK = "#B5793A";
const LEASH_RED = "#C0392B";

const W = 1080;
const H = 1350;
const BORDER = 40;
const FONT = "Baloo 2";

const HOOKS = [
  "Looking for a dog walker in the Cambrian area?",
  "Going out of town? Your dog doesn't have to be alone.",
  "Who's watching your dog while you're at work?",
  "Cambrian pet parents: your dog walker is one click away.",
  "Tired of rushing home for the dog?",
  "Your dog deserves a midday walk too.",
  "Need a trustworthy dog walker nearby?",
  "Vacation coming up? Book your dog's sitter now.",
  "Reliable, local, and dog-obsessed — that's us.",
  "Your neighbor's teens are already booked. Are you?",
  "Same-day dog walks available in Cambrian.",
  "Stop worrying about who's letting the dog out.",
  "Busy schedule? We'll walk your dog for you.",
  "Local teens, trusted by Cambrian dog owners.",
  "Your dog's new favorite part of the day.",
  "Short-term dogsitting, done right.",
  "One walk could make your dog's whole day.",
  "Cambrian's go-to dog walking crew.",
];

const ROTATION_KEY = "htdw_hook_index";

function getRotationIndex() {
  const raw = localStorage.getItem(ROTATION_KEY);
  const n = raw === null ? 0 : parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 && n < HOOKS.length ? n : 0;
}

function setRotationIndex(i) {
  localStorage.setItem(ROTATION_KEY, String(i));
}

// ---------- canvas text helpers ----------

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// draws centered multiline text starting at startY (baseline of first line), returns Y after last line
function drawCenteredLines(ctx, lines, centerX, startY, lineHeight) {
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, centerX, y);
    y += lineHeight;
  }
  return y - lineHeight;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- frame ----------

function drawFrame(ctx, bgColor) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = BORDER;
  ctx.strokeRect(BORDER / 2, BORDER / 2, W - BORDER, H - BORDER);
}

// ---------- dog logo (drawn directly with canvas paths, no external asset) ----------

function drawDogBadge(ctx, cx, cy, r) {
  // badge circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = CREAM;
  ctx.fill();
  ctx.restore();

  // running dog silhouette, drawn relative to badge (offset up so text fits below)
  ctx.save();
  const ox = cx - 90;
  const oy = cy - 90;
  const s = r / 170; // scale factor so art fits nicely inside circle

  ctx.translate(ox, oy);
  ctx.scale(s, s);

  // back legs (two, running pose) — drawn first so the body overlaps them
  ctx.beginPath();
  ctx.moveTo(65, 88);
  ctx.quadraticCurveTo(55, 125, 32, 150);
  ctx.lineTo(48, 156);
  ctx.quadraticCurveTo(75, 128, 83, 92);
  ctx.closePath();
  ctx.fillStyle = TAN_DARK;
  ctx.fill();

  // tail (curved, tapering, attached to rear of body)
  ctx.beginPath();
  ctx.moveTo(55, 55);
  ctx.quadraticCurveTo(15, 35, 5, -5);
  ctx.quadraticCurveTo(25, -15, 45, 10);
  ctx.quadraticCurveTo(60, 30, 68, 58);
  ctx.closePath();
  ctx.fillStyle = TAN_DARK;
  ctx.fill();

  // body
  ctx.beginPath();
  ctx.moveTo(45, 65);
  ctx.quadraticCurveTo(35, 32, 78, 25);
  ctx.quadraticCurveTo(145, 12, 178, 42);
  ctx.quadraticCurveTo(192, 58, 176, 82);
  ctx.quadraticCurveTo(120, 98, 72, 93);
  ctx.quadraticCurveTo(48, 88, 45, 65);
  ctx.closePath();
  ctx.fillStyle = TAN;
  ctx.fill();

  // front legs
  ctx.beginPath();
  ctx.moveTo(112, 90);
  ctx.quadraticCurveTo(110, 124, 96, 150);
  ctx.lineTo(112, 156);
  ctx.quadraticCurveTo(130, 122, 130, 88);
  ctx.closePath();
  ctx.fillStyle = TAN_DARK;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(158, 83);
  ctx.quadraticCurveTo(163, 118, 148, 150);
  ctx.lineTo(164, 156);
  ctx.quadraticCurveTo(184, 118, 180, 80);
  ctx.closePath();
  ctx.fillStyle = TAN;
  ctx.fill();

  // ear (behind head)
  ctx.beginPath();
  ctx.moveTo(178, 18);
  ctx.quadraticCurveTo(160, 2, 168, 28);
  ctx.quadraticCurveTo(176, 38, 188, 26);
  ctx.closePath();
  ctx.fillStyle = TAN_DARK;
  ctx.fill();

  // head
  ctx.beginPath();
  ctx.arc(195, 38, 30, 0, Math.PI * 2);
  ctx.fillStyle = TAN;
  ctx.fill();

  // snout
  ctx.beginPath();
  ctx.ellipse(221, 46, 15, 10, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = TAN;
  ctx.fill();

  // nose
  ctx.beginPath();
  ctx.arc(232, 44, 4, 0, Math.PI * 2);
  ctx.fillStyle = GREEN;
  ctx.fill();

  // eye
  ctx.beginPath();
  ctx.arc(205, 30, 3, 0, Math.PI * 2);
  ctx.fillStyle = GREEN;
  ctx.fill();

  // collar (ring around neck, drawn on top of head/body seam)
  ctx.beginPath();
  ctx.ellipse(192, 60, 14, 8, -0.3, 0, Math.PI * 2);
  ctx.strokeStyle = LEASH_RED;
  ctx.lineWidth = 6;
  ctx.stroke();

  // leash trailing up and back from the collar
  ctx.beginPath();
  ctx.moveTo(200, 55);
  ctx.quadraticCurveTo(235, 20, 215, -25);
  ctx.strokeStyle = LEASH_RED;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.restore();
}

// ---------- curly arrow (hand-drawn style) ----------

function drawCurlyArrow(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = GREEN;
  ctx.fillStyle = GREEN;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // looping curl then a straight-ish tail to the arrowhead
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(40, -10, 60, 20, 35, 35);
  ctx.bezierCurveTo(10, 50, 20, 15, 55, 25);
  ctx.bezierCurveTo(90, 35, 120, 30, 150, 35);
  ctx.stroke();

  // arrowhead at end (~150,35), pointing right/down
  const tipX = 150,
    tipY = 35;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - 18, tipY - 14);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - 22, tipY + 6);
  ctx.stroke();

  ctx.restore();
}

// ---------- Slide 1 ----------

function drawSlide1(ctx, hookText) {
  drawFrame(ctx, GOLD);

  const cx = W / 2;
  const badgeCy = 415;
  const badgeR = 300;
  drawDogBadge(ctx, cx, badgeCy, badgeR);

  ctx.fillStyle = GREEN;
  ctx.textAlign = "center";
  ctx.font = `800 62px "${FONT}"`;
  ctx.fillText("Happy Trails", cx, badgeCy + 190);
  ctx.font = `800 36px "${FONT}"`;
  ctx.fillText("Dog Walking", cx, badgeCy + 240);

  // rotating hook headline
  let y = badgeCy + badgeR + 100;
  ctx.font = `800 58px "${FONT}"`;
  const maxWidth = W - BORDER * 2 - 100;
  const hookLines = wrapText(ctx, hookText, maxWidth);
  const hookLineHeight = 68;
  y = drawCenteredLines(ctx, hookLines, cx, y, hookLineHeight) + hookLineHeight + 50;

  // fixed mission statement
  ctx.font = `800 42px "${FONT}"`;
  const missionText =
    "We're a dog walking and pet care company run by local teens in the Cambrian area.";
  const missionLines = wrapText(ctx, missionText, maxWidth);
  drawCenteredLines(ctx, missionLines, cx, y, 52);
}

// ---------- Slide 2 ----------

function drawSlide2(ctx, photoImg, dogName) {
  drawFrame(ctx, CREAM);

  const leftX = BORDER + 60;
  const maxLeftWidth = 480;

  ctx.fillStyle = GREEN;
  ctx.textAlign = "left";
  ctx.font = `800 52px "${FONT}"`;
  const headline =
    "We offer walking, visiting for feeding, water, and pets, and short-term dogsitting";
  const headlineLines = wrapText(ctx, headline, maxLeftWidth);
  let y = 150;
  const lh1 = 62;
  for (const line of headlineLines) {
    ctx.fillText(line, leftX, y);
    y += lh1;
  }

  // rates block, right side
  const rightX = W - BORDER - 60;
  ctx.textAlign = "right";
  ctx.font = `800 34px "${FONT}"`;
  const rates = ["Rates:", "$15/walk", "$15/visit for", "water, food,", "playtime"];
  let ry = 200;
  const lh2 = 44;
  for (const line of rates) {
    ctx.fillText(line, rightX, ry);
    ry += lh2;
  }

  // photo frame, bottom-right
  const photoW = 430;
  const photoH = 430;
  const photoX = W - BORDER - 60 - photoW;
  const photoY = H - BORDER - 90 - photoH;
  const radius = 28;

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, radius);
  ctx.clip();
  if (photoImg) {
    // cover-fit
    const ir = photoImg.width / photoImg.height;
    const fr = photoW / photoH;
    let dw, dh, dx, dy;
    if (ir > fr) {
      dh = photoH;
      dw = dh * ir;
      dx = photoX - (dw - photoW) / 2;
      dy = photoY;
    } else {
      dw = photoW;
      dh = dw / ir;
      dx = photoX;
      dy = photoY - (dh - photoH) / 2;
    }
    ctx.drawImage(photoImg, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = "#DDD";
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, radius);
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.restore();

  // dog name label + curly arrow, bottom-left near photo
  const labelX = leftX;
  const labelY = photoY + 70;
  ctx.textAlign = "left";
  ctx.fillStyle = GREEN;
  ctx.font = `800 44px "${FONT}"`;
  ctx.fillText(dogName || "Dog", labelX, labelY);

  drawCurlyArrow(ctx, labelX + 10, labelY + 30);
}

// ---------- Slide 3 (fixed, never changes) ----------

function drawSlide3(ctx) {
  drawFrame(ctx, CREAM);

  const cx = W / 2;
  ctx.fillStyle = GREEN;
  ctx.textAlign = "center";

  let y = 220;
  ctx.font = `800 64px "${FONT}"`;
  ctx.fillText("Contact at:", cx, y);

  y += 150;
  ctx.font = `800 58px "${FONT}"`;
  ctx.fillText("669-250-9410", cx, y);

  y += 150;
  ctx.font = `800 52px "${FONT}"`;
  ctx.fillText("happytrailspetcare365", cx, y);
  y += 62;
  ctx.fillText("@gmail.com", cx, y);

  y += 130;
  ctx.font = `800 60px "${FONT}"`;
  ctx.fillText("Thank you!", cx, y);

  y += 150;
  ctx.font = `700 36px "${FONT}"`;
  ctx.fillText("Any business is much appreciated.", cx, y);
  y += 48;
  ctx.fillText("Please feel free to refer us to anyone", cx, y);
  y += 48;
  ctx.fillText("you may know who is looking for pet care.", cx, y);
}

// ---------- wiring ----------

const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

const hookTextEl = document.getElementById("hookText");
const hookPosEl = document.getElementById("hookPos");
const shuffleBtn = document.getElementById("shuffleBtn");
const dogNameEl = document.getElementById("dogName");
const photoInputEl = document.getElementById("photoInput");
const generateBtn = document.getElementById("generateBtn");

let currentPhotoImg = null;
const placeholderPhoto = new Image();
placeholderPhoto.src = "placeholder-dog.png";
placeholderPhoto.onload = () => {
  if (!currentPhotoImg) {
    currentPhotoImg = placeholderPhoto;
    renderAll();
  }
};

function updateHookPos() {
  const i = getRotationIndex();
  hookPosEl.textContent = `(preset ${i + 1} of ${HOOKS.length})`;
}

function loadCurrentHookIntoBox() {
  const i = getRotationIndex();
  hookTextEl.value = HOOKS[i];
  updateHookPos();
}

function renderAll() {
  drawSlide1(ctx1, hookTextEl.value || HOOKS[getRotationIndex()]);
  drawSlide2(ctx2, currentPhotoImg, dogNameEl.value);
  drawSlide3(ctx3);
}

shuffleBtn.addEventListener("click", () => {
  const next = (getRotationIndex() + 1) % HOOKS.length;
  setRotationIndex(next);
  loadCurrentHookIntoBox();
  renderAll();
});

dogNameEl.addEventListener("input", renderAll);

photoInputEl.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      currentPhotoImg = img;
      renderAll();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

hookTextEl.addEventListener("input", renderAll);

function downloadCanvas(canvas, filename) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      resolve();
    }, "image/png");
  });
}

generateBtn.addEventListener("click", async () => {
  renderAll();
  await downloadCanvas(canvas1, "slide-1-hook.png");
  await new Promise((r) => setTimeout(r, 250));
  await downloadCanvas(canvas2, "slide-2-services.png");
  await new Promise((r) => setTimeout(r, 250));
  await downloadCanvas(canvas3, "slide-3-contact.png");

  // advance rotation index for next generation
  const next = (getRotationIndex() + 1) % HOOKS.length;
  setRotationIndex(next);
  loadCurrentHookIntoBox();
  renderAll();
});

// ---------- init ----------

async function init() {
  loadCurrentHookIntoBox();
  renderAll(); // draw immediately with fallback font so the page isn't blank

  // canvas text doesn't trigger the browser's automatic webfont fetch, so
  // request the exact weights we use explicitly and re-render once ready.
  if (document.fonts && document.fonts.load) {
    try {
      await Promise.all([
        document.fonts.load(`800 16px "${FONT}"`),
        document.fonts.load(`700 16px "${FONT}"`),
      ]);
    } catch (e) {
      /* font failed to load; fallback font will be used */
    }
  }
  renderAll();
}

init();
