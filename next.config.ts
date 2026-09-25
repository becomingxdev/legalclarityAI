import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Exact variable names as defined in .env.local and Vercel dashboard:
    firebase_api_key: process.env.firebase_api_key || "",
    firebase_authdomain: process.env.firebase_authdomain || "",
    firebase_project_id: process.env.firebase_project_id || "",
    firebase_storage_bucket: process.env.firebase_storage_bucket || "",
    firebase_messaging_sender_id: process.env.firebase_messaging_sender_id || "",
    firbase_app_id: process.env.firbase_app_id || "",
    firebase_measurement_id: process.env.firebase_measurement_id || "",
    AI_API_KEY: process.env.AI_API_KEY || "",

    // Bridge exact names from .env.local to client-side NEXT_PUBLIC equivalents without modifying .env.local
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.firebase_api_key || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.firebase_authdomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.firebase_project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.firebase_storage_bucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.firebase_messaging_sender_id || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.firbase_app_id || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.firebase_measurement_id || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  },
  // Keep these heavy native/canvas-dependent packages as runtime Node requires
  // instead of bundling them — prevents "can't resolve canvas" build errors
  serverExternalPackages: ["pdfjs-dist", "canvas", "pdf-parse"],

  // ── HTTP Security Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Restrict referrer information
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable unnecessary browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Force HTTPS (max-age = 2 years)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Firebase Auth & Firestore SDKs use eval internally; Google OAuth loads apis.google.com and gstatic
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.gstatic.com https://*.googletagmanager.com",
              // Google Auth iframe and popup handler
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://*.google.com",
              "style-src 'self' 'unsafe-inline'",
              // Firebase storage, Google APIs, Groq AI
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com wss://*.firebaseio.com https://api.groq.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
