// ===========================================================
// CONFIG — update these URLs to match your deployment
// ===========================================================
const IAM_URL     = "http://localhost:8080"; // IAM service (Spring Boot on port 8085)
const REQUEST_API = "http://localhost:8085/api/request/api/request";          // Caves service (served by same origin)

// ===========================================================
// AUTH GUARD — redirect to login if not authenticated
// ===========================================================
(async function authGuard() {
  const token = sessionStorage.getItem("jwt");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${IAM_URL}/api/users/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      // Token expired or invalid — clear and redirect
      sessionStorage.removeItem("jwt");
      window.location.href = "login.html";
      return;
    }

    const profile = await res.json();

    // If the account is not ACTIVE, block access
    if (profile.status !== "ACTIVE") {
      sessionStorage.removeItem("jwt");
      window.location.href = "login.html?reason=pending";
      return;
    }

    // Store email for use in UI
    sessionStorage.setItem("userEmail", profile.email);
    initUI(); // Only initialise the UI after auth passes

  } catch (err) {
    console.error("Auth guard error:", err);
    // Don't redirect on network error — the page may still be usable
    initUI();
  }
})();


// ===========================================================
// MAIN UI — only runs after auth check passes
// ===========================================================
function initUI() {

  // --------------------
  // Elements
  // --------------------
  const layersBtn          = document.getElementById("layersBtn");
  const filterMenu         = document.getElementById("filterMenu");
  const loginBtn           = document.getElementById("loginBtn");
  const openRequestModalBtn = document.getElementById("openRequestModal");
  const requestModal       = document.getElementById("requestModal");
  const closeRequestModalBtn = document.getElementById("closeRequestModal");
  const requestForm        = document.getElementById("requestForm");
  const reqName            = document.getElementById("reqName");
  const reqEmail           = document.getElementById("reqEmail");
  const reqText            = document.getElementById("reqText");
  const requestStatus      = document.getElementById("requestStatus");
  const toast              = document.getElementById("toast");
  const filterPanel        = document.getElementById("filterPanel");
  const filterToggleBtn    = document.getElementById("filterToggleBtn");
  const authModal          = document.getElementById("authModal");

  // --------------------
  // Update the login button to show email + logout
  // --------------------
  const userEmail = sessionStorage.getItem("userEmail");
  if (loginBtn && userEmail) {
    loginBtn.textContent = `👤 ${userEmail}`;
    loginBtn.title = "Click to sign out";
    loginBtn.style.fontSize = "12px";
    loginBtn.style.background = "rgba(91,170,91,0.15)";
    loginBtn.style.borderColor = "rgba(91,170,91,0.4)";
  }

  // --------------------
  // Toast
  // --------------------
  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.style.background = type === "error" ? "#e05252" : "#22c55e";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  // --------------------
  // Menu (☰)
  // --------------------
  function closeFilterMenu() {
    filterMenu.classList.remove("show");
    filterMenu.setAttribute("aria-hidden", "true");
  }

  function toggleFilterMenu() {
    const isOpen = filterMenu.classList.toggle("show");
    filterMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  layersBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFilterMenu();
  });

  // --------------------
  // Filter panel (optional)
  // --------------------
  if (filterToggleBtn && filterPanel) {
    filterToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      filterPanel.classList.toggle("show");
    });
  }

  // --------------------
  // Logout
  // --------------------
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeFilterMenu();
      if (confirm("Sign out of Speleofinder?")) {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("userEmail");
        window.location.href = "login.html";
      }
    });
  }

  // --------------------
  // Request Modal
  // --------------------
  function openRequestModal() {
    requestModal.classList.add("show");
    requestModal.setAttribute("aria-hidden", "false");
    requestStatus.textContent = "";
    setTimeout(() => reqName.focus(), 0);
  }

  function closeRequestModal() {
    requestModal.classList.remove("show");
    requestModal.setAttribute("aria-hidden", "true");
  }

  openRequestModalBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeFilterMenu();
    openRequestModal();
  });

  closeRequestModalBtn.addEventListener("click", closeRequestModal);

  requestModal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close === "true") closeRequestModal();
  });

  // --------------------
  // Request Form — sends JWT in Authorization header
  // --------------------
  requestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name        = reqName.value.trim();
    const email       = reqEmail.value.trim();
    const requestText = reqText.value.trim();

    if (!name || !email || !requestText) {
      requestStatus.textContent = "Please fill Name, Email, and Request.";
      return;
    }
    if (!isValidEmail(email)) {
      requestStatus.textContent = "Please enter a valid email.";
      return;
    }

    requestStatus.textContent = "Sending…";

    const token = sessionStorage.getItem("jwt");

    try {
      const res = await fetch(REQUEST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name, email, request: requestText })
      });

      if (res.status === 401 || res.status === 403) {
        // Session expired
        sessionStorage.removeItem("jwt");
        window.location.href = "login.html";
        return;
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Request API failed:", res.status, errText);
        requestStatus.textContent = "Failed to send. Please try again.";
        return;
      }

      requestStatus.textContent = "";
      reqName.value = "";
      reqEmail.value = "";
      reqText.value = "";
      closeRequestModal();
      showToast("Request sent successfully!");

    } catch (err) {
      console.error(err);
      requestStatus.textContent = "Server not reachable. Is Spring Boot running?";
    }
  });

  // --------------------
  // Close on outside click + ESC
  // --------------------
  document.addEventListener("click", (e) => {
    const clickedMenu = filterMenu.contains(e.target) || layersBtn.contains(e.target);
    if (!clickedMenu) closeFilterMenu();

    if (filterPanel && filterPanel.classList.contains("show")) {
      const clickedFilter = filterPanel.contains(e.target) ||
        (filterToggleBtn && filterToggleBtn.contains(e.target));
      if (!clickedFilter) filterPanel.classList.remove("show");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFilterMenu();
      if (filterPanel) filterPanel.classList.remove("show");
      closeRequestModal();
    }
  });

} // end initUI()

// --------------------
// Helpers
// --------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}