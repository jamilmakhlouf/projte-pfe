/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://192.168.43.143:3000'],
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyC7NYzkYoWYpVzUBM0AsdnhqlBOIUvjzak",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "stageease.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "stageease",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "stageease.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "93947888270",
    NEXT_PUBLIC_FIREBASE_APP_ID: ":993947888270:web:15fa7897141f3cfb8577df",
  },
};

module.exports = nextConfig;

