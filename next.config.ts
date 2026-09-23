import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
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
};

export default nextConfig;
