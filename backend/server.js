import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Asset Hub API running on port ${PORT}`);
});
const USERS_FILE = path.join(__dirname, "data", "users.json");
const ASSETS_FILE = path.join(__dirname, "data", "assets.json");
const UPDATES_FILE = path.join(__dirname, "data", "updates.json");
const LESSONS_FILE = path.join(__dirname, "data", "lessons.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5500";
const AUTH_SECRET = process.env.AUTH_SECRET || "development-only-secret";
const RESET_PAGE_URL =
  process.env.RESET_PAGE_URL || `${FRONTEND_URL}/reset-password.html`;

app.disable("x-powered-by");

// Development-friendly CORS.
// Allows localhost/127.0.0.1 on any port, plus the configured FRONTEND_URL.
// For production, set FRONTEND_URL to your real site domain.
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header AND file:// pages.
      // Browsers report local file pages as the literal Origin "null".
      if (!origin || origin === "null") return callback(null, true);

      const allowedExact = origin === FRONTEND_URL;

      const allowedLocal =
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      if (allowedExact || allowedLocal) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "32kb" }));

// -----------------------------------------------------------------------------
// Tiny JSON database starter
// For a larger production site, swap this for PostgreSQL or another real DB.
// -----------------------------------------------------------------------------

let writeQueue = Promise.resolve();

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
      await fs.writeFile(USERS_FILE, "[]\n", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeUsers(users) {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2) + "\n", "utf8")
  );
  return writeQueue;
}


async function readAssets() {
  try {
    const raw = await fs.readFile(ASSETS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(ASSETS_FILE), { recursive: true });
      await fs.writeFile(ASSETS_FILE, "[]\n", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeAssets(assets) {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2) + "\n", "utf8")
  );
  return writeQueue;
}

async function readJsonArray(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, "[]\n", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeJsonArray(filePath, items) {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(filePath, JSON.stringify(items, null, 2) + "\n", "utf8")
  );
  return writeQueue;
}

function publicAsset(asset) {
  return {
    id: asset.id,
    name: asset.name,
    description: asset.description,
    category: asset.category,
    accessLevel: asset.accessLevel,
    downloadLevel: asset.downloadLevel,
    sellerId: asset.sellerId,
    sellerName: asset.sellerName,
    sellerUsername: asset.sellerUsername,
    originalFileName: asset.originalFileName,
    fileSize: asset.fileSize,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
    status: asset.status || "published",
  };
}

function userHasBadge(user, badge) {
  return Array.isArray(user?.badges) && user.badges.includes(badge);
}

function userMeetsLevel(user, level, asset) {
  switch (level) {
    case "public": return true;
    case "members": return !!user;
    case "premium": return !!user && (userHasBadge(user, "premium") || userHasBadge(user, "owner"));
    case "seller": return !!user && (userHasBadge(user, "seller") || userHasBadge(user, "admin") || userHasBadge(user, "owner"));
    case "staff": return !!user && (userHasBadge(user, "staff") || userHasBadge(user, "admin") || userHasBadge(user, "owner"));
    case "admin": return !!user && (userHasBadge(user, "admin") || userHasBadge(user, "owner"));
    case "owner": return !!user && userHasBadge(user, "owner");
    case "private":
      return !!user && (
        user.id === asset.sellerId ||
        (Array.isArray(asset.allowedUserIds) && asset.allowedUserIds.includes(user.id)) ||
        userHasBadge(user, "admin") ||
        userHasBadge(user, "owner")
      );
    default: return false;
  }
}

async function optionalAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    req.user = null;
    return next();
  }
  const payload = verifyAuthToken(token);
  if (!payload) {
    req.user = null;
    return next();
  }
  const users = await readUsers();
  req.user = users.find(item => item.id === payload.userId) || null;
  next();
}

function requireSeller(req, res, next) {
  if (
    !userHasBadge(req.user, "seller") &&
    !userHasBadge(req.user, "admin") &&
    !userHasBadge(req.user, "owner")
  ) {
    return res.status(403).json({ error: "Seller access required." });
  }
  next();
}

await fs.mkdir(UPLOADS_DIR, { recursive: true });

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const allowed = new Set([
      ".zip", ".rbxm", ".rbxmx", ".lua", ".txt", ".json",
      ".png", ".jpg", ".jpeg", ".webp"
    ]);
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(ext)) {
      return callback(new Error("That file type is not allowed."));
    }
    callback(null, true);
  },
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    plan: user.plan || "Free Member",
    badges: Array.isArray(user.badges) ? user.badges : [],
    createdAt: user.createdAt,
  };
}

// -----------------------------------------------------------------------------
// Auth token helpers
// Signed bearer token without an extra JWT dependency.
// -----------------------------------------------------------------------------

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(value)
    .digest("base64url");
}

function createAuthToken(user) {
  const payload = {
    userId: user.id,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function verifyAuthToken(token) {
  if (!token || !token.includes(".")) return null;

  const [encoded, signature] = token.split(".");
  const expected = sign(encoded);

  try {
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );

    if (!payload.userId || !payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

async function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = verifyAuthToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const users = await readUsers();
  const user = users.find((item) => item.id === payload.userId);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  req.user = user;
  next();
}

// -----------------------------------------------------------------------------
// Email
// -----------------------------------------------------------------------------

function getTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendResetEmail(email, name, resetUrl) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("\n[DEV RESET LINK]");
    console.log(resetUrl);
    console.log();
    return { delivered: false, developmentLink: resetUrl };
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your Asset Hub password",
    text:
      `Hi ${name},\n\n` +
      `Use this link to reset your Asset Hub password:\n${resetUrl}\n\n` +
      `This link expires in 30 minutes. If you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:28px;color:#101820">
        <h2 style="margin-bottom:8px">Reset your Asset Hub password</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Use the button below to choose a new password. This link expires in 30 minutes.</p>
        <p style="margin:28px 0">
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 18px;background:#5271ff;color:white;text-decoration:none;border-radius:10px;font-weight:700">
            Reset Password
          </a>
        </p>
        <p style="font-size:13px;color:#657080">
          If you did not request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });

  return { delivered: true };
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// -----------------------------------------------------------------------------
// Basic validation + simple in-memory rate limiting
// -----------------------------------------------------------------------------

const attempts = new Map();

function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= max) return false;

  current.count += 1;
  return true;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validUsername(username) {
  return /^[a-z0-9_]{3,24}$/.test(username);
}


function userIsAdmin(user) {
  const badges = Array.isArray(user.badges) ? user.badges : [];
  return badges.includes("owner") || badges.includes("admin");
}

function requireAdmin(req, res, next) {
  if (!userIsAdmin(req.user)) {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

const ALLOWED_BADGES = [
  "owner",
  "admin",
  "staff",
  "creator",
  "seller",
  "premium",
  "verified",
  "early",
];

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Asset Hub API" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const username = normalizeUsername(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (name.length < 2 || name.length > 40) {
      return res.status(400).json({ error: "Display name must be 2-40 characters." });
    }

    if (!validUsername(username)) {
      return res.status(400).json({
        error: "Username must be 3-24 characters using letters, numbers, or underscores.",
      });
    }

    if (!validEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const users = await readUsers();

    if (users.some((u) => u.username === username)) {
      return res.status(409).json({ error: "That username is already taken." });
    }

    if (users.some((u) => u.email === email)) {
      return res.status(409).json({ error: "That email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      id: crypto.randomUUID(),
      name,
      username,
      email,
      passwordHash,
      plan: "Free Member",
      badges: [],
      createdAt: new Date().toISOString(),
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    };

    const ownerEmail = normalizeEmail(process.env.OWNER_EMAIL || "");
    if (ownerEmail && email === ownerEmail) {
      user.badges = ["owner", "admin", "verified"];
      user.plan = "Premium Member";
    }

    users.push(user);
    await writeUsers(users);

    const token = createAuthToken(user);

    res.status(201).json({
      message: "Account created.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const usernameOrEmail = String(req.body.login || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const key = `login:${req.ip}`;
    if (!rateLimit(key, 10, 15 * 60 * 1000)) {
      return res.status(429).json({ error: "Too many login attempts. Try again later." });
    }

    const users = await readUsers();
    const user = users.find(
      (u) => u.username === usernameOrEmail || u.email === usernameOrEmail
    );

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Incorrect login or password." });
    }

    const token = createAuthToken(user);

    res.json({
      message: "Signed in.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not sign in." });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    const key = `reset:${req.ip}:${email}`;
    if (!rateLimit(key, 4, 60 * 60 * 1000)) {
      // Keep the response generic so account existence isn't revealed.
      return res.json({
        message: "If that email has an account, a reset link has been sent.",
      });
    }

    const users = await readUsers();
    const index = users.findIndex((u) => u.email === email);

    if (index !== -1) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      users[index].resetTokenHash = tokenHash;
      users[index].resetTokenExpiresAt =
        Date.now() + 30 * 60 * 1000; // 30 minutes

      await writeUsers(users);

      const resetUrl =
        `${RESET_PAGE_URL}?token=${encodeURIComponent(rawToken)}`;

      await sendResetEmail(
        users[index].email,
        users[index].name,
        resetUrl
      );
    }

    res.json({
      message: "If that email has an account, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);

    // Keep the public response generic.
    res.json({
      message: "If that email has an account, a reset link has been sent.",
    });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const rawToken = String(req.body.token || "");
    const password = String(req.body.password || "");

    if (!rawToken || password.length < 8) {
      return res.status(400).json({ error: "Invalid reset request." });
    }

    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const users = await readUsers();

    const index = users.findIndex(
      (u) =>
        u.resetTokenHash === tokenHash &&
        Number(u.resetTokenExpiresAt) > Date.now()
    );

    if (index === -1) {
      return res.status(400).json({
        error: "That reset link is invalid or has expired.",
      });
    }

    users[index].passwordHash = await bcrypt.hash(password, 12);
    users[index].resetTokenHash = null;
    users[index].resetTokenExpiresAt = null;

    await writeUsers(users);

    res.json({ message: "Password updated. You can now sign in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not reset password." });
  }
});

app.patch("/api/account/profile", requireAuth, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();

    if (name.length < 2 || name.length > 40) {
      return res.status(400).json({ error: "Display name must be 2-40 characters." });
    }

    const users = await readUsers();
    const index = users.findIndex((u) => u.id === req.user.id);

    if (index === -1) {
      return res.status(404).json({ error: "Account not found." });
    }

    users[index].name = name;
    await writeUsers(users);

    res.json({
      message: "Profile updated.",
      user: publicUser(users[index]),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update profile." });
  }
});



app.get("/api/updates", async (req, res) => {
  try {
    const updates = await readJsonArray(UPDATES_FILE);
    updates.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    res.json({ updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load updates." });
  }
});

app.post("/api/admin/updates", requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = await readJsonArray(UPDATES_FILE);
    const update = {
      id: crypto.randomUUID(),
      version: String(req.body.version || "v1.0.0").trim(),
      title: String(req.body.title || "").trim(),
      description: String(req.body.description || "").trim(),
      tag: String(req.body.tag || "NEW").trim().toUpperCase(),
      pinned: Boolean(req.body.pinned),
      date: new Date().toISOString().slice(0, 10),
      changes: Array.isArray(req.body.changes) ? req.body.changes.map(String) : []
    };

    if (!update.title) {
      return res.status(400).json({ error: "Update title is required." });
    }

    updates.unshift(update);
    await writeJsonArray(UPDATES_FILE, updates);
    res.status(201).json({ message: "Update published.", update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not publish update." });
  }
});

app.delete("/api/admin/updates/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = await readJsonArray(UPDATES_FILE);
    const filtered = updates.filter(item => item.id !== req.params.id);

    if (filtered.length === updates.length) {
      return res.status(404).json({ error: "Update not found." });
    }

    await writeJsonArray(UPDATES_FILE, filtered);
    res.json({ message: "Update deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete update." });
  }
});

app.get("/api/lessons", async (req, res) => {
  try {
    const lessons = await readJsonArray(LESSONS_FILE);
    res.json({ lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load lessons." });
  }
});

app.post("/api/admin/lessons", requireAuth, requireAdmin, async (req, res) => {
  try {
    const lessons = await readJsonArray(LESSONS_FILE);

    const lesson = {
      id: crypto.randomUUID(),
      title: String(req.body.title || "").trim(),
      category: String(req.body.category || "General").trim(),
      difficulty: String(req.body.difficulty || "Beginner").trim(),
      minutes: Math.max(1, Number(req.body.minutes || 5)),
      summary: String(req.body.summary || "").trim(),
      content: String(req.body.content || "").trim(),
      code: String(req.body.code || "")
    };

    if (!lesson.title || !lesson.summary || !lesson.content) {
      return res.status(400).json({ error: "Title, summary, and lesson content are required." });
    }

    lessons.unshift(lesson);
    await writeJsonArray(LESSONS_FILE, lessons);
    res.status(201).json({ message: "Lesson published.", lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not publish lesson." });
  }
});

app.delete("/api/admin/lessons/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const lessons = await readJsonArray(LESSONS_FILE);
    const filtered = lessons.filter(item => item.id !== req.params.id);

    if (filtered.length === lessons.length) {
      return res.status(404).json({ error: "Lesson not found." });
    }

    await writeJsonArray(LESSONS_FILE, filtered);
    res.json({ message: "Lesson deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete lesson." });
  }
});


const ACCESS_LEVELS = new Set([
  "public", "members", "premium", "seller", "staff", "admin", "owner", "private"
]);

app.get("/api/assets", optionalAuth, async (req, res) => {
  try {
    const assets = await readAssets();
    const visible = assets
      .filter(asset => asset.status !== "disabled")
      .filter(asset => userMeetsLevel(req.user, asset.accessLevel || "public", asset))
      .map(publicAsset);
    res.json({ assets: visible });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load assets." });
  }
});

app.get("/api/seller/assets", requireAuth, requireSeller, async (req, res) => {
  try {
    const assets = await readAssets();
    const mine = userHasBadge(req.user, "admin") || userHasBadge(req.user, "owner")
      ? assets
      : assets.filter(asset => asset.sellerId === req.user.id);
    res.json({ assets: mine.map(publicAsset) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load seller assets." });
  }
});

app.post("/api/seller/assets", requireAuth, requireSeller, upload.single("file"), async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "Other").trim();
    const accessLevel = String(req.body.accessLevel || "public").trim().toLowerCase();
    const downloadLevel = String(req.body.downloadLevel || "members").trim().toLowerCase();
    const allowedUserIds = String(req.body.allowedUserIds || "")
      .split(",").map(v => v.trim()).filter(Boolean);

    if (!name || name.length > 80) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: "Asset name is required and must be under 80 characters." });
    }
    if (!req.file) return res.status(400).json({ error: "Choose a file to upload." });
    if (!ACCESS_LEVELS.has(accessLevel) || !ACCESS_LEVELS.has(downloadLevel)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: "Invalid access permission." });
    }

    const assets = await readAssets();
    const asset = {
      id: crypto.randomUUID(),
      name, description, category, accessLevel, downloadLevel, allowedUserIds,
      sellerId: req.user.id,
      sellerName: req.user.name,
      sellerUsername: req.user.username,
      storedFileName: req.file.filename,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    assets.unshift(asset);
    await writeAssets(assets);
    res.status(201).json({ message: "Asset uploaded.", asset: publicAsset(asset) });
  } catch (error) {
    console.error(error);
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: "Could not upload asset." });
  }
});

app.patch("/api/seller/assets/:id", requireAuth, requireSeller, async (req, res) => {
  try {
    const assets = await readAssets();
    const index = assets.findIndex(asset => asset.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Asset not found." });

    const asset = assets[index];
    const canManage = asset.sellerId === req.user.id ||
      userHasBadge(req.user, "admin") || userHasBadge(req.user, "owner");
    if (!canManage) return res.status(403).json({ error: "You cannot manage this asset." });

    const accessLevel = req.body.accessLevel ? String(req.body.accessLevel).toLowerCase() : asset.accessLevel;
    const downloadLevel = req.body.downloadLevel ? String(req.body.downloadLevel).toLowerCase() : asset.downloadLevel;
    if (!ACCESS_LEVELS.has(accessLevel) || !ACCESS_LEVELS.has(downloadLevel)) {
      return res.status(400).json({ error: "Invalid permission level." });
    }

    asset.name = req.body.name ? String(req.body.name).trim() : asset.name;
    asset.description = req.body.description !== undefined ? String(req.body.description).trim() : asset.description;
    asset.category = req.body.category ? String(req.body.category).trim() : asset.category;
    asset.accessLevel = accessLevel;
    asset.downloadLevel = downloadLevel;
    asset.status = req.body.status === "disabled" ? "disabled" : "published";
    if (req.body.allowedUserIds !== undefined) {
      asset.allowedUserIds = Array.isArray(req.body.allowedUserIds) ? req.body.allowedUserIds.map(String) : [];
    }
    asset.updatedAt = new Date().toISOString();
    await writeAssets(assets);
    res.json({ message: "Asset updated.", asset: publicAsset(asset) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update asset." });
  }
});

app.delete("/api/seller/assets/:id", requireAuth, requireSeller, async (req, res) => {
  try {
    const assets = await readAssets();
    const index = assets.findIndex(asset => asset.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Asset not found." });

    const asset = assets[index];
    const canManage = asset.sellerId === req.user.id ||
      userHasBadge(req.user, "admin") || userHasBadge(req.user, "owner");
    if (!canManage) return res.status(403).json({ error: "You cannot delete this asset." });

    assets.splice(index, 1);
    await writeAssets(assets);
    if (asset.storedFileName) {
      await fs.unlink(path.join(UPLOADS_DIR, asset.storedFileName)).catch(() => {});
    }
    res.json({ message: "Asset deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete asset." });
  }
});

app.get("/api/assets/:id/download", optionalAuth, async (req, res) => {
  try {
    const assets = await readAssets();
    const asset = assets.find(item => item.id === req.params.id);
    if (!asset || asset.status === "disabled") {
      return res.status(404).json({ error: "Asset not found." });
    }
    if (!userMeetsLevel(req.user, asset.accessLevel || "public", asset)) {
      return res.status(403).json({ error: "You do not have access to this asset." });
    }
    if (!userMeetsLevel(req.user, asset.downloadLevel || "members", asset)) {
      return res.status(403).json({ error: "You do not have download permission for this asset." });
    }
    res.download(path.join(UPLOADS_DIR, asset.storedFileName), asset.originalFileName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not download asset." });
  }
});


app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await readUsers();
    res.json({ users: users.map(publicUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load users." });
  }
});

app.patch("/api/admin/users/:id/badge", requireAuth, requireAdmin, async (req, res) => {
  try {
    const badge = String(req.body.badge || "").trim().toLowerCase();

    if (!ALLOWED_BADGES.includes(badge)) {
      return res.status(400).json({ error: "Invalid badge." });
    }

    const users = await readUsers();
    const index = users.findIndex(user => user.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found." });
    }

    users[index].badges = Array.isArray(users[index].badges)
      ? users[index].badges
      : [];

    if (badge === "owner" && users[index].badges.includes("owner")) {
      const ownerCount = users.filter(user =>
        Array.isArray(user.badges) && user.badges.includes("owner")
      ).length;

      if (ownerCount <= 1) {
        return res.status(400).json({
          error: "You cannot remove the last Owner account."
        });
      }
    }

    if (users[index].badges.includes(badge)) {
      users[index].badges = users[index].badges.filter(item => item !== badge);
    } else {
      users[index].badges.push(badge);
    }

    // Keep plan in sync with premium badge.
    users[index].plan =
      users[index].badges.includes("premium") ||
      users[index].badges.includes("owner")
        ? "Premium Member"
        : "Free Member";

    await writeUsers(users);

    res.json({
      message: "Badge updated.",
      user: publicUser(users[index]),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update badge." });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Asset Hub API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);

  if (AUTH_SECRET === "development-only-secret") {
    console.warn("WARNING: Set AUTH_SECRET in .env before production.");
  }

  if (!getTransporter()) {
    console.warn(
      "SMTP is not configured. Password reset links will print to the terminal for development."
    );
  }
});
