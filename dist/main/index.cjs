"use strict";
var electron = require("electron");
var os = require("os");
var path = require("path");
var Store = require("electron-store");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var Store__default = /* @__PURE__ */ _interopDefaultLegacy(Store);
const store = new Store__default["default"]();
electron.ipcMain.handle("electron-store", async (_evnet, methodSign, ...args) => {
  if (typeof store[methodSign] === "function") {
    return store[methodSign](...args);
  }
  return store[methodSign];
});
if (os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs")
    }
  });
  if (electron.app.isPackaged) {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  } else {
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
    win.loadURL(url);
    win.webContents.openDevTools();
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", new Date().toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:"))
      electron.shell.openExternal(url);
    return { action: "deny" };
  });
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
