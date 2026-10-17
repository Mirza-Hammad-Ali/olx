import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
const uploadsPath = fileURLToPath(new URL("./uploads/", import.meta.url));

if (!process.env.MONGODB_URI)
  throw new Error(
    "MONGODB_URI is required. Copy .env.example to .env and configure MongoDB.",
  );
if (!jwtSecret || jwtSecret.length < 32)
  throw new Error(
    "JWT_SECRET must be set to a random value of at least 32 characters.",
  );

fs.mkdirSync(uploadsPath, { recursive: true });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: { type: String, required: true, minlength: 8, select: false },
  },
  { timestamps: true },
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: {
      type: String,
      required: true,
      enum: [
        "Vehicles",
        "Property",
        "Electronics",
        "Home & living",
        "Fashion",
        "Books & sports",
        "Kids",
        "Jobs",
      ],
    },
    price: { type: Number, required: true, min: 1, max: 1_000_000_000 },
    city: {
      type: String,
      required: true,
      enum: [
        "Karachi",
        "Lahore",
        "Islamabad",
        "Rawalpindi",
        "Faisalabad",
        "Peshawar",
        "Quetta",
        "Multan",
        "Other",
      ],
    },
    image: { type: String, default: "" },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
const Listing = mongoose.model("Listing", listingSchema);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      const error = new Error(
        "This website is not permitted to access the marketplace API.",
      );
      error.status = 403;
      return callback(error);
    },
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(
  "/uploads",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(uploadsPath, { dotfiles: "deny", index: false, maxAge: "1d" }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const authenticate = (request, response, next) => {
  const authorization = request.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token)
    return response
      .status(401)
      .json({ message: "Please sign in to continue." });

  try {
    const payload = jwt.verify(token, jwtSecret);
    request.userId = payload.sub;
    return next();
  } catch {
    return response
      .status(401)
      .json({ message: "Your session has expired. Please sign in again." });
  }
};

const photoUpload = multer({
  storage: multer.diskStorage({
    destination: uploadsPath,
    filename(_request, file, callback) {
      const extension = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
      }[file.mimetype];
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(_request, file, callback) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      const error = new Error("Choose a JPEG, PNG, or WebP photo.");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

app.get("/api/health", (_request, response) =>
  response.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);

app.post("/api/auth/register", authLimiter, async (request, response, next) => {
  try {
    const name =
      typeof request.body.name === "string" ? request.body.name.trim() : "";
    const email =
      typeof request.body.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof request.body.password === "string" ? request.body.password : "";
    if (name.length < 2 || name.length > 60)
      return response
        .status(400)
        .json({ message: "Your name must be between 2 and 60 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
      return response
        .status(400)
        .json({ message: "Enter a valid email address." });
    if (password.length < 8 || password.length > 72)
      return response
        .status(400)
        .json({
          message: "Your password must be between 8 and 72 characters.",
        });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash });
    const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "7d" });
    return response
      .status(201)
      .json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
  } catch (error) {
    if (error.code === 11000)
      return response
        .status(409)
        .json({
          message:
            "An account with that email already exists. Sign in instead.",
        });
    return next(error);
  }
});

app.post("/api/auth/login", authLimiter, async (request, response, next) => {
  try {
    const email =
      typeof request.body.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof request.body.password === "string" ? request.body.password : "";
    if (!email || !password)
      return response
        .status(400)
        .json({ message: "Enter your email and password." });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response
        .status(401)
        .json({ message: "That email and password do not match." });
    }
    const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "7d" });
    return response.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/listings", async (_request, response, next) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .limit(60)
      .select("-seller -__v")
      .lean();
    return response.json({ listings });
  } catch (error) {
    return next(error);
  }
});

app.post(
  "/api/listings",
  authenticate,
  photoUpload.single("photo"),
  async (request, response, next) => {
    try {
      const listing = await Listing.create({
        title: request.body.title,
        description: request.body.description,
        category: request.body.category,
        price: request.body.price,
        city: request.body.city,
        image: request.file ? `/uploads/${request.file.filename}` : "",
        seller: request.userId,
      });
      return response
        .status(201)
        .json({ listing: { ...listing.toObject(), seller: undefined } });
    } catch (error) {
      if (request.file)
        fs.promises
          .unlink(request.file.path)
          .catch((unlinkError) =>
            console.error(
              "Could not remove an unpublished listing photo:",
              unlinkError,
            ),
          );
      if (
        error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError
      ) {
        return response
          .status(400)
          .json({ message: "Check the listing details and try again." });
      }
      return next(error);
    }
  },
);

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Photos must be 5 MB or smaller."
        : "The photo could not be uploaded.";
    return response.status(400).json({ message });
  }
  console.error("Marketplace API error:", error);
  return response
    .status(error.status || 500)
    .json({
      message: error.status
        ? error.message
        : "Something went wrong. Please try again.",
    });
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () =>
    console.log(`Marketplace API listening on http://localhost:${port}`),
  );
} catch (error) {
  console.error("Could not connect to MongoDB:", error);
  process.exitCode = 1;
}
