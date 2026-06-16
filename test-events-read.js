import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRead() {
  console.log("Checking public 'events' collection read access...");
  const eventsCol = collection(db, 'events');
  const eventsSnap = await getDocs(query(eventsCol, limit(5)));
  console.log(`Success! Read access is open.`);
  console.log(`Documents count: ${eventsSnap.size}`);
  eventsSnap.docs.forEach((doc, i) => {
    console.log(`  [Event ${i+1}] Title: ${doc.data().title || 'Untitled'}`);
  });
}

testRead()
  .then(() => {
    console.log("Public check passed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Public check failed:", err.message);
    process.exit(1);
  });
