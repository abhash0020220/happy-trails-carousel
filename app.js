/* Happy Trails Dog Walking — Carousel Generator
 * Colors sampled directly from the original Canva reference PNGs via PIL pixel sampling.
 */

const GREEN = "#135C48";
const CREAM = "#FBF3DC";
const GOLD = "#EFD389";

const W = 1080;
const H = 1350;
const BORDER = 40;
const FONT = "Baloo 2";

// Cloudflare Worker that holds the Gemini API key server-side and proxies
// caption requests. See worker/ for the source.
const CAPTION_API_URL = "https://happy-trails-caption-proxy.happytrailsdogwalking.workers.dev";

const MISSION_TEXT =
  "We're a dog walking and pet care company run by local teens in the Cambrian area.";
const SERVICES_TEXT =
  "We offer walking, visiting for feeding, water, and pets, and short-term dogsitting";
const RATES_TEXT = "$15/walk, $15/visit for water, food, playtime";
const PHONE_TEXT = "669-250-9410";
const EMAIL_LINE1 = "happytrailspetcare365";
const EMAIL_LINE2 = "@gmail.com";

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

// ---------- dog logo (raster artwork supplied by the brand, drawn onto the badge) ----------

const dogLogoImg = new Image();
let dogLogoLoaded = false;
dogLogoImg.src = "dog-logo.png";
dogLogoImg.onload = () => {
  dogLogoLoaded = true;
  if (typeof renderAll === "function") renderAll();
};

function drawDogBadge(ctx, cx, cy, r) {
  // badge circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = CREAM;
  ctx.fill();
  ctx.restore();

  if (!dogLogoLoaded) return;

  // fit the artwork into the upper portion of the circle, leaving room
  // below for the "Happy Trails / Dog Walking" wordmark
  const artW = r * 1.27;
  const artH = artW * (dogLogoImg.height / dogLogoImg.width);
  const artX = cx - artW / 2;
  const artY = cy - r * 0.72;
  ctx.drawImage(dogLogoImg, artX, artY, artW, artH);
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
  const missionLines = wrapText(ctx, MISSION_TEXT, maxWidth);
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
  const headlineLines = wrapText(ctx, SERVICES_TEXT, maxLeftWidth);
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

// ---------- Post-walk "thank you" post (single slide) ----------

function drawPostSlide(ctx, photoImg, dogName, blurb) {
  drawFrame(ctx, CREAM);

  const cx = W / 2;
  const name = dogName || "pup";

  // photo, large and centered near the top
  const photoW = 650;
  const photoH = 580;
  const photoX = cx - photoW / 2;
  const photoY = 110;
  const radius = 28;

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, radius);
  ctx.clip();
  if (photoImg) {
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

  const maxWidth = W - BORDER * 2 - 100;
  let y = photoY + photoH + 90;

  // headline: "Thank you for walking with me today, {name}!"
  ctx.fillStyle = GREEN;
  ctx.textAlign = "center";
  ctx.font = `800 50px "${FONT}"`;
  const headlineLines = wrapText(ctx, `Thank you for walking with me today, ${name}!`, maxWidth);
  const headlineLineHeight = 60;
  y = drawCenteredLines(ctx, headlineLines, cx, y, headlineLineHeight) + headlineLineHeight + 40;

  // blurb
  if (blurb && blurb.trim()) {
    ctx.font = `700 36px "${FONT}"`;
    const blurbLines = wrapText(ctx, blurb.trim(), maxWidth);
    y = drawCenteredLines(ctx, blurbLines, cx, y, 46) + 46;
  }

  // bottom CTA / business footer, anchored near the bottom border
  const footerSepY = H - 260;
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 260, footerSepY);
  ctx.lineTo(cx + 260, footerSepY);
  ctx.stroke();

  ctx.fillStyle = GREEN;
  ctx.font = `800 44px "${FONT}"`;
  ctx.fillText("Book your next walk!", cx, H - 195);

  ctx.font = `700 34px "${FONT}"`;
  ctx.fillText(PHONE_TEXT, cx, H - 140);
  ctx.fillText(`${EMAIL_LINE1}${EMAIL_LINE2}`, cx, H - 95);
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
  ctx.fillText(PHONE_TEXT, cx, y);

  y += 150;
  ctx.font = `800 52px "${FONT}"`;
  ctx.fillText(EMAIL_LINE1, cx, y);
  y += 62;
  ctx.fillText(EMAIL_LINE2, cx, y);

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
const canvasPost = document.getElementById("canvasPost");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");
const ctxPost = canvasPost.getContext("2d");

const hookTextEl = document.getElementById("hookText");
const hookPosEl = document.getElementById("hookPos");
const shuffleBtn = document.getElementById("shuffleBtn");
const dogNameEl = document.getElementById("dogName");
const photoInputEl = document.getElementById("photoInput");
const generateBtn = document.getElementById("generateBtn");
const captionTextEl = document.getElementById("captionText");
const captionBtn = document.getElementById("captionBtn");
const copyCaptionBtn = document.getElementById("copyCaptionBtn");
const captionStatusEl = document.getElementById("captionStatus");

const postDogNameEl = document.getElementById("postDogName");
const postPhotoInputEl = document.getElementById("postPhotoInput");
const postBlurbEl = document.getElementById("postBlurb");
const postDownloadBtn = document.getElementById("postDownloadBtn");
const postShareBtn = document.getElementById("postShareBtn");
const postShareStatusEl = document.getElementById("postShareStatus");

let currentPhotoImg = null;
let currentPostPhotoImg = null;
const placeholderPhoto = new Image();
placeholderPhoto.src = "placeholder-dog.png";
placeholderPhoto.onload = () => {
  if (!currentPhotoImg) {
    currentPhotoImg = placeholderPhoto;
    renderAll();
  }
  if (!currentPostPhotoImg) {
    currentPostPhotoImg = placeholderPhoto;
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
  drawPostSlide(ctxPost, currentPostPhotoImg, postDogNameEl.value, postBlurbEl.value);
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

postDogNameEl.addEventListener("input", renderAll);
postBlurbEl.addEventListener("input", renderAll);

postPhotoInputEl.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      currentPostPhotoImg = img;
      renderAll();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

async function generateCaption() {
  captionStatusEl.textContent = "Generating...";
  captionBtn.disabled = true;
  try {
    const res = await fetch(CAPTION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hook: hookTextEl.value || HOOKS[getRotationIndex()],
        mission: MISSION_TEXT,
        services: SERVICES_TEXT,
        rates: RATES_TEXT,
        dogName: dogNameEl.value || "our pup",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    captionTextEl.value = data.caption;
    captionStatusEl.textContent = "";
  } catch (err) {
    captionStatusEl.textContent = `Error: ${err.message}`;
  } finally {
    captionBtn.disabled = false;
  }
}

captionBtn.addEventListener("click", generateCaption);

copyCaptionBtn.addEventListener("click", async () => {
  if (!captionTextEl.value) return;
  try {
    await navigator.clipboard.writeText(captionTextEl.value);
    captionStatusEl.textContent = "Copied!";
    setTimeout(() => {
      if (captionStatusEl.textContent === "Copied!") captionStatusEl.textContent = "";
    }, 1500);
  } catch {
    captionTextEl.select();
    document.execCommand("copy");
  }
});

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

postDownloadBtn.addEventListener("click", async () => {
  renderAll();
  const name = (postDogNameEl.value || "dog").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await downloadCanvas(canvasPost, `post-thank-you-${name || "dog"}.png`);
});

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

postShareBtn.addEventListener("click", async () => {
  renderAll();
  const name = (postDogNameEl.value || "dog").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const blob = await canvasToBlob(canvasPost);
  const file = new File([blob], `post-thank-you-${name || "dog"}.png`, { type: "image/png" });

  const shareData = {
    files: [file],
    title: "Happy Trails Dog Walking",
    text: `Thank you for walking with me today, ${postDogNameEl.value || "pup"}! 🐾`,
  };

  if (navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      postShareStatusEl.textContent = "";
    } catch (err) {
      // AbortError just means the user canceled the share sheet — not an error to surface
      if (err.name !== "AbortError") {
        postShareStatusEl.textContent = `Share failed: ${err.message}`;
      }
    }
  } else {
    postShareStatusEl.textContent =
      "Sharing isn't supported here (this needs a phone browser, e.g. Safari on iPhone or Chrome on Android). Use Download Post instead, then open Instagram and post the saved image manually.";
  }
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
