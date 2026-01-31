import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, "../.env");
        if (!fs.existsSync(envPath)) return {};
        const envContent = fs.readFileSync(envPath, "utf-8");
        const env = {};
        envContent.split("\n").forEach(line => {
            const [key, value] = line.split("=");
            if (key && value) env[key.trim()] = value.trim();
        });
        return env;
    } catch (e) {
        console.error("Error loading .env", e);
        return {};
    }
}

const env = loadEnv();

const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
    console.error("Missing Firebase Config in .env");
    process.exit(1);
}

// Initialize Firebase
// Note: In Node environment with Client SDK, we need to polyfill some globals if strictly required,
// but fetch/blob often suffices in modern node.
// However, 'firebase/storage' uses 'Blob' and 'File'. We might need to handle buffer conversion.
global.XMLHttpRequest = require("xhr2"); // You might need to install 'xhr2' if not present, but let's try.
// Next.js project usually doesn't have xhr2. 
// We will try standard fetch.

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

const ASSETS_DIR = path.resolve(__dirname, "../public/assets");
const MANIFEST_PATH = path.resolve(__dirname, "../src/lib/asset-manifest.json");

// Recursive walk
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
}

async function uploadFile(filePath) {
    const relativePath = path.relative(ASSETS_DIR, filePath);
    // Force forward slashes for storage path
    const storagePath = `assets/${relativePath.split(path.sep).join('/')}`;

    console.log(`Uploading ${relativePath} to ${storagePath}...`);

    const fileBuffer = fs.readFileSync(filePath);
    const storageRef = ref(storage, storagePath);

    // Convert Buffer to Uint8Array (which works for uploadBytes)
    const uint8Array = new Uint8Array(fileBuffer);

    const snapshot = await uploadBytes(storageRef, uint8Array);
    const url = await getDownloadURL(snapshot.ref);
    return { relativePath, url };
}

async function main() {
    try {
        console.log("Authenticating...");
        // Try anonymous first
        try {
            await signInAnonymously(auth);
            console.log("Signed in anonymously");
        } catch (e) {
            console.log("Anonymous auth failed. Trying environment credentials or failing.");
            // If you want to support email/pass:
            if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
                await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
            } else {
                throw new Error("Authentication failed. Please enable Anonymous Auth in Firebase Console or provide ADMIN_EMAIL/ADMIN_PASSWORD env vars.");
            }
        }

        const files = getAllFiles(ASSETS_DIR, []);
        const manifest = {};

        for (const file of files) {
            try {
                const result = await uploadFile(file);
                // Normalize key to be consistent (e.g. forward slashes)
                const key = result.relativePath.split(path.sep).join('/');
                manifest[key] = result.url;
                console.log(`Uploaded: ${key}`);
            } catch (err) {
                console.error(`Failed to upload ${file}:`, err);
            }
        }

        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log(`Manifest saved to ${MANIFEST_PATH}`);

    } catch (error) {
        console.error("Script failed:", error);
        process.exit(1);
    }
}

main();
