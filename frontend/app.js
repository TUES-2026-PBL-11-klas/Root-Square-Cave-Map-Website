// --------------------
// Zoom controls (mock)
// --------------------
let zoom = 1000;
const scaleText = document.querySelector(".scale");

document.getElementById("zoomIn").onclick = () => {
  zoom -= 100;
  if (zoom < 100) zoom = 100;
  scaleText.textContent = "Scale 1:" + zoom;
};

document.getElementById("zoomOut").onclick = () => {
  zoom += 100;
  scaleText.textContent = "Scale 1:" + zoom;
};


// --------------------
// Bottom-right layers panel toggle
// --------------------
const filterBtn = document.getElementById("filterBtn");
const legendPanel = document.getElementById("legendPanel");

filterBtn.addEventListener("click", () => {
  legendPanel.classList.toggle("show");
});


// --------------------
// Search (mock behavior)
// --------------------
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();

  if (!val) {
    results.innerHTML = "<div>No recent searches</div>";
    return;
  }

  results.innerHTML = `
    <div>Searching for "<b>${escapeHtml(val)}</b>"</div>
    <div>Parcel #1023</div>
    <div>Forest area</div>
    <div>Building permit</div>
  `;
});


// --------------------
// NEW: Top-left filter menu (login/register/request bar)
// --------------------
const layersBtn = document.getElementById("layersBtn");
const filterMenu = document.getElementById("filterMenu");
const closeFilterMenu = document.getElementById("closeFilterMenu");

function openFilterMenu(){
  filterMenu.classList.add("show");
  filterMenu.setAttribute("aria-hidden", "false");
}

function closeMenu(){
  filterMenu.classList.remove("show");
  filterMenu.setAttribute("aria-hidden", "true");
}

layersBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterMenu.classList.toggle("show");
  filterMenu.setAttribute("aria-hidden", filterMenu.classList.contains("show") ? "false" : "true");
});

closeFilterMenu.addEventListener("click", () => closeMenu());

// Close on outside click
document.addEventListener("click", (e) => {
  if (!filterMenu.classList.contains("show")) return;

  const clickedInside = filterMenu.contains(e.target) || layersBtn.contains(e.target);
  if (!clickedInside) closeMenu();
});

// Close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Buttons (placeholders)
document.getElementById("loginBtn").addEventListener("click", () => {
  alert("Login clicked (wire to your auth flow).");
});

document.getElementById("registerBtn").addEventListener("click", () => {
  alert("Register clicked (wire to your register flow).");
});

// Request bar action
const requestInput = document.getElementById("requestInput");
const requestSend = document.getElementById("requestSend");
const requestHint = document.getElementById("requestHint");

function sendRequest(){
  const text = requestInput.value.trim();
  if (!text) {
    requestHint.textContent = "Please type a request first.";
    return;
  }
  requestHint.textContent = `Sent: "${text}" (hook this to your backend)`;
  requestInput.value = "";
}

requestSend.addEventListener("click", sendRequest);

requestInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendRequest();
});


// --------------------
// Helpers
// --------------------
function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}