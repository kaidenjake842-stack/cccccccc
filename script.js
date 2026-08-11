const ASSET_LINK_FALLBACK = "https://discord.com/";
const PREMIUM_LINK = "https://discord.com/";

const assets = [
  {
    id: 1,
    name: "Creator Command Center",
    category: "UI",
    access: "Premium",
    icon: "◈",
    tag: "Featured",
    description: "A polished creator dashboard UI for admin tools, settings, stats, and game management.",
    features: ["Responsive layout", "Modern sidebar", "Dashboard cards", "Easy customization"],
    colors: ["#1b7ca8", "#4e3ea8"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 2,
    name: "Advanced Loading Screen",
    category: "UI",
    access: "Free",
    icon: "◌",
    tag: "Popular",
    description: "Animated loading interface with progress, rotating status messages, and smooth transitions.",
    features: ["Progress bar", "Status messages", "Fade animation", "Skip support"],
    colors: ["#176a80", "#1a355d"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 3,
    name: "Overhead Nametag System",
    category: "Systems",
    access: "Premium",
    icon: "♛",
    tag: "Updated",
    description: "Custom player overheads with ranks, tags, levels, colors, and configurable icons.",
    features: ["Custom ranks", "Level display", "Icons", "Color settings"],
    colors: ["#4e368f", "#b1467c"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 4,
    name: "Gamepass Shop",
    category: "Systems",
    access: "Free",
    icon: "◆",
    tag: "Shop",
    description: "A configurable gamepass storefront system made for custom Roblox interfaces.",
    features: ["Module config", "Purchase prompts", "Grid ready", "Easy setup"],
    colors: ["#9a4f1c", "#5031a0"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 5,
    name: "Aura Shop System",
    category: "Systems",
    access: "Premium",
    icon: "✦",
    tag: "Effects",
    description: "Complete aura storefront with purchase, ownership, equip, and visual effect support.",
    features: ["Buy/equip", "Ownership saving", "Effect support", "Config module"],
    colors: ["#6342b5", "#1f8c98"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 6,
    name: "Announcement System",
    category: "Scripts",
    access: "Free",
    icon: "⚡",
    tag: "Utility",
    description: "Server-wide announcement system with smooth UI animations and configurable staff access.",
    features: ["Remote events", "Admin whitelist", "Animated banner", "Custom duration"],
    colors: ["#194a7a", "#132847"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 7,
    name: "Premium Ticket Panel",
    category: "Discord",
    access: "Premium",
    icon: "✉",
    tag: "Discord",
    description: "Premium-style ticket category layout for support, purchases, reports, and management.",
    features: ["Category layout", "Premium design", "Support ready", "Expandable"],
    colors: ["#5b3ead", "#243b79"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 8,
    name: "Rules Acceptance System",
    category: "Systems",
    access: "Free",
    icon: "✓",
    tag: "Safety",
    description: "Require players to review and accept server rules before entering your game.",
    features: ["Movement lock", "Accept button", "Remote validation", "Respawn support"],
    colors: ["#176f63", "#1f3f67"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 9,
    name: "Neon City Prop Pack",
    category: "Models",
    access: "Premium",
    icon: "▣",
    tag: "Model Pack",
    description: "A futuristic collection of creator-ready city props for modern Roblox maps.",
    features: ["Optimized models", "Neon styling", "Modular pieces", "Creator ready"],
    colors: ["#0b6b95", "#7a2f9d"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 10,
    name: "Gradient UI Pack",
    category: "UI",
    access: "Free",
    icon: "◐",
    tag: "UI Pack",
    description: "Reusable gradients, buttons, cards, and panels for clean modern game interfaces.",
    features: ["Buttons", "Cards", "Gradients", "Reusable components"],
    colors: ["#087fa8", "#a13f8d"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 11,
    name: "Fire Loading Effects",
    category: "Effects",
    access: "Premium",
    icon: "▲",
    tag: "Animated",
    description: "Animated fire-inspired visual effects designed for loading screens and event interfaces.",
    features: ["Animated particles", "UI compatible", "Configurable speed", "Layered effects"],
    colors: ["#a8391f", "#d88721"],
    link: ASSET_LINK_FALLBACK
  },
  {
    id: 12,
    name: "Owner Join Notification",
    category: "Scripts",
    access: "Free",
    icon: "★",
    tag: "Simple",
    description: "Display a clean notification whenever an owner, developer, or special user joins.",
    features: ["User ID lists", "Custom roles", "Join banner", "Easy editing"],
    colors: ["#315785", "#703b8e"],
    link: ASSET_LINK_FALLBACK
  }
];

const assetGrid = document.getElementById("assetGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const categoryChips = document.getElementById("categoryChips");
const assetCount = document.getElementById("assetCount");
const emptyState = document.getElementById("emptyState");
const assetModal = document.getElementById("assetModal");
const closeModal = document.getElementById("closeModal");
const copyAssetButton = document.getElementById("copyAssetButton");
const getAssetButton = document.getElementById("getAssetButton");
const themeButton = document.getElementById("themeButton");
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");
const premiumButton = document.getElementById("premiumButton");

let activeCategory = "All";
let selectedAsset = null;


const BADGE_LABELS = {
  owner: "OWNER",
  admin: "ADMIN",
  staff: "STAFF",
  creator: "CREATOR",
  seller: "SELLER",
  premium: "PREMIUM",
  verified: "VERIFIED",
  early: "EARLY MEMBER"
};

let creators = [
  {
    id: 1,
    name: "Jaiden",
    username: "@JaidenBta5",
    specialty: "Developer & Systems",
    bio: "Builds Roblox systems, interfaces, and creator tools for Asset Hub.",
    badges: ["owner", "creator", "verified"],
    assets: ["Creator Command Center", "Overhead Nametag System", "Gamepass Shop"]
  },
  {
    id: 2,
    name: "Asset Hub Design",
    username: "@AssetHubDesign",
    specialty: "UI & Visual Design",
    bio: "Focused on clean creator interfaces, gradients, cards, and marketplace visuals.",
    badges: ["creator", "verified"],
    assets: ["Gradient UI Pack", "Advanced Loading Screen"]
  },
  {
    id: 3,
    name: "Community Studio",
    username: "@CommunityStudio",
    specialty: "Models & Effects",
    bio: "Creates polished models and effects designed for modern Roblox experiences.",
    badges: ["creator", "premium"],
    assets: ["Neon City Prop Pack", "Fire Loading Effects"]
  }
];

function badgeHTML(badges = []) {
  return badges.map(badge => {
    const label = BADGE_LABELS[badge] || badge.toUpperCase();
    return `<span class="user-badge badge-${badge}">${label}</span>`;
  }).join("");
}

function renderCreators() {
  const grid = document.getElementById("creatorGrid");
  if (!grid) return;

  grid.innerHTML = creators.map(creator => `
    <article class="creator-card">
      <div class="creator-card-top">
        <div class="creator-avatar-large">${creator.name.charAt(0).toUpperCase()}</div>
        <div>
          <h3>${creator.name}</h3>
          <div class="creator-username">${creator.username}</div>
          <div class="badge-row">${badgeHTML(creator.badges)}</div>
        </div>
      </div>
      <div class="creator-specialty">${creator.specialty}</div>
      <p class="creator-bio">${creator.bio}</p>
      <div class="creator-card-footer">
        <span class="creator-asset-count">${creator.assets.length} featured assets</span>
        <button class="mini-button" onclick="openCreatorProfile(${creator.id})">View Profile →</button>
      </div>
    </article>
  `).join("");
}

function openCreatorProfile(id) {
  const creator = creators.find(c => c.id === id);
  if (!creator) return;

  document.getElementById("creatorModalAvatar").textContent = creator.name.charAt(0).toUpperCase();
  document.getElementById("creatorModalName").textContent = creator.name;
  document.getElementById("creatorModalUsername").textContent = creator.username;
  document.getElementById("creatorModalSpecialty").textContent = creator.specialty;
  document.getElementById("creatorModalBio").textContent = creator.bio;
  document.getElementById("creatorModalBadges").innerHTML = badgeHTML(creator.badges);
  document.getElementById("creatorModalAssets").innerHTML = creator.assets.map(name =>
    `<div class="creator-profile-asset"><span>${name}</span><span>Asset Hub</span></div>`
  ).join("");

  document.getElementById("creatorModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
window.openCreatorProfile = openCreatorProfile;

function renderAssets() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedAccess = priceFilter.value;

  const filtered = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm) ||
      asset.description.toLowerCase().includes(searchTerm) ||
      asset.category.toLowerCase().includes(searchTerm);

    const chipMatch = activeCategory === "All" || asset.category === activeCategory;
    const selectMatch = selectedCategory === "All" || asset.category === selectedCategory;
    const accessMatch = selectedAccess === "All" || asset.access === selectedAccess;

    return matchesSearch && chipMatch && selectMatch && accessMatch;
  });

  assetGrid.innerHTML = filtered.map(asset => `
    <article class="asset-card">
      <div class="asset-preview" style="--preview1:${asset.colors[0]};--preview2:${asset.colors[1]}">
        <div class="preview-icon">${asset.icon}</div>
      </div>
      <div class="asset-body">
        <div class="asset-meta">
          <span class="category-pill">${asset.category}</span>
          <span class="access-pill ${asset.access === "Premium" ? "premium" : ""}">${asset.access}</span>
        </div>
        <h3>${asset.name}</h3>
        <p>${asset.description}</p>
        <div class="asset-footer">
          <button class="view-asset" onclick='openAssetById(${JSON.stringify(asset.id)})'>View Asset →</button>
          <span class="asset-tag">${asset.tag}</span>
        </div>
      </div>
    </article>
  `).join("");

  assetCount.textContent = `${filtered.length} asset${filtered.length === 1 ? "" : "s"}`;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
}

function openAssetById(id) {
  const asset = assets.find(item => String(item.id) === String(id));
  if (!asset) return;

  selectedAsset = asset;

  const modalPreview = document.getElementById("modalPreview");
  modalPreview.style.setProperty("--preview1", asset.colors[0]);
  modalPreview.style.setProperty("--preview2", asset.colors[1]);
  modalPreview.textContent = asset.icon;

  document.getElementById("modalCategory").textContent = asset.category;

  const accessEl = document.getElementById("modalAccess");
  accessEl.textContent = asset.access;
  accessEl.className = `access-pill ${asset.access === "Premium" ? "premium" : ""}`;

  document.getElementById("modalTitle").textContent = asset.name;
  document.getElementById("modalDescription").textContent = asset.description;

  document.getElementById("modalFeatures").innerHTML =
    asset.features.map(feature => `<div class="modal-feature">✓ ${feature}</div>`).join("");

  getAssetButton.href = asset.link || ASSET_LINK_FALLBACK;

  assetModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

window.openAssetById = openAssetById;

function hideModal() {
  assetModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function setChip(category) {
  activeCategory = category;
  [...categoryChips.querySelectorAll(".chip")].forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  renderAssets();
}

categoryChips.addEventListener("click", event => {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  setChip(chip.dataset.category);
});

searchInput.addEventListener("input", renderAssets);
categoryFilter.addEventListener("change", () => {
  activeCategory = "All";
  [...categoryChips.querySelectorAll(".chip")].forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === "All");
  });
  renderAssets();
});
priceFilter.addEventListener("change", renderAssets);

closeModal.addEventListener("click", hideModal);

assetModal.addEventListener("click", event => {
  if (event.target === assetModal) hideModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") hideModal();
});

copyAssetButton.addEventListener("click", async () => {
  if (!selectedAsset) return;
  try {
    await navigator.clipboard.writeText(selectedAsset.name);
    showToast("Asset name copied!");
  } catch {
    showToast(selectedAsset.name);
  }
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}



mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.addEventListener("click", event => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("open");
  }
});

premiumButton.href = PREMIUM_LINK;
premiumButton.target = "_blank";
premiumButton.rel = "noopener";

document.getElementById("year").textContent = new Date().getFullYear();

renderAssets();


/* =========================================================
   CUSTOM COLOR PICKER
========================================================= */
const themePicker = document.getElementById("themePicker");
const themeSwatches = document.querySelectorAll(".theme-swatch");
const savedColorTheme = localStorage.getItem("assetHubColor") || "blue";

function applyWebsiteTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  themeSwatches.forEach(swatch => {
    swatch.classList.toggle("active", swatch.dataset.theme === theme);
  });
  localStorage.setItem("assetHubColor", theme);
}

applyWebsiteTheme(savedColorTheme);

themeButton.addEventListener("click", event => {
  event.stopPropagation();
  themePicker.classList.toggle("hidden");
  accountMenu.classList.add("hidden");
});

themeSwatches.forEach(swatch => {
  swatch.addEventListener("click", event => {
    event.stopPropagation();
    applyWebsiteTheme(swatch.dataset.theme);
    themePicker.classList.add("hidden");
    showToast(`${swatch.dataset.theme} theme selected`);
  });
});




/* =========================================================
   ASSET HUB BACKEND CONNECTION
========================================================= */

const API_HOST =
  location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_URL = "https://cccccccc-fo54.onrender.com";


async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("assetHubAuthToken");

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new Error(
      "Could not reach the API. Make sure the backend is running and the request is allowed."
    );
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

/* =========================================================
   ACCOUNT SYSTEM - REAL BACKEND
========================================================= */

const openAccountButton = document.getElementById("openAccountButton");
const accountButtonText = document.getElementById("accountButtonText");
const accountAvatarMini = document.getElementById("accountAvatarMini");
const accountMenu = document.getElementById("accountMenu");
const accountModal = document.getElementById("accountModal");
const closeAccountModal = document.getElementById("closeAccountModal");
const authView = document.getElementById("authView");
const accountDashboard = document.getElementById("accountDashboard");
const authTabs = document.querySelectorAll(".auth-tab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logoutButton = document.getElementById("logoutButton");
const menuName = document.getElementById("menuName");
const menuPlan = document.getElementById("menuPlan");
const menuAvatar = document.getElementById("menuAvatar");
const dashboardName = document.getElementById("dashboardName");
const dashboardPlan = document.getElementById("dashboardPlan");
const dashboardAvatar = document.getElementById("dashboardAvatar");
const settingsForm = document.getElementById("settingsForm");
const settingsName = document.getElementById("settingsName");
const settingsUsername = document.getElementById("settingsUsername");
const settingsEmail = document.getElementById("settingsEmail");
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const forgotPasswordPanel = document.getElementById("forgotPasswordPanel");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const backToLoginButton = document.getElementById("backToLoginButton");
const connectionStatus = document.getElementById("connectionStatus");

let currentUser = null;

function userInitial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function updateAccountUI() {
  if (currentUser) {
    accountButtonText.textContent = currentUser.name;
    accountAvatarMini.textContent = userInitial(currentUser.name);

    menuName.textContent = currentUser.name;
    menuPlan.textContent = currentUser.plan || "Free Member";
    menuAvatar.textContent = userInitial(currentUser.name);

    dashboardName.textContent = currentUser.name;
    dashboardPlan.textContent = currentUser.plan || "Free Member";
    dashboardAvatar.textContent = userInitial(currentUser.name);

    settingsName.value = currentUser.name || "";
    settingsUsername.value = currentUser.username || "";
    if (settingsEmail) settingsEmail.value = currentUser.email || "";
  } else {
    accountButtonText.textContent = "Sign In";
    accountAvatarMini.textContent = "?";
  }
}

function showNormalAuth() {
  if (forgotPasswordPanel) forgotPasswordPanel.classList.add("hidden");
  document.querySelector(".auth-tabs").classList.remove("hidden");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  authTabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.authTab === "login");
  });
}

function openAccountModal(view = "library") {
  accountModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  if (currentUser) {
    authView.classList.add("hidden");
    accountDashboard.classList.remove("hidden");
    showDashboardView(view);
  } else {
    accountDashboard.classList.add("hidden");
    authView.classList.remove("hidden");
    showNormalAuth();
  }
}

function closeAccount() {
  accountModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function showDashboardView(view) {
  document.querySelectorAll(".dashboard-nav").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.dashboardView === view);
  });

  document.querySelectorAll(".dashboard-view").forEach(panel => panel.classList.add("hidden"));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.remove("hidden");
}

async function loadSession() {
  const token = localStorage.getItem("assetHubAuthToken");

  if (!token) {
    currentUser = null;
    updateAccountUI();
    return;
  }

  try {
    const data = await apiRequest("/api/auth/me");
    currentUser = data.user;
  } catch {
    localStorage.removeItem("assetHubAuthToken");
    currentUser = null;
  }

  updateAccountUI();
}

async function checkApi() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    if (!response.ok) throw new Error();
    connectionStatus.textContent = "● API Connected";
    connectionStatus.classList.add("online");
    connectionStatus.classList.remove("offline");
  } catch {
    connectionStatus.textContent = "● API Offline — start backend";
    connectionStatus.classList.add("offline");
    connectionStatus.classList.remove("online");
  }
}

openAccountButton.addEventListener("click", event => {
  event.stopPropagation();
  if (typeof themePicker !== "undefined" && themePicker) themePicker.classList.add("hidden");

  if (currentUser) {
    accountMenu.classList.toggle("hidden");
  } else {
    openAccountModal();
  }
});

closeAccountModal.addEventListener("click", closeAccount);

accountModal.addEventListener("click", event => {
  if (event.target === accountModal) closeAccount();
});

authTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    if (forgotPasswordPanel) forgotPasswordPanel.classList.add("hidden");
    authTabs.forEach(t => t.classList.toggle("active", t === tab));
    loginForm.classList.toggle("hidden", tab.dataset.authTab !== "login");
    registerForm.classList.toggle("hidden", tab.dataset.authTab !== "register");
  });
});

registerForm.addEventListener("submit", async event => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;

  try {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, username, password })
    });

    localStorage.setItem("assetHubAuthToken", data.token);
    currentUser = data.user;
    updateAccountUI();

    authView.classList.add("hidden");
    accountDashboard.classList.remove("hidden");
    showDashboardView("library");
    registerForm.reset();
    showToast("Account created!");
  } catch (error) {
    showToast(error.message);
  }
});

loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  const login = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password })
    });

    localStorage.setItem("assetHubAuthToken", data.token);
    currentUser = data.user;
    updateAccountUI();

    authView.classList.add("hidden");
    accountDashboard.classList.remove("hidden");
    showDashboardView("library");
    loginForm.reset();
    showToast("Signed in!");
  } catch (error) {
    showToast(error.message);
  }
});

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener("click", () => {
    document.querySelector(".auth-tabs").classList.add("hidden");
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    forgotPasswordPanel.classList.remove("hidden");
  });
}

if (backToLoginButton) {
  backToLoginButton.addEventListener("click", showNormalAuth);
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async event => {
    event.preventDefault();

    const email = document.getElementById("forgotEmail").value.trim();

    try {
      const data = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      showToast(data.message || "If that email has an account, a reset link was sent.");
      forgotPasswordForm.reset();
      showNormalAuth();
    } catch (error) {
      showToast(error.message);
    }
  });
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("assetHubAuthToken");
  currentUser = null;
  accountMenu.classList.add("hidden");
  updateAccountUI();
  showToast("Logged out");
});

document.querySelectorAll(".account-menu-item[data-account-page]").forEach(button => {
  button.addEventListener("click", () => {
    accountMenu.classList.add("hidden");
    openAccountModal(button.dataset.accountPage);
  });
});

document.querySelectorAll(".dashboard-nav").forEach(button => {
  button.addEventListener("click", () => {
    showDashboardView(button.dataset.dashboardView);
  });
});

settingsForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!currentUser) return;

  const name = settingsName.value.trim();

  try {
    const data = await apiRequest("/api/account/profile", {
      method: "PATCH",
      body: JSON.stringify({ name })
    });

    currentUser = data.user;
    updateAccountUI();
    showToast("Settings saved!");
  } catch (error) {
    showToast(error.message);
  }
});

document.addEventListener("click", event => {
  if (!accountMenu.contains(event.target) && !openAccountButton.contains(event.target)) {
    accountMenu.classList.add("hidden");
  }
});

loadSession();
checkApi();




/* =========================================================
   CREATOR MODAL
========================================================= */
const creatorModal = document.getElementById("creatorModal");
const closeCreatorModal = document.getElementById("closeCreatorModal");

if (closeCreatorModal) {
  closeCreatorModal.addEventListener("click", () => {
    creatorModal.classList.add("hidden");
    document.body.style.overflow = "";
  });
}

if (creatorModal) {
  creatorModal.addEventListener("click", event => {
    if (event.target === creatorModal) {
      creatorModal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  });
}

/* =========================================================
   BADGES + ADMIN ACCESS
========================================================= */
const adminMenuButton = document.getElementById("adminMenuButton");
const adminDashboardNav = document.getElementById("adminDashboardNav");
const menuBadges = document.getElementById("menuBadges");
const dashboardBadges = document.getElementById("dashboardBadges");

const adminUserList = document.getElementById("adminUserList");
const adminUserCount = document.getElementById("adminUserCount");
const adminCreatorCount = document.getElementById("adminCreatorCount");
const adminPremiumCount = document.getElementById("adminPremiumCount");
const adminBadgeCount = document.getElementById("adminBadgeCount");
const adminUserSearch = document.getElementById("adminUserSearch");
const adminResultCount = document.getElementById("adminResultCount");
const adminUsersEmpty = document.getElementById("adminUsersEmpty");
const refreshAdminUsers = document.getElementById("refreshAdminUsers");
const adminCreatorList = document.getElementById("adminCreatorList");
const creatorForm = document.getElementById("creatorForm");
const adminTabs = document.querySelectorAll(".admin-tab");

let adminUsersCache = [];

function isAdminUser(user) {
  const badges = user?.badges || [];
  return badges.includes("owner") || badges.includes("admin");
}

function updateBadgesAndAdmin() {
  const badges = currentUser?.badges || [];

  if (menuBadges) {
    menuBadges.innerHTML = badgeHTML(badges);
  }

  if (dashboardBadges) {
    dashboardBadges.innerHTML = badgeHTML(badges);
  }

  const allowed = isAdminUser(currentUser);

  if (adminMenuButton) {
    adminMenuButton.classList.toggle("hidden", !allowed);
  }

  if (adminDashboardNav) {
    adminDashboardNav.classList.toggle("hidden", !allowed);
  }
}

const originalUpdateAccountUI = updateAccountUI;

updateAccountUI = function() {
  originalUpdateAccountUI();
  updateBadgesAndAdmin();
};

function safeText(value) {
  return String(value ?? "");
}

function adminUserMatchesSearch(user, query) {
  if (!query) return true;

  const haystack = [
    user.name,
    user.username,
    user.email,
    user.plan,
    ...(user.badges || [])
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function renderAdminUsers() {
  if (!adminUserList) return;

  const query = (adminUserSearch?.value || "").trim();
  const users = adminUsersCache.filter(user => adminUserMatchesSearch(user, query));

  if (adminResultCount) {
    adminResultCount.textContent =
      `${users.length} user${users.length === 1 ? "" : "s"}`;
  }

  if (adminUsersEmpty) {
    adminUsersEmpty.classList.toggle("hidden", users.length !== 0);
  }

  adminUserList.innerHTML = users.map(user => {
    const badges = user.badges || [];

    const badgeButton = (badge, label, extra = "") => `
      <button
        class="admin-action-btn ${badges.includes(badge) ? "active" : ""} ${extra}"
        type="button"
        onclick="toggleUserBadge('${user.id}','${badge}')"
      >
        ${label}
      </button>
    `;

    return `
      <div class="admin-user-row">
        <div class="admin-user-main">
          <div class="admin-user-avatar">
            ${safeText(user.name).charAt(0).toUpperCase() || "?"}
          </div>

          <div class="admin-user-info">
            <strong>${safeText(user.name)}</strong>

            <div class="admin-user-meta">
              @${safeText(user.username)} • ${safeText(user.email)}
            </div>

            <div class="admin-user-meta">
              ${safeText(user.plan || "Free Member")}
            </div>

            <div class="badge-row">
              ${badgeHTML(badges)}
            </div>
          </div>
        </div>

        <div class="admin-user-actions">
          ${badgeButton("owner", "Owner", "owner-action")}
          ${badgeButton("admin", "Admin")}
          ${badgeButton("staff", "Staff")}
          ${badgeButton("creator", "Creator")}
          ${badgeButton("seller", "Seller")}
          ${badgeButton("premium", "Premium")}
          ${badgeButton("verified", "Verified")}
          ${badgeButton("early", "Early Member")}
        </div>
      </div>
    `;
  }).join("");
}

async function loadAdminUsers() {
  if (!isAdminUser(currentUser)) return;

  try {
    const data = await apiRequest("/api/admin/users");

    adminUsersCache = Array.isArray(data.users) ? data.users : [];

    const premiumUsers = adminUsersCache.filter(user =>
      (user.badges || []).includes("premium")
    ).length;

    if (adminUserCount) {
      adminUserCount.textContent = adminUsersCache.length;
    }

    if (adminCreatorCount) {
      adminCreatorCount.textContent = creators.length;
    }

    if (adminPremiumCount) {
      adminPremiumCount.textContent = premiumUsers;
    }

    if (adminBadgeCount) {
      adminBadgeCount.textContent = Object.keys(BADGE_LABELS).length;
    }

    renderAdminUsers();
    renderAdminCreators();

  } catch (error) {
    showToast(error.message);
  }
}

async function toggleUserBadge(userId, badge) {
  if (!isAdminUser(currentUser)) {
    showToast("Admin access required");
    return;
  }

  try {
    await apiRequest(`/api/admin/users/${userId}/badge`, {
      method: "PATCH",
      body: JSON.stringify({ badge })
    });

    await loadAdminUsers();

    if (currentUser?.id === userId) {
      await loadSession();
    }

    showToast(`${badge} badge updated`);
  } catch (error) {
    showToast(error.message);
  }
}

window.toggleUserBadge = toggleUserBadge;

if (adminUserSearch) {
  adminUserSearch.addEventListener("input", renderAdminUsers);
}

if (refreshAdminUsers) {
  refreshAdminUsers.addEventListener("click", loadAdminUsers);
}

function renderAdminCreators() {
  if (!adminCreatorList) return;

  if (creators.length === 0) {
    adminCreatorList.innerHTML = `
      <div class="admin-empty">
        <div>◇</div>
        <strong>No creators yet</strong>
        <span>Add one using the form.</span>
      </div>
    `;
    return;
  }

  adminCreatorList.innerHTML = creators.map(creator => `
    <div class="admin-creator-row">
      <div>
        <strong>${safeText(creator.name)}</strong>
        <p>
          ${safeText(creator.username)} • ${safeText(creator.specialty)}
        </p>
        <div class="badge-row">
          ${badgeHTML(creator.badges || [])}
        </div>
      </div>

      <button
        class="admin-action-btn danger"
        type="button"
        onclick="removeCreator(${creator.id})"
      >
        Remove
      </button>
    </div>
  `).join("");
}

function removeCreator(id) {
  creators = creators.filter(creator => creator.id !== id);
  renderCreators();
  renderAdminCreators();

  if (adminCreatorCount) {
    adminCreatorCount.textContent = creators.length;
  }

  showToast("Creator removed");
}

window.removeCreator = removeCreator;

if (creatorForm) {
  creatorForm.addEventListener("submit", event => {
    event.preventDefault();

    const assetsText =
      document.getElementById("creatorAssets")?.value.trim() || "";

    const assets = assetsText
      ? assetsText.split(",").map(item => item.trim()).filter(Boolean)
      : [];

    const creator = {
      id: Date.now(),
      name: document.getElementById("creatorName").value.trim(),
      username: document.getElementById("creatorUsername").value.trim(),
      bio: document.getElementById("creatorBio").value.trim(),
      specialty: document.getElementById("creatorSpecialty").value.trim(),
      badges: ["creator"],
      assets
    };

    creators.unshift(creator);

    renderCreators();
    renderAdminCreators();

    if (adminCreatorCount) {
      adminCreatorCount.textContent = creators.length;
    }

    creatorForm.reset();
    showToast("Creator added");
  });
}

adminTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    adminTabs.forEach(button => {
      button.classList.toggle("active", button === tab);
    });

    document.querySelectorAll(".admin-tab-panel").forEach(panel => {
      panel.classList.add("hidden");
    });

    const target = document.getElementById(
      `admin-tab-${tab.dataset.adminTab}`
    );

    if (target) {
      target.classList.remove("hidden");
    }
  });
});

const originalShowDashboardView = showDashboardView;

showDashboardView = function(view) {
  if (view === "admin" && !isAdminUser(currentUser)) {
    showToast("Admin access required");
    return;
  }

  originalShowDashboardView(view);

  if (view === "admin") {
    loadAdminUsers();
  }
};

renderCreators();


/* SELLER DASHBOARD + ACCESS PERMISSIONS */
const sellerMenuButton=document.getElementById("sellerMenuButton");
const sellerDashboardNav=document.getElementById("sellerDashboardNav");
const sellerUploadForm=document.getElementById("sellerUploadForm");
const sellerAssetList=document.getElementById("sellerAssetList");
const refreshSellerAssets=document.getElementById("refreshSellerAssets");

function isSellerUser(user){const b=user?.badges||[];return b.includes("seller")||b.includes("admin")||b.includes("owner");}
const oldUpdateBadgesAndAdmin=updateBadgesAndAdmin;
updateBadgesAndAdmin=function(){oldUpdateBadgesAndAdmin();const ok=isSellerUser(currentUser);if(sellerMenuButton)sellerMenuButton.classList.toggle("hidden",!ok);if(sellerDashboardNav)sellerDashboardNav.classList.toggle("hidden",!ok);};
function prettyPermission(level){return({public:"Everyone",members:"Members",premium:"Premium",seller:"Sellers",staff:"Staff",admin:"Admins",owner:"Owners",private:"Private"})[level]||level;}

async function loadSellerAssets(){
 if(!sellerAssetList||!isSellerUser(currentUser))return;
 try{
  const data=await apiRequest("/api/seller/assets"),list=data.assets||[];
  sellerAssetList.innerHTML=list.length?list.map(asset=>`
   <div class="seller-asset-row">
    <div class="seller-asset-top"><div><strong>${safeText(asset.name)}</strong><div class="seller-asset-meta">${safeText(asset.category)} • ${safeText(asset.originalFileName||"file")}</div></div><span class="access-pill">${asset.status||"published"}</span></div>
    <div class="permission-pills"><span class="permission-pill view">VIEW: ${prettyPermission(asset.accessLevel)}</span><span class="permission-pill download">DOWNLOAD: ${prettyPermission(asset.downloadLevel)}</span></div>
    <div class="seller-asset-actions"><button class="admin-action-btn" onclick="toggleSellerAssetStatus('${asset.id}','${asset.status||"published"}')">${asset.status==="disabled"?"Enable":"Disable"}</button><button class="admin-action-btn danger" onclick="deleteSellerAsset('${asset.id}')">Delete</button></div>
   </div>`).join(""):`<div class="admin-empty"><div>⬆</div><strong>No uploaded assets</strong><span>Your seller uploads will appear here.</span></div>`;
 }catch(error){showToast(error.message);}
}

if(sellerUploadForm)sellerUploadForm.addEventListener("submit",async event=>{
 event.preventDefault();
 const file=document.getElementById("sellerAssetFile").files[0];if(!file)return showToast("Choose a file first");
 const fd=new FormData();
 fd.append("name",document.getElementById("sellerAssetName").value.trim());
 fd.append("description",document.getElementById("sellerAssetDescription").value.trim());
 fd.append("category",document.getElementById("sellerAssetCategory").value);
 fd.append("accessLevel",document.getElementById("sellerAccessLevel").value);
 fd.append("downloadLevel",document.getElementById("sellerDownloadLevel").value);
 fd.append("allowedUserIds",document.getElementById("sellerAllowedUsers").value.trim());
 fd.append("file",file);
 try{
  const token=localStorage.getItem("assetHubAuthToken");
  const response=await fetch(`${API_URL}/api/seller/assets`,{method:"POST",headers:token?{Authorization:`Bearer ${token}`}:{},body:fd});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Upload failed.");
  sellerUploadForm.reset();showToast("Asset uploaded!");await loadSellerAssets();await loadMarketplaceAssets();
 }catch(error){showToast(error.message);}
});

async function toggleSellerAssetStatus(id,status){try{await apiRequest(`/api/seller/assets/${id}`,{method:"PATCH",body:JSON.stringify({status:status==="disabled"?"published":"disabled"})});await loadSellerAssets();await loadMarketplaceAssets();showToast("Asset status updated");}catch(error){showToast(error.message);}}
window.toggleSellerAssetStatus=toggleSellerAssetStatus;
async function deleteSellerAsset(id){try{await apiRequest(`/api/seller/assets/${id}`,{method:"DELETE"});await loadSellerAssets();await loadMarketplaceAssets();showToast("Asset deleted");}catch(error){showToast(error.message);}}
window.deleteSellerAsset=deleteSellerAsset;

async function loadMarketplaceAssets(){
 try{
  const token=localStorage.getItem("assetHubAuthToken");
  const response=await fetch(`${API_URL}/api/assets`,{headers:token?{Authorization:`Bearer ${token}`}:{}});if(!response.ok)return;
  const data=await response.json();
  for(let i=assets.length-1;i>=0;i--){if(assets[i].backendAsset)assets.splice(i,1);}
  (data.assets||[]).forEach(asset=>assets.push({id:asset.id,name:asset.name,category:asset.category||"Other",access:prettyPermission(asset.downloadLevel),icon:"⬆",tag:`By @${asset.sellerUsername||"seller"}`,description:asset.description||"Seller uploaded asset.",features:[`View: ${prettyPermission(asset.accessLevel)}`,`Download: ${prettyPermission(asset.downloadLevel)}`,`Seller: ${asset.sellerName||"Unknown"}`],colors:["#206e8a","#493b8d"],link:"#",backendAsset:true,backendId:asset.id}));
  renderAssets();
 }catch{}
}

const oldOpenAssetById=window.openAssetById;
window.openAssetById=function(id){const asset=assets.find(item=>String(item.id)===String(id));oldOpenAssetById(id);if(asset?.backendAsset)getAssetButton.dataset.backendAssetId=asset.backendId;else delete getAssetButton.dataset.backendAssetId;};

getAssetButton.addEventListener("click",async event=>{
 const backendId=getAssetButton.dataset.backendAssetId;if(!backendId)return;event.preventDefault();
 try{
  const token=localStorage.getItem("assetHubAuthToken");
  const response=await fetch(`${API_URL}/api/assets/${backendId}/download`,{headers:token?{Authorization:`Bearer ${token}`}:{}});if(!response.ok){let data={};try{data=await response.json();}catch{}throw new Error(data.error||"Download failed.");}
  const blob=await response.blob(),disp=response.headers.get("content-disposition")||"",match=disp.match(/filename="?([^"]+)"?/i),filename=match?match[1]:"asset-download",url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 }catch(error){showToast(error.message);}
});
if(refreshSellerAssets)refreshSellerAssets.addEventListener("click",loadSellerAssets);
const oldShowDashboardForSeller=showDashboardView;
showDashboardView=function(view){if(view==="seller"&&!isSellerUser(currentUser))return showToast("Seller access required");oldShowDashboardForSeller(view);if(view==="seller")loadSellerAssets();};
loadMarketplaceAssets();


/* =========================================================
   UPDATE LOG
========================================================= */
let updateLogItems = [];
let learningLessons = [];

async function loadUpdates() {
  try {
    const response = await fetch(`${API_URL}/api/updates`);
    const data = await response.json();
    updateLogItems = data.updates || [];
    renderUpdates();
    renderAdminUpdates();
  } catch {}
}

function renderUpdates() {
  const list = document.getElementById("updatesList");
  if (!list) return;

  list.innerHTML = updateLogItems.length ? updateLogItems.map(update => `
    <article class="update-card ${update.pinned ? "pinned" : ""}">
      <div class="update-card-top">
        <div>
          <div class="update-version">${safeText(update.version)} ${update.pinned ? "• PINNED" : ""}</div>
          <h3>${safeText(update.title)}</h3>
        </div>
        <span class="update-tag ${safeText(update.tag)}">${safeText(update.tag)}</span>
      </div>
      <div class="update-date">${safeText(update.date)}</div>
      <p>${safeText(update.description)}</p>
      <div class="update-changes">
        ${(update.changes || []).map(change => `<div class="update-change">• ${safeText(change)}</div>`).join("")}
      </div>
    </article>
  `).join("") : `<div class="admin-empty"><strong>No updates yet</strong></div>`;
}

function renderAdminUpdates() {
  const list = document.getElementById("adminUpdatesList");
  if (!list) return;

  list.innerHTML = updateLogItems.length ? updateLogItems.map(update => `
    <div class="admin-creator-row">
      <div>
        <strong>${safeText(update.version)} — ${safeText(update.title)}</strong>
        <p>${safeText(update.tag)} • ${safeText(update.date)}</p>
      </div>
      <button class="admin-action-btn danger" onclick="deleteUpdate('${update.id}')">Delete</button>
    </div>
  `).join("") : `<div class="admin-empty"><strong>No updates</strong></div>`;
}

async function deleteUpdate(id) {
  try {
    await apiRequest(`/api/admin/updates/${id}`, { method: "DELETE" });
    await loadUpdates();
    showToast("Update deleted");
  } catch (error) {
    showToast(error.message);
  }
}
window.deleteUpdate = deleteUpdate;

const updateForm = document.getElementById("updateForm");
if (updateForm) {
  updateForm.addEventListener("submit", async event => {
    event.preventDefault();

    const changes = document.getElementById("updateChanges").value
      .split("\n").map(v => v.trim()).filter(Boolean);

    try {
      await apiRequest("/api/admin/updates", {
        method: "POST",
        body: JSON.stringify({
          version: document.getElementById("updateVersion").value.trim(),
          title: document.getElementById("updateTitle").value.trim(),
          description: document.getElementById("updateDescription").value.trim(),
          tag: document.getElementById("updateTag").value,
          pinned: document.getElementById("updatePinned").checked,
          changes
        })
      });

      updateForm.reset();
      await loadUpdates();
      showToast("Update published");
    } catch (error) {
      showToast(error.message);
    }
  });
}

/* =========================================================
   LEARNING CENTER
========================================================= */
async function loadLessons() {
  try {
    const response = await fetch(`${API_URL}/api/lessons`);
    const data = await response.json();
    learningLessons = data.lessons || [];
    renderLessons();
    renderAdminLessons();
  } catch {}
}

function renderLessons() {
  const grid = document.getElementById("lessonGrid");
  if (!grid) return;

  const search = (document.getElementById("lessonSearch")?.value || "").toLowerCase();
  const category = document.getElementById("lessonCategoryFilter")?.value || "All";

  const filtered = learningLessons.filter(lesson => {
    const text = [lesson.title, lesson.summary, lesson.category, lesson.difficulty]
      .join(" ").toLowerCase();

    return text.includes(search) && (category === "All" || lesson.category === category);
  });

  grid.innerHTML = filtered.length ? filtered.map(lesson => `
    <article class="lesson-card">
      <div class="lesson-card-meta">
        <span>${safeText(lesson.category)}</span>
        <span>${Number(lesson.minutes || 5)} min</span>
      </div>
      <h3>${safeText(lesson.title)}</h3>
      <p>${safeText(lesson.summary)}</p>
      <div class="lesson-card-footer">
        <span class="lesson-difficulty">${safeText(lesson.difficulty).toUpperCase()}</span>
        <button class="mini-button" onclick="openLesson('${lesson.id}')">Start Lesson →</button>
      </div>
    </article>
  `).join("") : `<div class="admin-empty"><strong>No lessons found</strong></div>`;
}

function openLesson(id) {
  const lesson = learningLessons.find(item => item.id === id);
  if (!lesson) return;

  document.getElementById("lessonModalMeta").innerHTML = `
    <span class="user-badge">${safeText(lesson.category)}</span>
    <span class="user-badge">${safeText(lesson.difficulty)}</span>
    <span class="user-badge">${Number(lesson.minutes || 5)} MIN</span>
  `;

  document.getElementById("lessonModalTitle").textContent = lesson.title;
  document.getElementById("lessonModalSummary").textContent = lesson.summary;
  document.getElementById("lessonModalContent").textContent = lesson.content;
  document.getElementById("lessonModalCode").textContent = lesson.code || "";
  document.getElementById("lessonCodeWrap").classList.toggle("hidden", !lesson.code);

  document.getElementById("lessonModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
window.openLesson = openLesson;

const lessonModal = document.getElementById("lessonModal");
document.getElementById("closeLessonModal")?.addEventListener("click", () => {
  lessonModal.classList.add("hidden");
  document.body.style.overflow = "";
});

lessonModal?.addEventListener("click", event => {
  if (event.target === lessonModal) {
    lessonModal.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

document.getElementById("copyLessonCode")?.addEventListener("click", async () => {
  const text = document.getElementById("lessonModalCode").textContent;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Code copied");
  } catch {
    showToast("Could not copy code");
  }
});

document.getElementById("lessonSearch")?.addEventListener("input", renderLessons);
document.getElementById("lessonCategoryFilter")?.addEventListener("change", renderLessons);

function renderAdminLessons() {
  const list = document.getElementById("adminLessonsList");
  if (!list) return;

  list.innerHTML = learningLessons.length ? learningLessons.map(lesson => `
    <div class="admin-creator-row">
      <div>
        <strong>${safeText(lesson.title)}</strong>
        <p>${safeText(lesson.category)} • ${safeText(lesson.difficulty)}</p>
      </div>
      <button class="admin-action-btn danger" onclick="deleteLesson('${lesson.id}')">Delete</button>
    </div>
  `).join("") : `<div class="admin-empty"><strong>No lessons</strong></div>`;
}

async function deleteLesson(id) {
  try {
    await apiRequest(`/api/admin/lessons/${id}`, { method: "DELETE" });
    await loadLessons();
    showToast("Lesson deleted");
  } catch (error) {
    showToast(error.message);
  }
}
window.deleteLesson = deleteLesson;

const lessonForm = document.getElementById("lessonForm");
if (lessonForm) {
  lessonForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
      await apiRequest("/api/admin/lessons", {
        method: "POST",
        body: JSON.stringify({
          title: document.getElementById("lessonTitle").value.trim(),
          category: document.getElementById("lessonCategory").value.trim(),
          difficulty: document.getElementById("lessonDifficulty").value,
          minutes: Number(document.getElementById("lessonMinutes").value || 5),
          summary: document.getElementById("lessonSummary").value.trim(),
          content: document.getElementById("lessonContent").value.trim(),
          code: document.getElementById("lessonCode").value
        })
      });

      lessonForm.reset();
      await loadLessons();
      showToast("Lesson published");
    } catch (error) {
      showToast(error.message);
    }
  });
}

loadUpdates();
loadLessons();
