const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Здесь вы можете определить функции для взаимодействия с основным процессом
  // Пока оставим пустым
});