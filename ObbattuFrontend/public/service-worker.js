"use strict";
// install
self.addEventListener("install", (evt) => {
  console.log("[ServiceWorker] Install");
});
// Active PWA Cache and clear out anything older
self.addEventListener("activate", (evt) => {
  console.log("[ServiceWorker] Activate");
});