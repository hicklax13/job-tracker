// No custom APIs needed — app uses localStorage directly
// This file exists for future extensibility and electron-builder packaging
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
});
