const fs = require("fs");
const path = require("path");

// Lire le manifest généré par Vite
const viteManifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "dist/vite-manifest.json"), "utf-8")
);

// Lire le manifest de l'extension Chrome
const chromeManifestPath = path.resolve(__dirname, "dist/manifest.json");
const chromeManifest = JSON.parse(fs.readFileSync(chromeManifestPath, "utf-8"));

// Récupérer tous les fichiers générés par Vite
const viteAssets = Object.values(viteManifest).map((entry) => entry.file);

// Ajouter ces fichiers à web_accessible_resources
chromeManifest.web_accessible_resources = [
  {
    resources: viteAssets.concat(["assets/logo.png", "contentMain.js"]),
    matches: ["<all_urls>"],
  },
];

// Écrire le manifest mis à jour
fs.writeFileSync(chromeManifestPath, JSON.stringify(chromeManifest, null, 2));
console.info("Updated manifest.json with Vite assets");
